-- ═══════════════════════════════════════════════════════════════
-- Leads (contactos do formulário "Quero ser membro" da landing page)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    telefone VARCHAR(30),
    email VARCHAR(150),
    interesse VARCHAR(60),
    mensagem TEXT,
    fonte VARCHAR(40),
    status VARCHAR(20) NOT NULL DEFAULT 'novo',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
