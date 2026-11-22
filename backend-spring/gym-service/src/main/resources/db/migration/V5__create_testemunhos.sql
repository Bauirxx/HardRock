-- ═══════════════════════════════════════════════════════════════
-- Testemunhos (depoimentos de clientes exibidos na landing page)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS testemunhos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    texto TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 5,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    cargo VARCHAR(100),
    foto TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

INSERT INTO testemunhos (nome, texto, stars, status, cargo) VALUES
('Carlos Mabjaia', 'Mudei completamente a minha forma física em 6 meses. Os treinadores são excelentes!', 5, 'approved', 'Membro há 1 ano'),
('Ana Sitoe', 'O melhor ginásio de Maputo. Equipamento moderno e ambiente motivador.', 5, 'approved', 'Membro há 8 meses'),
('João Come', 'Perdi 15kg com o acompanhamento do personal trainer. Recomendo a todos!', 5, 'approved', 'Membro há 6 meses')
ON CONFLICT DO NOTHING;
