-- ═══════════════════════════════════════════════════════════════
-- SEED: Serviços do ginásio
-- ═══════════════════════════════════════════════════════════════

INSERT INTO servicos (id, nome, descricao, preco_mensal, duracao_sessao, inclui_pt, activo, data_criacao)
VALUES
    ('d0000000-0000-0000-0000-000000000001',
     'Musculação',
     'Acesso completo à sala de musculação com equipamento de última geração. Inclui programa de treino personalizado.',
     3500.00, 60, FALSE, TRUE, NOW()),

    ('d0000000-0000-0000-0000-000000000002',
     'Musculação + PT',
     'Musculação com acompanhamento de Personal Trainer dedicado. Programa personalizado e sessões guiadas.',
     6000.00, 60, TRUE, TRUE, NOW()),

    ('d0000000-0000-0000-0000-000000000003',
     'Crossfit',
     'Aulas de Crossfit em grupo com instrutor certificado. Alta intensidade e resultados rápidos.',
     4500.00, 45, TRUE, TRUE, NOW()),

    ('d0000000-0000-0000-0000-000000000004',
     'Funcional',
     'Treino funcional focado em movimentos do dia-a-dia. Ideal para iniciantes e reabilitação.',
     3000.00, 45, FALSE, TRUE, NOW()),

    ('d0000000-0000-0000-0000-000000000005',
     'Pacote VIP',
     'Acesso ilimitado a todas as modalidades + Personal Trainer dedicado + nutricionista + sauna.',
     10000.00, 90, TRUE, TRUE, NOW())
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- SEED: Planos activos de teste
-- ═══════════════════════════════════════════════════════════════

INSERT INTO planos (id, cliente_id, servico_id, tipo_plano, data_inicio, data_fim, preco_pago, estado, personal_trainer_id, activo, data_criacao)
VALUES
    ('e0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000002',
     'MENSALIDADE', '2026-06-01', '2026-07-01', 6000.00, 'ACTIVO',
     'b0000000-0000-0000-0000-000000000001',
     TRUE, NOW()),

    ('e0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000002',
     'd0000000-0000-0000-0000-000000000003',
     'MENSALIDADE', '2026-06-01', '2026-07-01', 4500.00, 'ACTIVO',
     'b0000000-0000-0000-0000-000000000002',
     TRUE, NOW())
ON CONFLICT DO NOTHING;
