-- ═══════════════════════════════════════════════════════════════
-- Expandir utilizadores: role detalhado (UI) + campos de trainer
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS role VARCHAR(30);
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS especialidade VARCHAR(150);
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS disponibilidade VARCHAR(200);
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS telefone VARCHAR(30);
ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Popular role dos utilizadores existentes com base no perfil/email
UPDATE utilizadores SET role = CASE
    WHEN perfil IN ('SUPER_USER', 'DONO_DO_GINASIO') THEN 'admin'
    WHEN email LIKE 'trainer%' THEN 'personal_trainer'
    ELSE 'internal_client'
END
WHERE role IS NULL;

-- Especialidades de exemplo para os trainers de seed
UPDATE utilizadores SET especialidade = 'Musculação e Hipertrofia', bio = 'Personal trainer certificado com foco em ganho de massa muscular.'
WHERE email = 'trainer@gym.com';
UPDATE utilizadores SET especialidade = 'Emagrecimento e Cardio', bio = 'Especialista em perda de peso e condicionamento físico.'
WHERE email = 'trainer2@gym.com';

CREATE INDEX IF NOT EXISTS idx_utilizadores_role ON utilizadores(role);
