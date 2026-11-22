-- ═══════════════════════════════════════════════════════════════
-- Expandir tabela clientes com campos da ficha usados pelo frontend
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email VARCHAR(150);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS idade INTEGER;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS endereco VARCHAR(255);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS notas TEXT;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS plano_atual VARCHAR(100);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS historico_doencas TEXT;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS praticava_exercicios BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS detalhes_exercicios TEXT;
