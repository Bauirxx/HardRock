-- ═══════════════════════════════════════════════════════════════
-- Fotos passam a TEXT para suportar data URLs (base64) do upload
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE clientes ALTER COLUMN foto TYPE TEXT;
ALTER TABLE personal_trainers ALTER COLUMN foto TYPE TEXT;
