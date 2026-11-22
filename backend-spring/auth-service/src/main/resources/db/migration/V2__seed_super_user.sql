-- ═══════════════════════════════════════════════════════════════
-- SEED: Utilizadores iniciais do sistema
-- ═══════════════════════════════════════════════════════════════

-- 1. SUPER_USER — acesso total
-- Email: admin@gym.com | Password: Admin@2026
INSERT INTO utilizadores (id, nome, email, password, perfil, activo, data_criacao, data_actualizacao)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Super Admin',
    'admin@gym.com',
    '$2b$10$tYCD/nEJf4uDMKe0oioeW.fw8V5G635HOa15sRikFk0iYFsh1X98u',
    'SUPER_USER', TRUE, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. DONO_DO_GINASIO — gere o ginásio
-- Email: dono@gym.com | Password: Dono@2026
INSERT INTO utilizadores (id, nome, email, password, perfil, activo, data_criacao, data_actualizacao)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'Arsenio Baquir',
    'dono@gym.com',
    '$2b$10$0XMk/1nWWsNlEvtAPiObbuNQWooYFrYDwgCKmoYW8mwBYnp0RgBrO',
    'DONO_DO_GINASIO', TRUE, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. USUARIO_NORMAL (Personal Trainer) — gere os seus alunos
-- Email: trainer@gym.com | Password: Trainer@2026
INSERT INTO utilizadores (id, nome, email, password, perfil, activo, data_criacao, data_actualizacao)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'Carlos Treinador',
    'trainer@gym.com',
    '$2b$10$Bi19YUXPhvZbscrExfRll.RSaZUcWuoPRjK/wr6.XchMC9P1Zd5Iy',
    'USUARIO_NORMAL', TRUE, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 4. USUARIO_NORMAL (segundo PT)
-- Email: trainer2@gym.com | Password: Trainer@2026
INSERT INTO utilizadores (id, nome, email, password, perfil, activo, data_criacao, data_actualizacao)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    'Maria Fitness',
    'trainer2@gym.com',
    '$2b$10$Bi19YUXPhvZbscrExfRll.RSaZUcWuoPRjK/wr6.XchMC9P1Zd5Iy',
    'USUARIO_NORMAL', TRUE, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

-- 5. USUARIO_NORMAL (Cliente interno de teste)
-- Email: cliente@gym.com | Password: Cliente@2026
INSERT INTO utilizadores (id, nome, email, password, perfil, activo, data_criacao, data_actualizacao)
VALUES (
    'a0000000-0000-0000-0000-000000000005',
    'João Cliente',
    'cliente@gym.com',
    '$2b$10$xGVmnq85UXPVlP1FOQTDJOC7VJM.qkJCGN76SXOMFPondkxnO.INW',
    'USUARIO_NORMAL', TRUE, NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;
