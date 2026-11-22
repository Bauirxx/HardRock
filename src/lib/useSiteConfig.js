import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Configuração institucional do ginásio (nome, contactos, redes, horário,
// localização...) — carregada uma única vez de /configuracoes e partilhada.
let cache = null;
let inflight = null;

export function loadSiteConfig() {
    if (cache) return Promise.resolve(cache);
    if (!inflight) {
        inflight = base44.entities.Tenant.list('-created_date', 1)
            .then(list => { cache = list?.[0] || {}; return cache; })
            .catch(() => { cache = {}; return cache; });
    }
    return inflight;
}

// Permite recarregar após guardar nas Configurações
export function clearSiteConfigCache() {
    cache = null;
    inflight = null;
}

export function useSiteConfig() {
    const [config, setConfig] = useState(cache || {});

    useEffect(() => {
        let mounted = true;
        loadSiteConfig().then(c => { if (mounted) setConfig(c || {}); });
        return () => { mounted = false; };
    }, []);

    return config || {};
}
