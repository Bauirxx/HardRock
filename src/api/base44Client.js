// Custom Local Wrapper replacing @base44/sdk
const API_URL = 'http://127.0.0.1:8000/api';

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
            console.log('DEBUG: Sending me() request with token:', token ? 'Exists' : 'MISSING');
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json' 
                }
            });
            if (!res.ok) throw new Error('Falha na autenticação');
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
        inviteUser: async (email, role) => {
            console.log("Mocking invite user", email, role);
            return { success: true };
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
