-- ═══════════════════════════════════════════════════════════════
-- Expandir configuracoes: horários estruturados, localização,
-- cor primária e configuração SMTP (editável nas Configurações)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS latitude VARCHAR(40);
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS longitude VARCHAR(40);
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS primary_color VARCHAR(20);
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS email_host VARCHAR(120);
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS email_port INTEGER;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS email_username VARCHAR(150);
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS email_password VARCHAR(255);
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS horarios JSONB DEFAULT '[]'::jsonb;

-- Horário por defeito, caso ainda não exista configuração
UPDATE configuracoes
SET horarios = '[
  {"dia": "Segunda a Sexta", "horas": "06:00 — 22:00"},
  {"dia": "Sábado", "horas": "08:00 — 20:00"},
  {"dia": "Domingo", "horas": "08:00 — 13:00"}
]'::jsonb
WHERE horarios IS NULL OR horarios = '[]'::jsonb;
