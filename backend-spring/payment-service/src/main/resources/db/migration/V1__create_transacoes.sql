-- ═══════════════════════════════════════════════════════════════
-- Transações de pagamento (gateway PaySuite)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referencia VARCHAR(50) NOT NULL UNIQUE,
    paysuite_id VARCHAR(60),
    valor NUMERIC(12,2) NOT NULL,
    metodo VARCHAR(20),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    contexto VARCHAR(20) NOT NULL,
    contexto_id UUID,
    cliente_id UUID,
    descricao VARCHAR(150),
    checkout_url TEXT,
    transaction_id VARCHAR(80),
    paid_at TIMESTAMP,
    erro TEXT,
    webhook_request_id VARCHAR(80),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transacoes_referencia ON transacoes(referencia);
CREATE INDEX IF NOT EXISTS idx_transacoes_paysuite ON transacoes(paysuite_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_cliente ON transacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_contexto ON transacoes(contexto, contexto_id);
