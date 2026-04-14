-- 1. TENANTS (Ginásios)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    nome VARCHAR(255) NOT NULL,
    subdominio VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','suspended','pending')),
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#DC2626',
    secondary_color VARCHAR(20) DEFAULT '#000000',
    whatsapp_number VARCHAR(50),
    google_maps_embed TEXT,
    endereco TEXT,
    horario_funcionamento VARCHAR(255) DEFAULT 'Seg-Sex 6h-22h, Sáb 8h-18h',
    email_notificacao VARCHAR(255),
    telefone VARCHAR(50),
    descricao TEXT,
    banners JSONB DEFAULT '[]',           -- array de URLs string
    redes_sociais JSONB DEFAULT '{}',     -- {instagram, facebook, youtube, twitter, tiktok}
    videos_youtube JSONB DEFAULT '[]'     -- [{titulo, url}]
);

-- 2. USERS (gerido pelo Base44/Auth — referência)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin','personal_trainer','client','user'))
);

-- 3. CLIENTS (Membros do Ginásio)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    bi_numero VARCHAR(50),
    data_nascimento DATE,
    endereco TEXT,
    foto_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active','inactive','suspended','pending')),
    servicos_contratados JSONB DEFAULT '[]',  -- [{servico_id, nome, preco_mensal, data_inicio, data_fim}]
    contato_emergencia JSONB DEFAULT '{}',    -- {nome, telefone, parentesco}
    notas TEXT
);

-- 4. PRODUCTS (Produtos da Loja)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    preco_promocional DECIMAL(10,2),
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('supplement','clothing','accessory','machine','equipment')),
    categoria VARCHAR(100),
    is_machine BOOLEAN DEFAULT FALSE,
    ficha_tecnica JSONB DEFAULT '{}',     -- {peso, dimensoes, garantia, marca, material}
    stock_quantidade INTEGER DEFAULT 0,
    sku VARCHAR(100),
    imagens JSONB DEFAULT '[]',           -- array de URLs string
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','out_of_stock')),
    sob_consulta BOOLEAN DEFAULT FALSE,
    destaque BOOLEAN DEFAULT FALSE
);

-- 5. SERVICES (Planos/Aulas do Ginásio)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_mensal DECIMAL(10,2) NOT NULL,
    preco_trimestral DECIMAL(10,2),
    preco_anual DECIMAL(10,2),
    duracao_sessao INTEGER,               -- em minutos
    max_participantes INTEGER,
    horarios JSONB DEFAULT '[]',          -- [{dia, hora_inicio, hora_fim}]
    imagem_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive')),
    destaque BOOLEAN DEFAULT FALSE
);

-- 6. ORDERS (Encomendas)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id),
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    endereco_entrega JSONB DEFAULT '{}',  -- {rua, cidade, codigo_postal, pais}
    items JSONB NOT NULL DEFAULT '[]',    -- [{product_id, nome, preco, quantidade, imagem}]
    subtotal DECIMAL(10,2),
    taxa_entrega DECIMAL(10,2) DEFAULT 0,
    desconto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    metodo_pagamento VARCHAR(20) CHECK (metodo_pagamento IN ('mpesa','emola','card','cash')),
    status_pagamento VARCHAR(20) DEFAULT 'pending' CHECK (status_pagamento IN ('pending','processing','paid','failed','refunded')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
    tracking_code VARCHAR(50) UNIQUE,     -- formato: LS-YYYYMMDD-XXXXX
    tracking_url TEXT,
    notas TEXT,
    payment_reference VARCHAR(255)
);

-- 7. PAYMENTS (Pagamentos)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id),
    order_id UUID REFERENCES orders(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('mensalidade','produto','servico','outro')),
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(20) CHECK (metodo IN ('mpesa','emola','card','cash','transfer')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed','refunded')),
    referencia_externa VARCHAR(255),
    data_pagamento TIMESTAMPTZ,
    recibo_url TEXT,
    periodo_referencia VARCHAR(20)        -- ex: "2026-04"
);

-- 8. LEADS (Contactos/Prospectos)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(50) NOT NULL,
    interesse VARCHAR(255),
    mensagem TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','contacted','converted','lost')),
    notas TEXT,
    fonte VARCHAR(30) DEFAULT 'landing_page' CHECK (fonte IN ('landing_page','whatsapp','referral','social_media','other'))
);

-- 9. TESTIMONIALS (Depoimentos)
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    stars INTEGER DEFAULT 5 CHECK (stars BETWEEN 1 AND 5),
    foto_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected'))
);

-- =============================================
-- ÍNDICES para performance
-- =============================================
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);

CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_machine ON products(is_machine);
CREATE INDEX idx_products_destaque ON products(destaque);

CREATE INDEX idx_services_tenant ON services(tenant_id);
CREATE INDEX idx_services_status ON services(status);

CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_tracking ON orders(tracking_code);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_status ON leads(status);

CREATE INDEX idx_testimonials_tenant ON testimonials(tenant_id);
CREATE INDEX idx_testimonials_status ON testimonials(status);

-- =============================================
-- TRIGGER: updated_date automático
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_date();
