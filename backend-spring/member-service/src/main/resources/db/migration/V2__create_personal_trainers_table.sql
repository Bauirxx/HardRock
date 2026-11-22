CREATE TABLE personal_trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilizador_id UUID NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    bio TEXT,
    foto VARCHAR(500),
    telefone VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pt_especialidades (
    pt_id UUID NOT NULL REFERENCES personal_trainers(id) ON DELETE CASCADE,
    especialidade VARCHAR(50) NOT NULL
);

CREATE TABLE pt_certificacoes (
    pt_id UUID NOT NULL REFERENCES personal_trainers(id) ON DELETE CASCADE,
    certificacao VARCHAR(100) NOT NULL
);

CREATE INDEX idx_pt_utilizador ON personal_trainers(utilizador_id);
CREATE INDEX idx_pt_activo ON personal_trainers(activo);
