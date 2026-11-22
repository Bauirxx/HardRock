-- ═══════════════════════════════════════════════════════════════
-- Configurações do ginásio (settings — singleton usado pela landing)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150),
    subdominio VARCHAR(60),
    slug VARCHAR(80),
    descricao TEXT,
    logo_url TEXT,
    whatsapp_number VARCHAR(30),
    telefone VARCHAR(30),
    email_notificacao VARCHAR(150),
    endereco TEXT,
    horario_funcionamento VARCHAR(200),
    google_maps_embed TEXT,
    hero_images JSONB DEFAULT '[]',
    redes_sociais JSONB DEFAULT '{}',
    videos JSONB DEFAULT '[]',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

INSERT INTO configuracoes (nome, subdominio, slug, descricao, horario_funcionamento, telefone)
VALUES ('Hard Rock Gym', 'default', 'hard-rock-gym',
        'O melhor ginásio de Maputo com equipamento de ponta e treinadores certificados.',
        'Seg-Sex 6h-22h, Sáb 8h-18h', '+258 84 000 0000')
ON CONFLICT DO NOTHING;
