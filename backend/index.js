const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const emailService = require('./services/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || 'hardrock_super_secret_key_123';


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// File Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const file_url = `${backendUrl}/uploads/${req.file.filename}`;
    res.json({ file_url });
});

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

// Public Settings for AuthContext
app.get('/api/apps/public/prod/public-settings/by-id/:id', async (req, res) => {
    console.log(`[DEBUG] Public settings requested for ID: ${req.params.id}`);
    try {
        res.json({
            id: req.params.id,
            nome: 'Hard Rock Gym Local',
            public_settings: {
                require_auth: false,
                registration_open: true
            }
        });
        console.log(`[DEBUG] Public settings sent successfully`);
    } catch (err) {
        console.error(`[DEBUG ERROR] Public settings failed:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Utility to map frontend entity names to Prisma models (plural lowercase)
const getPrismaModel = (name) => {
    const map = {
        'Client': 'clients',
        'Lead': 'leads',
        'Order': 'orders',
        'Payment': 'payments',
        'Product': 'products',
        'Service': 'services',
        'Testimonial': 'testimonials',
        'User': 'users',
        'Tenant': 'tenants',
        'App': 'tenants' // Fallback for some default requests
    };
    return map[name] || name.toLowerCase();
};

// Dynamic Entities Route
app.get('/api/entities/:entityName', async (req, res) => {
    try {
        const entityName = getPrismaModel(req.params.entityName);
        const query = req.query;
        
        const { sort, limit, ...filtersRaw } = query;
        
        const filters = {};
        for (const [key, value] of Object.entries(filtersRaw)) {
            if (value === 'true') filters[key] = true;
            else if (value === 'false') filters[key] = false;
            else filters[key] = value;
        }

        const data = await prisma[entityName].findMany({
            where: filters,
            take: limit ? parseInt(limit) : 100,
            orderBy: sort ? { [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc' } : { created_date: 'desc' }
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/entities/:entityName', async (req, res) => {
    try {
        const entityName = getPrismaModel(req.params.entityName);
        const data = await prisma[entityName].create({
            data: req.body
        });

        // Trigger Welcome Email for new Clients
        if (entityName === 'clients' && data.email) {
            await emailService.sendWelcomeEmail({
                nome: data.nome,
                email: data.email
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/entities/:entityName/:id', async (req, res) => {
    try {
        const entityName = getPrismaModel(req.params.entityName);
        const { id } = req.params;
        const data = await prisma[entityName].update({
            where: { id },
            data: req.body
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/entities/:entityName/:id', async (req, res) => {
    try {
        const entityName = getPrismaModel(req.params.entityName);
        const { id } = req.params;
        await prisma[entityName].delete({
            where: { id }
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Authentication Real Implementation
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // In our frontend, base44Client might just send it in headers. Let's support 'Bearer TOKEN' or just 'TOKEN'
    let token = authHeader;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Forbidden" });
        req.user = user;
        next();
    });
};

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.users.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ error: "User not found" });
        
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const data = req.body;
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await prisma.users.update({ where: { id: req.user.id }, data });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log(`[DEBUG] Login attempt for email: ${req.body.email}`);
    try {
        const { email, password } = req.body;
        
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            console.log(`[DEBUG] User not found: ${email}`);
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        
        const validPassword = await bcrypt.compare(password, user.password || '');
        if (!validPassword) {
            console.log(`[DEBUG] Invalid password for: ${email}`);
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        
        console.log(`[DEBUG] Login successful for: ${email} (${user.role})`);
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(`[DEBUG ERROR] Login failed:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Promotion Endpoint: External -> Internal
app.post('/api/users/:id/promote', async (req, res) => {
    try {
        const { id } = req.params;
        const { tenantId } = req.body; 

        // 1. Update user role
        const updatedUser = await prisma.users.update({
            where: { id },
            data: { role: 'internal_client' }
        });

        // 2. Create client record if doesn't exist
        const client = await prisma.clients.upsert({
            where: { email: updatedUser.email },
            update: { status: 'active' },
            create: {
                nome: updatedUser.full_name || 'Membro Novo',
                email: updatedUser.email,
                telefone: '999999999',
                tenant_id: tenantId,
                status: 'active'
            }
        });

        // 3. Send REAL Notification via Brevo
        await emailService.sendPromotionEmail(updatedUser);

        res.json({ success: true, user: updatedUser, client });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hard Rock Gym API running on http://127.0.0.1:${PORT}`);
});

// attempt DB connection in background
prisma.$connect()
    .then(() => console.log('Successfully connected to Database via Prisma'))
    .catch(e => console.error('Prisma connection failed (Mocks will still work):', e.message));
