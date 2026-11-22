-- ═══════════════════════════════════════════════════════════════
-- Sessões de treino e Notificações in-app
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sessoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID,
    trainer_id UUID,
    data DATE,
    hora_inicio VARCHAR(10),
    hora_fim VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    notas TEXT,
    local VARCHAR(120),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessoes_trainer ON sessoes(trainer_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_cliente ON sessoes(cliente_id);

CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT,
    tipo VARCHAR(30) DEFAULT 'info',
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(300),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_user ON notificacoes(user_id);
