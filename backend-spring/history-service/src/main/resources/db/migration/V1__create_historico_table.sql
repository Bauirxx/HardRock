CREATE TABLE historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL,
    accao VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    realizado_por VARCHAR(150) NOT NULL,
    dados_anteriores TEXT,
    dados_novos TEXT,
    data_registro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historico_cliente ON historico(cliente_id);
CREATE INDEX idx_historico_accao ON historico(accao);
CREATE INDEX idx_historico_data ON historico(data_registro);
