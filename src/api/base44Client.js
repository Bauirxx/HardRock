// Custom Local Wrapper replacing @base44/sdk
<<<<<<< HEAD
// Use relative path so Vite proxy can handle it
const API_URL = '/api';
=======
const API_URL = 'http://127.0.0.1:8000/api';
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

const modelMap = {
    Product: 'products',
    Service: 'services',
    User: 'users',
    Client: 'clients',
    Tenant: 'tenants',
    Order: 'orders',
    Payment: 'payments',
    Testimonial: 'testimonials',
    Lead: 'leads'
};

class EntityAPI {
    constructor(entityName) {
        this.endpoint = `${API_URL}/entities/${modelMap[entityName] || entityName.toLowerCase() + 's'}`;
    }

    async filter(params = {}) {
        const urlParams = new URLSearchParams(params).toString();
        const res = await fetch(`${this.endpoint}?${urlParams}`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return await res.json();
    }

    async list(sort = '-created_date', limit = 50) {
        const res = await fetch(`${this.endpoint}?sort=${sort}&limit=${limit}`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return await res.json();
    }

    async get(id) {
        const res = await fetch(`${this.endpoint}?id=${id}`);
        const data = await res.json();
        return data.length ? data[0] : null;
    }

    async create(data) {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await res.json();
    }

    async update(id, data) {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await res.json();
    }

    async delete(id) {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE'
        });
        return await res.json();
    }
}

export const base44 = {
    entities: {
        Product: new EntityAPI('Product'),
        Service: new EntityAPI('Service'),
        User: new EntityAPI('User'),
        Client: new EntityAPI('Client'),
        Tenant: new EntityAPI('Tenant'),
        Order: new EntityAPI('Order'),
        Payment: new EntityAPI('Payment'),
        Testimonial: new EntityAPI('Testimonial'),
        Lead: new EntityAPI('Lead')
    },
    auth: {
        me: async () => {
            const token = localStorage.getItem('auth_token');
<<<<<<< HEAD
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Não autenticado');
            }
=======
            console.log('DEBUG: Sending me() request with token:', token ? 'Exists' : 'MISSING');
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json' 
                }
            });
            if (!res.ok) throw new Error('Falha na autenticação');
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
            return await res.json();
        },
        updateMe: async (data) => {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL}/auth/me`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            });
            return await res.json();
        },
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
            }
            return data;
        },
<<<<<<< HEAD
        register: async ({ full_name, email, password, genero, idade }) => {
            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name, email, password, genero, idade })
                });
                if (res.ok) return await res.json();
            } catch {
                // Backend not yet exposing /auth/register — fall through to local stub
            }
            // Local stub: simulate pending verification
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const pending = { full_name, email, password, genero, idade, code, created_at: Date.now() };
            localStorage.setItem('pending_registration', JSON.stringify(pending));
            console.info('[register mock] verification code for', email, '=', code);
            return { pending: true, email, mock: true };
        },
        verifyEmail: async ({ email, code }) => {
            try {
                const res = await fetch(`${API_URL}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code })
                });
                if (res.ok) return await res.json();
            } catch {
                // fall through
            }
            const raw = localStorage.getItem('pending_registration');
            if (!raw) throw new Error('Nenhum registo pendente encontrado.');
            const pending = JSON.parse(raw);
            if (pending.email !== email) throw new Error('Email não corresponde ao registo pendente.');
            if (pending.code !== code) throw new Error('Código de verificação inválido.');
            localStorage.removeItem('pending_registration');
            return { verified: true, email, mock: true };
        },
        resendVerification: async ({ email }) => {
            try {
                const res = await fetch(`${API_URL}/auth/resend-verification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (res.ok) return await res.json();
            } catch {
                // fall through
            }
            const raw = localStorage.getItem('pending_registration');
            if (!raw) throw new Error('Nenhum registo pendente.');
            const pending = JSON.parse(raw);
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem('pending_registration', JSON.stringify({ ...pending, code }));
            console.info('[register mock] new verification code for', email, '=', code);
            return { sent: true, mock: true };
        },
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
        redirectToLogin: (returnUrl) => {
            const path = returnUrl ? `?return_url=${encodeURIComponent(returnUrl)}` : '';
            window.location.href = `/login${path}`;
        },
        logout: (returnUrl) => {
            localStorage.removeItem('auth_token');
            if (returnUrl) {
                window.location.href = `/login?return_url=${encodeURIComponent(returnUrl)}`;
            } else {
                window.location.href = '/login';
            }
<<<<<<< HEAD
        },
        forgotPassword: async (email) => {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) throw new Error('Falha ao enviar reset de senha');
            return await res.json();
        },
        resetPassword: async (token, password) => {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            if (!res.ok) throw new Error('Falha ao redefinir senha');
            return await res.json();
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                const formData = new FormData();
                formData.append('file', file);
                const token = localStorage.getItem('auth_token');
                const res = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: formData
                });
                if (!res.ok) throw new Error('Falha ao enviar arquivo');
                return await res.json();
            }
        }
    },
    users: {
<<<<<<< HEAD
        inviteUser: async (email, role, extra = {}) => {
            try {
                const token = localStorage.getItem('auth_token');
                const res = await fetch(`${API_URL}/auth/invite`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, role, ...extra })
                });
                if (res.ok) return await res.json();
            } catch {
                // fall through
            }
            const token = `inv_${Math.random().toString(36).slice(2, 10)}`;
            console.info('[invite mock]', email, role, 'token=', token);
            return { success: true, email, role, invite_token: token, mock: true };
=======
        inviteUser: async (email, role) => {
            console.log("Mocking invite user", email, role);
            return { success: true };
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
        },
        promoteUser: async (userId, tenantId) => {
            const res = await fetch(`${API_URL}/users/${userId}/promote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId })
            });
            return await res.json();
        }
    }
};
