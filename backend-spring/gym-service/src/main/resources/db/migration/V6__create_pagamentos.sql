-- ═══════════════════════════════════════════════════════════════
-- Pagamentos (mensalidades e outros pagamentos dos membros)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID,
    valor DECIMAL(10,2) NOT NULL,
    tipo VARCHAR(30) DEFAULT 'mensalidade',
    metodo VARCHAR(30),
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    data_vencimento DATE,
    data_pagamento TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_cliente ON pagamentos(cliente_id);
