-- ═══════════════════════════════════════════════════════════════
-- Expandir tabela produtos com campos ricos usados pelo frontend
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE produtos ALTER COLUMN categoria DROP NOT NULL;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS tipo VARCHAR(30);
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS preco_promocional DECIMAL(10,2);
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS sku VARCHAR(60);
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS is_machine BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS sob_consulta BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS destaque BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(300);

ALTER TABLE produtos ALTER COLUMN imagem_url TYPE TEXT;

CREATE TABLE IF NOT EXISTS produto_imagens (
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    imagem TEXT
);

CREATE INDEX IF NOT EXISTS idx_produto_imagens ON produto_imagens(produto_id);
