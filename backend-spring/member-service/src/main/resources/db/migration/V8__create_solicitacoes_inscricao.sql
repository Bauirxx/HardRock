-- ═══════════════════════════════════════════════════════════════
-- Solicitações de inscrição no ginásio (pré-inscrição online)
-- Fluxo controlado: pendente → aprovado/rejeitado por um funcionário.
-- NÃO cria automaticamente um cliente/membro activo.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS solicitacoes_inscricao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    telefone VARCHAR(40) NOT NULL,
    email VARCHAR(160),
    plano_pretendido VARCHAR(120),
    mensagem TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    revisto_por VARCHAR(160),
    cliente_id UUID,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes_inscricao (status);
