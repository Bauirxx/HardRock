// Simple tenant store - in production, this would be resolved from subdomain
const TENANT_KEY = 'current_tenant_id';

export function getCurrentTenantId() {
    return localStorage.getItem(TENANT_KEY) || null;
}

export function setCurrentTenantId(id) {
    localStorage.setItem(TENANT_KEY, id);
}

export function generateTrackingCode() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GYM-${dateStr}-${random}`;
}