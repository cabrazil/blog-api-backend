# 🚀 Guia de Migração para PostgreSQL Docker VPS

Este guia documenta as mudanças necessárias para migrar do Supabase para PostgreSQL Docker no VPS.

## 📋 Mudanças Realizadas

### 1. Schema Prisma
- `DIRECT_URL` agora é opcional no schema.prisma
- Para PostgreSQL Docker direto, pode usar o mesmo `DATABASE_URL` ou omitir

### 2. Variáveis de Ambiente

**Antes (Supabase):**
```env
DATABASE_URL="postgresql://postgres.dadrodpfylduydjbdxpy:Supa@2605ab@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.dadrodpfylduydjbdxpy:Supa@2605ab@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**Depois (PostgreSQL Docker VPS):**
```env
DATABASE_URL=postgresql://blogadmin:Sec010203@178.156.178.145:5435/blogs
# DIRECT_URL não é necessário para PostgreSQL Docker direto (sem pooler)
# Foi removido do schema.prisma para evitar avisos do editor
```

## 🔧 Passos para Configuração

### 1. Atualizar o arquivo `.env`

Certifique-se de que o `.env` está configurado corretamente:

```env
# Postgres VPS Blogs
DATABASE_URL=postgresql://blogadmin:Sec010203@178.156.178.145:5435/blogs
DIRECT_URL=postgresql://blogadmin:Sec010203@178.156.178.145:5435/blogs

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:5175,http://localhost:5173,http://localhost:3000,http://localhost:3002"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 2. Gerar o Prisma Client

```bash
cd /home/cabrazil/newprojs/blogs/blog-api-backend
npm run prisma:generate
```

### 3. Aplicar Migrations ou Push do Schema

**Opção A: Se você já tem migrations:**
```bash
npm run prisma:migrate
```

**Opção B: Se não tem migrations (push direto):**
```bash
npm run prisma:push
```

⚠️ **Atenção**: `prisma db push` aplica mudanças diretamente sem criar migrations. Use apenas em desenvolvimento.

### 4. Verificar Conexão

**Opção A: Usar o script de teste:**
```bash
node test-connection.js
```

**Opção B: Usar Prisma Studio:**
```bash
npm run prisma:studio
```

**Opção C: Teste manual via código:**
```bash
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('✅ Conectado!'); prisma.\$disconnect(); }).catch(e => { console.error('❌ Erro:', e); process.exit(1); });"
```

### 5. Iniciar o Servidor

```bash
npm run dev
```

Ou em produção:

```bash
npm run build
npm start
```

## 🔍 Verificações

### Teste de Health Check
```bash
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Blog API Backend is running",
  "timestamp": "2025-01-XX...",
  "version": "1.0.0"
}
```

### Teste de Endpoint da API
```bash
curl http://localhost:3001/api/blogs/3/articles
```

## ⚠️ Problemas Comuns

### 1. Erro de Conexão
- Verifique se o PostgreSQL Docker está rodando no VPS
- Verifique se a porta 5435 está acessível
- Verifique credenciais (usuário: `blogadmin`, senha: `Sec010203`)
- Verifique se o banco `blogs` existe

### 2. Erro de Migrations
- Se houver conflitos, você pode precisar resetar o banco (CUIDADO: apaga dados!)
- Ou ajustar migrations manualmente

### 3. CORS
- Certifique-se de que `CORS_ORIGIN` inclui todas as origens necessárias
- Verifique os logs do servidor para ver quais origens estão sendo bloqueadas

## 📝 Notas Importantes

1. **Segurança**: A senha está no `.env` - nunca commite este arquivo!
2. **Backup**: Faça backup do banco antes de aplicar migrations
3. **Porta**: O PostgreSQL está na porta 5435 (não padrão 5432)
4. **IP**: O VPS está em `178.156.178.145`

## 🔄 Próximos Passos

1. ✅ Configurar `.env`
2. ✅ Gerar Prisma Client
3. ✅ Aplicar schema/migrations
4. ✅ Testar conexão
5. ✅ Iniciar servidor
6. ✅ Testar endpoints

