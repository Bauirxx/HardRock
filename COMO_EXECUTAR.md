# Hard Rock Gym - Guia de Execução

## Status: 100% FUNCIONAL ✓

Todos os componentes estão funcionando e comunicando corretamente.

---

## Iniciar o Sistema

### Opção 1: Em Dois Terminais (RECOMENDADO)

**Terminal 1 - Django Backend (porta 8000):**
```bash
cd backend-django
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - React Frontend (porta 5173):**
```bash
npm run dev
```

### Opção 2: Usando o build de produção

```bash
# Build frontend
npm run build

# Servir o build (em outro terminal)
cd dist
python -m http.server 3000

# E ainda executar Django em outro terminal
cd backend-django
python manage.py runserver 0.0.0.0:8000
```

---

## Acessar a Aplicação

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Admin Django:** http://localhost:8000/admin

---

## Credenciais de Teste

Use qualquer uma destas contas para testar:

| Email | Senha | Acesso |
|-------|-------|--------|
| admin@hardrock.com | admin123 | Admin (Gestão Total) |
| staff@hardrock.com | admin123 | Staff |
| internal@hardrock.com | admin123 | Membro |
| external@hardrock.com | admin123 | Cliente Loja |
| trainer@hardrock.com | admin123 | Personal Trainer |

---

## Fluxo de Uso

### 1. Landing Page
- Acesse http://localhost:5173
- Veja o **Hero Slider** com imagens automáticas (3 slides)
- Navegue com setas ou pontos indicadores
- Veja produtos destacados, depoimentos

### 2. Criar Conta (Registo)
- Clique em "Criar conta" na página de login
- Preencha: Nome, Email, Senha, **Género**, **Idade**
- Receba código de verificação no console (desenvolvimento)
- Verifique email com código
- Pronto! Sua conta está criada

### 3. Login
- Acesse http://localhost:5173/login
- Email e Senha
- Animação de bíceps (💪) na base
- Após login, vai para dashboard apropriado

### 4. Admin Dashboard (para admin@hardrock.com)
- **Clientes:** Gerencie membros (com género + idade)
- **Produtos:** Adicione/edite produtos
- **Configurações → Hero Slider:** Adicione/remova imagens do slider
- **Configurações → Contactos:** Atualize endereço, telefone, etc

### 5. Recuperar Senha
- Clique "Recuperar senha" na página de login
- Digite email
- Receba link em console (desenvolvimento)
- Use link para redefinir senha

---

## Endpoints da API

```
POST   /api/auth/login              Login
POST   /api/auth/register           Criar conta
POST   /api/auth/verify-email       Verificar email
POST   /api/auth/forgot-password    Recuperar senha
POST   /api/auth/reset-password     Redefinir senha
GET    /api/auth/me                 Dados do utilizador logado
PATCH  /api/auth/me                 Atualizar perfil

GET    /api/entities/products       Listar produtos
GET    /api/entities/testimonials   Listar depoimentos
GET    /api/entities/tenants        Listar configurações (hero_images, etc)

POST   /api/upload                  Carregar arquivo
```

---

## O que Funciona

✅ **Autenticação Completa**
- Login com JWT
- Registro com género e idade
- Verificação de email
- Recuperação de senha com token

✅ **Banco de Dados**
- PostgreSQL com persistência total
- 9 modelos (Users, Products, Orders, Services, etc)
- Hero images armazenadas em JSON

✅ **Frontend Responsivo**
- Landing page com hero slider automático
- Login com animações
- Admin dashboard funcional
- Formulários validados

✅ **Comunicação Backend-Frontend**
- API REST funcionando
- CORS configurado corretamente
- Proxy Vite redirecionando /api

✅ **Email System**
- Verificação de registo
- Reset de senha
- Convites de utilizadores
- (Console em desenvolvimento, SMTP em produção)

---

## Solução de Problemas

### "API não está respondendo"
- ✓ Verifique se Django está rodando: http://localhost:8000/api/auth/me
- ✓ Verifique se você está na porta correta (8000, não 5173)
- ✓ Reinicie Django após mudanças em settings.py

### "Hero Slider não aparece"
- ✓ Verifique se executou: `python manage.py seed_db`
- ✓ Verifique se há hero_images em: /api/entities/tenants
- ✓ Atualize a página (Ctrl+Shift+R para cache)

### "Login não funciona"
- ✓ Certifique-se de usar credenciais corretas
- ✓ Verifique console do navegador para erros
- ✓ Reinicie ambos os servidores

### "Problemas de CORS"
- ✓ Já configurado para localhost:5173
- ✓ Se usar porta diferente, atualize CORS_ALLOWED_ORIGINS em settings.py

---

## Banco de Dados

Dados pré-populados:
- 1 Tenant: "Hard Rock Gym"
- 5 Usuários: admin, staff, internal, external, trainer
- 3 Produtos: Whey Protein, Dumbbells, T-shirt
- 2 Clientes
- 2 Depoimentos
- 2 Serviços
- 3 Hero Images (Unsplash)

Para resetar:
```bash
cd backend-django
python manage.py flush
python manage.py migrate
python manage.py seed_db
```

---

## Build para Produção

```bash
# Frontend
npm run build
# Resultado em: dist/

# Backend
cd backend-django
python manage.py collectstatic
gunicorn fitgym_core.wsgi -b 0.0.0.0:8000
```

---

## Documentação Técnica

- **Frontend:** React 18 + Vite + TailwindCSS + Framer Motion
- **Backend:** Django 4.2 + DRF + PostgreSQL
- **Auth:** JWT (djangorestframework-simplejwt)
- **Email:** SMTP com fallback console
- **Deploy Ready:** Gunicorn + Whitenoise

---

**Última atualização:** 2026-04-17
**Status:** Funcionando 100%
