# Hard Rock Gym - Guia de Uso

## ⚡ OPÇÃO RÁPIDA (Windows)

1. Clique duas vezes em: **START.bat**
2. O sistema inicia automaticamente
3. Navegador abre em: http://localhost:5175
4. Faça login e pronto!

---

## 📋 OPÇÃO MANUAL

### Passo 1: Abra o Terminal 1 (Django Backend)

```bash
cd d:\HardRock--main\backend-django
python manage.py runserver 0.0.0.0:8000
```

**Você verá:**
```
Watching for file changes with StatReloader
Django version 4.2.30, using settings 'fitgym_core.settings'
Starting development server at http://127.0.0.1:8000/
```

✅ **NÃO FECHE ESTE TERMINAL!**

---

### Passo 2: Abra o Terminal 2 (Vite Frontend)

```bash
cd d:\HardRock--main
npm run dev
```

**Você verá:**
```
VITE v6.4.2 ready in XXX ms

➜  Local:   http://localhost:5175/
```

✅ **NÃO FECHE ESTE TERMINAL!**

---

### Passo 3: Abra o Navegador

Vá para: **http://localhost:5175**

---

### Passo 4: Faça Login

**Email:** `admin@hardrock.com`  
**Senha:** `admin123`

---

## 🎯 O Que Funciona

✅ Landing page com Hero Slider automático (3 imagens)  
✅ Login com JWT  
✅ Admin Dashboard  
✅ Gestão de Membros (com género e idade)  
✅ Gestão de Produtos  
✅ Configuração de Hero Images  
✅ Registro de novos utilizadores  
✅ Recuperação de senha  

---

## 👥 Contas de Teste

| Email | Senha | Acesso |
|-------|-------|--------|
| admin@hardrock.com | admin123 | Admin (Gestão Total) |
| staff@hardrock.com | admin123 | Staff |
| internal@hardrock.com | admin123 | Membro |
| external@hardrock.com | admin123 | Cliente Loja |

---

## ⚠️ IMPORTANTE

**O sistema precisa de 2 terminais abertos ao mesmo tempo:**

1. **Terminal 1:** Django (porta 8000)
2. **Terminal 2:** Vite (porta 5175)

**Se fechar um dos terminais, o sistema para de funcionar!**

---

## 🔧 Solução de Problemas

### "Página em branco"
- Aguarde 5-10 segundos (compilação)
- Recarregue com Ctrl+F5

### "Erro de conexão ao fazer login"
- Verifique se Django está rodando no Terminal 1
- Verifique se Vite está rodando no Terminal 2
- Recarregue a página

### "Porta em uso"
Django tenta portas: 8000, 8001, 8002...  
Vite tenta portas: 5173, 5174, 5175...

Se ver porta diferente, ajuste no navegador.

---

## 🌐 URLs

- **Frontend:** http://localhost:5175
- **Backend API:** http://localhost:8000/api
- **Admin Django:** http://localhost:8000/admin

---

## 📝 Arquivos Úteis

- `INICIAR.txt` - Instruções em texto puro
- `START.bat` - Script automático para Windows
- `COMO_EXECUTAR.md` - Guia técnico detalhado

---

**Sistema 100% Funcional! ✓**

Última atualização: 2026-04-17
