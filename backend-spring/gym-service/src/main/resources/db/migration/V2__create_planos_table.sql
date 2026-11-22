CREATE TABLE planos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL,
    servico_id UUID NOT NULL REFERENCES servicos(id),
    tipo_plano VARCHAR(15) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    preco_pago DECIMAL(10,2) NOT NULL,
    estado VARCHAR(15) NOT NULL DEFAULT 'ACTIVO',
    personal_trainer_id UUID,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_planos_cliente ON planos(cliente_id);
CREATE INDEX idx_planos_servico ON planos(servico_id);
CREATE INDEX idx_planos_estado ON planos(estado);
CREATE INDEX idx_planos_pt ON planos(personal_trainer_id);
CREATE INDEX idx_planos_data_fim ON planos(data_fim);
