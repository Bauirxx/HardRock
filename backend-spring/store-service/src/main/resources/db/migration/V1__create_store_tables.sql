CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    imagem_url VARCHAR(500),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(15) NOT NULL DEFAULT 'PENDENTE',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_actualizacao TIMESTAMP DEFAULT NOW()
);

CREATE TABLE item_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_vendas_cliente ON vendas(cliente_id);
CREATE INDEX idx_item_venda_venda ON item_venda(venda_id);
