// API Client for Spring Boot Microservices Backend
// Gateway: http://localhost:8080/api/v1/*
// Jackson snake_case is configured — fields come as snake_case from the backend
const API_URL = '/api/v1';

function authHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Decodifica o JWT e verifica se já expirou (sem depender do servidor)
function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? payload.exp * 1000 < Date.now() : false;
    } catch {
        return true;
    }
}

// Páginas que NÃO exigem sessão (não redirecionar para login a partir daqui)
function numaPaginaPublica() {
    const p = window.location.pathname;
    return p === '/' || p === '/login' || p === '/registo'
        || p === '/forgot-password' || p === '/reset-password'
        || p === '/equipamentos' || p === '/rastreio' || p === '/ginasio'
        || p.startsWith('/loja') || p.startsWith('/produto')
        || p === '/carrinho' || p === '/checkout' || p.startsWith('/pagamento');
}

function forcarLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    if (!numaPaginaPublica()) {
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?return_url=${returnUrl}`;
    }
}

let isRefreshing = false;

async function request(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
            ...(options.headers || {}),
        },
    });

    // 401 (não autenticado) ou 403 com token expirado → sessão terminou
    if (res.status === 401 || res.status === 403) {
        const token = localStorage.getItem('auth_token');
        const sessaoExpirada = !token || isTokenExpired(token);
        if (sessaoExpirada && !isRefreshing) {
            isRefreshing = true;
            const refreshed = await tryRefreshToken();
            isRefreshing = false;
            if (refreshed) return request(url, options);
            forcarLogout();
            throw new Error('Sessão expirada. Faça login novamente.');
        }
        // 403 com token válido = sem permissão para este recurso (não desloga)
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ mensagem: `Erro ${res.status}` }));
        throw new Error(err.mensagem || err.erro || JSON.stringify(err));
    }

    if (res.status === 204) return {};
    const data = await res.json();
    return data.dados !== undefined ? data.dados : data;
}

async function tryRefreshToken() {
    const rt = localStorage.getItem('refresh_token');
    if (!rt) return false;
    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: rt }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        const auth = data.dados || data;
        localStorage.setItem('auth_token', auth.access_token);
        localStorage.setItem('refresh_token', auth.refresh_token);
        return true;
    } catch {
        return false;
    }
}

// ─── Field mappers: Spring Boot → Frontend-compatible ───────────

function mapPerfilToRole(perfil) {
    const map = {
        'SUPER_USER': 'admin',
        'DONO_DO_GINASIO': 'admin',
        'USUARIO_NORMAL': 'internal_client',
    };
    return map[perfil] || 'external_client';
}

function mapUser(u) {
    if (!u) return null;
    return {
        ...u,
        full_name: u.nome || u.full_name,
        role: u.role || mapPerfilToRole(u.perfil),
        status: u.activo !== false ? 'active' : 'inactive',
        created_date: u.data_criacao,
        foto_url: u.foto_url || u.foto,
        especialidade: u.especialidade,
        bio: u.bio,
        disponibilidade: u.disponibilidade,
        telefone: u.telefone,
    };
}

function mapClient(c) {
    if (!c) return null;
    return {
        ...c,
        full_name: c.nome,
        nome: c.nome,
        telefone: c.numero_telefone,
        numero_telefone: c.numero_telefone,
        tipo: c.tipo_cliente,
        tipo_cliente: c.tipo_cliente,
        foto_url: c.foto,
        status: c.activo !== false ? 'active' : 'inactive',
        created_date: c.data_criacao,
        data_admissao: c.data_admissao,
        personal_trainer_id: c.personal_trainer_id,
    };
}

function mapTrainer(t) {
    if (!t) return null;
    return {
        ...t,
        full_name: t.nome,
        foto_url: t.foto,
        status: t.activo !== false ? 'active' : 'inactive',
        created_date: t.data_criacao,
        clientes_activos: t.clientes_activos,
        especialidade: (t.especialidades || []).join(', '),
    };
}

function mapService(s) {
    if (!s) return null;
    return {
        ...s,
        nome: s.nome,
        preco: s.preco_mensal,
        preco_mensal: s.preco_mensal,
        inclui_pt: s.inclui_pt,
        duracao: s.duracao_sessao,
        status: s.activo !== false ? 'active' : 'inactive',
        created_date: s.data_criacao,
    };
}

function mapProduct(p) {
    if (!p) return null;
    return {
        ...p,
        image: p.imagem_url,
        imagem_url: p.imagem_url,
        price: p.preco,
        category: p.categoria,
        status: p.activo !== false ? 'active' : 'inactive',
        created_date: p.data_criacao,
    };
}

function mapSubscription(s) {
    if (!s) return null;
    return {
        ...s,
        // Aliases nos dois formatos que o frontend usa (client / client_id)
        client: s.cliente_id,
        client_id: s.cliente_id,
        service: s.servico_id,
        service_id: s.servico_id,
        service_nome: s.servico_nome,
        trainer: s.personal_trainer_id,
        trainer_id: s.personal_trainer_id,
        data_inicio: s.data_inicio,
        data_fim: s.data_fim,
        valor_pago: s.preco_pago,
        status: (s.estado || 'ACTIVO').toLowerCase(),
        tipo_plano: s.tipo_plano,
        created_date: s.data_criacao,
    };
}

function mapOrder(v) {
    if (!v) return null;
    return {
        ...v,
        client_id: v.cliente_id,
        total: v.valor_total,
        valor_total: v.valor_total,
        status: (v.estado || 'PENDENTE').toLowerCase(),
        items: v.items || [],
        created_date: v.data_criacao,
    };
}

function mapPayment(p) {
    if (!p) return null;
    return {
        ...p,
        client_id: p.cliente_id,
        valor: p.valor,
        status: (p.estado || p.status || 'pendente').toLowerCase(),
        data_vencimento: p.data_vencimento,
        data_pagamento: p.data_pagamento,
        created_date: p.data_criacao,
    };
}

function unwrapPage(data, mapper) {
    if (data && data.content) return data.content.map(mapper);
    if (Array.isArray(data)) return data.map(mapper);
    return [];
}

// ─── Entity API ─────────────────────────────────────────────────

const entityConfig = {
    Product:  { path: '/produtos',        mapper: mapProduct },
    Service:  { path: '/servicos',        mapper: mapService },
    User:     { path: '/auth/users',      mapper: mapUser },
    Trainer:  { path: '/personal-trainers', mapper: mapTrainer },
    Client:   { path: '/clientes',        mapper: mapClient },
    Tenant:   { path: '/configuracoes',   mapper: x => x },
    Order:    { path: '/vendas',          mapper: mapOrder },
    Payment:  { path: '/pagamentos',      mapper: mapPayment },
    Testimonial: { path: '/testemunhos',  mapper: x => x },
    Lead:     { path: '/leads',           mapper: x => x },
};

class EntityAPI {
    constructor(entityName) {
        this.entityName = entityName;
        const cfg = entityConfig[entityName] || { path: null, mapper: x => x };
        this.basePath = cfg.path ? `${API_URL}${cfg.path}` : null;
        this.mapper = cfg.mapper;
    }

    async list(_sort, limit = 50) {
        if (!this.basePath) return [];
        const data = await request(`${this.basePath}?page=0&size=${limit}&sort=dataCriacao,desc`);
        return unwrapPage(data, this.mapper);
    }

    async filter(params = {}) {
        if (!this.basePath) return [];
        const qs = new URLSearchParams(params).toString();
        const data = await request(`${this.basePath}?${qs}`);
        return unwrapPage(data, this.mapper);
    }

    async get(id) {
        if (!this.basePath) return null;
        const data = await request(`${this.basePath}/${id}`);
        return this.mapper(data);
    }

    async create(data) {
        if (!this.basePath) throw new Error(`${this.entityName} não suportado`);
        const result = await request(this.basePath, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return this.mapper(result);
    }

    async update(id, data) {
        if (!this.basePath) throw new Error(`${this.entityName} não suportado`);
        const result = await request(`${this.basePath}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return this.mapper(result);
    }

    async delete(id) {
        if (!this.basePath) throw new Error(`${this.entityName} não suportado`);
        return await request(`${this.basePath}/${id}`, { method: 'DELETE' });
    }
}

// ─── Exported API ───────────────────────────────────────────────

export const base44 = {
    entities: {
        Product: new EntityAPI('Product'),
        Service: new EntityAPI('Service'),
        User: new EntityAPI('User'),
        Trainer: new EntityAPI('Trainer'),
        Client: new EntityAPI('Client'),
        Tenant: new EntityAPI('Tenant'),
        Order: new EntityAPI('Order'),
        Payment: new EntityAPI('Payment'),
        Testimonial: new EntityAPI('Testimonial'),
        Lead: new EntityAPI('Lead'),
    },
    auth: {
        me: async () => {
            const data = await request(`${API_URL}/auth/me`);
            return mapUser(data);
        },
        login: async (email, password) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json();
            const data = json.dados || json;

            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                const user = mapUser(data.utilizador);
                return { token: data.access_token, user };
            }
            if (!res.ok) throw new Error(json.mensagem || 'Credenciais inválidas');
            return data;
        },
        register: async ({ full_name, email, password }) => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: full_name, email, password }),
            });
            const json = await res.json();
            const data = json.dados || json;

            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                return { token: data.access_token, user: mapUser(data.utilizador) };
            }
            if (!res.ok) throw new Error(json.mensagem || 'Erro no registo');
            return data;
        },
        verifyEmail: async () => ({ verified: true }),
        resendVerification: async () => ({ sent: true }),
        redirectToLogin: (returnUrl) => {
            const qs = returnUrl ? `?return_url=${encodeURIComponent(returnUrl)}` : '';
            window.location.href = `/login${qs}`;
        },
        logout: (returnUrl) => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            window.location.href = returnUrl
                ? `/login?return_url=${encodeURIComponent(returnUrl)}`
                : '/login';
        },
        forgotPassword: async (email) => {
            return await request(`${API_URL}/auth/forgot-password`, {
                method: 'POST', body: JSON.stringify({ email }),
            });
        },
        resetPassword: async (token, password) => {
            return await request(`${API_URL}/auth/reset-password`, {
                method: 'POST', body: JSON.stringify({ token, password }),
            });
        },
        updateMe: async (data) => {
            const result = await request(`${API_URL}/auth/me`, {
                method: 'PATCH', body: JSON.stringify(data),
            });
            return mapUser(result);
        },
    },
    integrations: {
        Core: {
            // Converte o ficheiro para data URL (base64) — evita infra de storage.
            // A imagem fica embutida no próprio campo (foto/imagem_url).
            UploadFile: async ({ file }) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ file_url: reader.result });
                    reader.onerror = () => reject(new Error('Falha ao ler o ficheiro'));
                    reader.readAsDataURL(file);
                });
            },
        },
    },
    admin: {
        createInternalClient: async (data) => {
            const payload = {
                nome: data.full_name || data.nome || data.email.split('@')[0],
                numero_telefone: data.telefone || data.numero_telefone || '000000000',
                sexo: (data.genero || 'MASCULINO').toUpperCase(),
                tipo_cliente: 'INTERNO',
                data_admissao: new Date().toISOString().split('T')[0],
                email: data.email,
            };
            const result = await request(`${API_URL}/clientes`, {
                method: 'POST', body: JSON.stringify(payload),
            });
            return mapClient(result);
        },
        resetPassword: async (userId, newPassword) => {
            return await request(`${API_URL}/auth/users/${userId}`, {
                method: 'PUT', body: JSON.stringify({ password: newPassword }),
            });
        },
        checkExpiringSubscriptions: async () => {
            return await request(`${API_URL}/planos/verificar-expiracoes`, { method: 'POST' });
        },
        testEmail: async (para) => {
            const result = await request(`${API_URL}/email/testar`, {
                method: 'POST',
                body: JSON.stringify(para ? { para } : {}),
            });
            return { success: true, sent_to: result?.enviado_para || para };
        },
    },
    subscriptions: {
        list: async (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            const data = await request(`${API_URL}/planos${qs ? '?' + qs : ''}`);
            return unwrapPage(data, mapSubscription);
        },
        create: async (data) => {
            const tipoMap = { monthly: 'MENSALIDADE', quarterly: 'PACOTE', annual: 'PACOTE', custom: 'PACOTE' };
            const payload = {
                cliente_id: data.client || data.client_id || data.cliente_id,
                servico_id: data.service || data.service_id || data.servico_id || null,
                tipo_plano: tipoMap[data.tipo_duracao] || data.tipo_plano || 'MENSALIDADE',
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                preco_pago: parseFloat(data.valor_pago ?? data.preco_pago) || 0,
                personal_trainer_id: data.trainer || data.trainer_id || data.personal_trainer_id || null,
            };
            const result = await request(`${API_URL}/planos`, {
                method: 'POST', body: JSON.stringify(payload),
            });
            return mapSubscription(result);
        },
        update: async (id, data) => {
            const estadoMap = { active: 'ACTIVO', expired: 'EXPIRADO', cancelled: 'CANCELADO' };
            const payload = {
                personal_trainer_id: data.trainer || data.trainer_id || data.personal_trainer_id || null,
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                preco_pago: parseFloat(data.valor_pago ?? data.preco_pago) || undefined,
                estado: estadoMap[data.status],
            };
            const result = await request(`${API_URL}/planos/${id}`, {
                method: 'PATCH', body: JSON.stringify(payload),
            });
            return mapSubscription(result);
        },
        delete: async (id) => {
            return await request(`${API_URL}/planos/${id}/cancelar`, { method: 'PATCH' });
        },
    },
    // ─── Pagamentos online (gateway PaySuite) ───────────────────
    payments: {
        // Inicia um pagamento e devolve { checkout_url, referencia, ... }
        checkout: async ({ valor, metodo, contexto, contexto_id, cliente_id, descricao, return_url }) => {
            const data = await request(`${API_URL}/checkout`, {
                method: 'POST',
                body: JSON.stringify({
                    valor, metodo, contexto,
                    contexto_id: contexto_id || null,
                    cliente_id: cliente_id || null,
                    descricao,
                    return_url: return_url || `${window.location.origin}/pagamento/retorno`,
                }),
            });
            return {
                ...data,
                checkout_url: data.checkout_url,
                referencia: data.referencia,
            };
        },
        // Consulta o estado (refresca do gateway se ainda pendente)
        status: async (referencia) => {
            return await request(`${API_URL}/checkout/${referencia}`);
        },
        list: async (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            const data = await request(`${API_URL}/checkout${qs ? '?' + qs : ''}`);
            return unwrapPage(data, x => x);
        },
    },
    sessions: {
        list: async (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            const data = await request(`${API_URL}/sessoes${qs ? '?' + qs : ''}`);
            return unwrapPage(data, x => ({
                ...x,
                client_id: x.cliente_id,
                trainer_id: x.trainer_id,
                created_date: x.data_criacao,
            }));
        },
        create: async (data) => {
            const payload = { ...data, client: data.client || data.client_id, trainer: data.trainer || data.trainer_id };
            return await request(`${API_URL}/sessoes`, { method: 'POST', body: JSON.stringify(payload) });
        },
        update: async (id, data) => request(`${API_URL}/sessoes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: async (id) => request(`${API_URL}/sessoes/${id}`, { method: 'DELETE' }),
    },
    notifications: {
        list: async (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            const data = await request(`${API_URL}/notificacoes${qs ? '?' + qs : ''}`);
            return unwrapPage(data, x => ({ ...x, read: x.lida, created_date: x.data_criacao }));
        },
        markRead: async (id) => request(`${API_URL}/notificacoes/${id}/lida`, { method: 'PATCH' }),
        delete: async (id) => request(`${API_URL}/notificacoes/${id}`, { method: 'DELETE' }),
    },
    users: {
        changePassword: async (_currentPassword, newPassword) => {
            return await request(`${API_URL}/auth/me`, {
                method: 'PATCH', body: JSON.stringify({ password: newPassword }),
            });
        },
        inviteUser: async (email, role, extra = {}) => {
            const perfilMap = {
                'admin': 'DONO_DO_GINASIO',
                'staff': 'DONO_DO_GINASIO',
                'personal_trainer': 'USUARIO_NORMAL',
                'internal_client': 'USUARIO_NORMAL',
            };
            const result = await request(`${API_URL}/auth/users`, {
                method: 'POST',
                body: JSON.stringify({
                    nome: extra.full_name || email.split('@')[0],
                    email,
                    password: extra.password || 'Temp@2026',
                    perfil: perfilMap[role] || 'USUARIO_NORMAL',
                    role,
                    especialidade: extra.especialidade,
                    bio: extra.bio,
                    disponibilidade: extra.disponibilidade,
                    telefone: extra.telefone,
                    foto_url: extra.foto_url,
                }),
            });
            return mapUser(result);
        },
        promoteUser: async (userId) => {
            return await request(`${API_URL}/auth/users/${userId}`, {
                method: 'PUT',
                body: JSON.stringify({ perfil: 'DONO_DO_GINASIO' }),
            });
        },
    },
};
