-- ═══════════════════════════════════════════════════════════════
-- Transformações (histórias reais de sucesso — antes/depois na landing)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS transformacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    antes TEXT NOT NULL,
    depois TEXT NOT NULL,
    tempo VARCHAR(50),
    resultado TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

INSERT INTO transformacoes (nome, antes, depois, tempo, resultado, ordem) VALUES
('Ricardo M.', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop', 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&h=500&fit=crop', '6 meses', 'Perdeu 20kg e ganhou massa muscular', 1),
('Carla S.', 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=400&h=500&fit=crop', 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=500&fit=crop', '4 meses', 'Transformação completa com treino personalizado', 2),
('André P.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop', '8 meses', 'De sedentário a atleta — ganho de 12kg de músculo', 3)
ON CONFLICT DO NOTHING;
