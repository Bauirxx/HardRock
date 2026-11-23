-- Adiciona sexo e idade aos pedidos de inscrição (para organizar/filtrar no admin)
ALTER TABLE solicitacoes_inscricao ADD COLUMN IF NOT EXISTS sexo VARCHAR(15);
ALTER TABLE solicitacoes_inscricao ADD COLUMN IF NOT EXISTS idade INTEGER;
