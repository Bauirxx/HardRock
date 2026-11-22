-- ═══════════════════════════════════════════════════════════════
-- SEED: Personal Trainers
-- ═══════════════════════════════════════════════════════════════

INSERT INTO personal_trainers (id, utilizador_id, nome, bio, telefone, activo, data_criacao)
VALUES
    ('b0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000003',
     'Carlos Treinador',
     'Personal Trainer certificado com 8 anos de experiência em musculação e condicionamento físico. Especialista em transformação corporal.',
     '841234567', TRUE, NOW()),

    ('b0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000004',
     'Maria Fitness',
     'Instrutora de Crossfit e funcional com certificação internacional. Apaixonada por ajudar mulheres a atingirem os seus objectivos.',
     '842345678', TRUE, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO pt_especialidades (pt_id, especialidade) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Musculação'),
    ('b0000000-0000-0000-0000-000000000001', 'Perda de peso'),
    ('b0000000-0000-0000-0000-000000000001', 'Hipertrofia'),
    ('b0000000-0000-0000-0000-000000000002', 'Crossfit'),
    ('b0000000-0000-0000-0000-000000000002', 'Funcional'),
    ('b0000000-0000-0000-0000-000000000002', 'Condicionamento');

INSERT INTO pt_certificacoes (pt_id, certificacao) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'CREF'),
    ('b0000000-0000-0000-0000-000000000001', 'NSCA-CPT'),
    ('b0000000-0000-0000-0000-000000000002', 'CrossFit Level 2'),
    ('b0000000-0000-0000-0000-000000000002', 'ACSM');

-- ═══════════════════════════════════════════════════════════════
-- SEED: Clientes
-- ═══════════════════════════════════════════════════════════════

INSERT INTO clientes (id, nome, numero_telefone, sexo, tipo_cliente, servico_atrelado, data_admissao, personal_trainer_id, user_id, activo, data_criacao)
VALUES
    ('c0000000-0000-0000-0000-000000000001',
     'João Cliente', '843456789', 'MASCULINO', 'INTERNO',
     'Musculação', '2026-01-15',
     'b0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000005',
     TRUE, NOW()),

    ('c0000000-0000-0000-0000-000000000002',
     'Ana Membro', '844567890', 'FEMININO', 'INTERNO',
     'Crossfit', '2026-03-01',
     'b0000000-0000-0000-0000-000000000002',
     NULL, TRUE, NOW()),

    ('c0000000-0000-0000-0000-000000000003',
     'Pedro Externo', '845678901', 'MASCULINO', 'EXTERNO',
     NULL, NULL, NULL, NULL, TRUE, NOW())
ON CONFLICT DO NOTHING;
