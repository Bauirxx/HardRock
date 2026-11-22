-- ═══════════════════════════════════════════════════════════════
-- Expandir tabela servicos com campos ricos usados pelo frontend
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE servicos ADD COLUMN IF NOT EXISTS preco_trimestral DECIMAL(10,2);
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS preco_anual DECIMAL(10,2);
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS sessoes_semanais INTEGER;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS max_alunos INTEGER;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS destaque BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS cor VARCHAR(20);

CREATE TABLE IF NOT EXISTS servico_beneficios (
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    beneficio VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS servico_horarios (
    servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    horario VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_servico_beneficios ON servico_beneficios(servico_id);
CREATE INDEX IF NOT EXISTS idx_servico_horarios ON servico_horarios(servico_id);
