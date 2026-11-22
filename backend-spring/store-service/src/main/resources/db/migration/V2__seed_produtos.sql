-- ═══════════════════════════════════════════════════════════════
-- SEED: Produtos da loja
-- ═══════════════════════════════════════════════════════════════

INSERT INTO produtos (id, nome, descricao, categoria, preco, stock, imagem_url, activo, data_criacao)
VALUES
    ('f0000000-0000-0000-0000-000000000001',
     'Whey Protein 1kg',
     'Proteína whey isolada de alta qualidade. 25g de proteína por dose. Sabor chocolate.',
     'SUPLEMENTO', 2500.00, 30,
     'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000002',
     'Creatina Monohidratada 300g',
     'Creatina pura para força e performance. 5g por dose.',
     'SUPLEMENTO', 1200.00, 50,
     'https://images.unsplash.com/photo-1619735790116-a38013178b0f?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000003',
     'Luvas de Treino Pro',
     'Luvas profissionais com grip reforçado e suporte de pulso. Tamanhos M/L/XL.',
     'ACESSORIO', 800.00, 25,
     'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000004',
     'T-Shirt Hard Rock Gym',
     'T-shirt oficial do ginásio. 100% algodão premium. Disponível em preto e branco.',
     'VESTUARIO', 1500.00, 40,
     'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000005',
     'Cinto de Musculação',
     'Cinto de couro profissional para levantamento de peso. Proteção lombar máxima.',
     'EQUIPAMENTO', 2200.00, 15,
     'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000006',
     'Shaker 700ml',
     'Shaker profissional com compartimento para suplementos. Livre de BPA.',
     'ACESSORIO', 450.00, 60,
     'https://images.unsplash.com/photo-1594381898411-846e7d168431?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000007',
     'BCAA 500g',
     'Aminoácidos de cadeia ramificada para recuperação muscular. Sabor tropical.',
     'SUPLEMENTO', 1800.00, 35,
     'https://images.unsplash.com/photo-1579722820903-1e23f4e5b4e6?w=400&h=400&fit=crop',
     TRUE, NOW()),

    ('f0000000-0000-0000-0000-000000000008',
     'Calção de Treino',
     'Calção desportivo respirável com bolsos laterais. Tecido dry-fit.',
     'VESTUARIO', 1200.00, 45,
     'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
     TRUE, NOW())
ON CONFLICT DO NOTHING;
