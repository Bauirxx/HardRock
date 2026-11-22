CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    numero_telefone VARCHAR(20) NOT NULL,
    foto VARCHAR(500),
    bilhete_identidade VARCHAR(30) UNIQUE,
    estado_civil VARCHAR(15),
    sexo VARCHAR(15) NOT NULL,
    numero_familiar VARCHAR(20),
    tipo_cliente VARCHAR(10) NOT NULL,
    servico_atrelado VARCHAR(50),
    data_admissao DATE,
    personal_trainer_id UUID,
    user_id UUID,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clientes_tipo ON clientes(tipo_cliente);
CREATE INDEX idx_clientes_pt ON clientes(personal_trainer_id);
CREATE INDEX idx_clientes_activo ON clientes(activo);
CREATE INDEX idx_clientes_user ON clientes(user_id);
