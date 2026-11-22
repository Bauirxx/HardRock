-- Permite vendas sem cliente associado (compra de convidado / checkout da loja)
ALTER TABLE vendas ALTER COLUMN cliente_id DROP NOT NULL;
