# 🚀 Setup do Novo Repositório

## ✅ Checklist Antes do Push

### 1. Verificar arquivos sensíveis

Os seguintes arquivos **NÃO** devem ser commitados:
- `.env`
- `.env.development`
- `.env.production`
- `env.development` (sem ponto)
- `env.production` (sem ponto)
- Qualquer arquivo `.env*.backup.*`

### 2. Verificar .gitignore

O `.gitignore` já está configurado para ignorar:
```
.env
.env.local
.env.development
.env.production
.env*.backup.*
env.development
env.production
```

### 3. Verificar arquivos que SERÃO commitados

Apenas estes arquivos de ambiente devem ser commitados:
- `env.example`
- `env.development.example`
- `env.production.example`

## 📋 Passos para Criar o Novo Repositório

### 1. Criar repositório no GitHub
- Acesse https://github.com/new
- Crie um novo repositório (pode ser com o mesmo nome: `blog-api-backend`)

### 2. Atualizar remote (se necessário)

```bash
cd /home/cabrazil/newprojs/blogs/blog-api-backend

# Se o nome do repositório mudou, atualize o remote:
git remote set-url origin https://github.com/SEU_USUARIO/blog-api-backend.git

# Ou remova e adicione novamente:
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/blog-api-backend.git
```

### 3. Verificar arquivos antes do push

```bash
# Ver quais arquivos serão commitados
git status

# Verificar se arquivos sensíveis estão sendo ignorados
git status --ignored | grep -E "\.env|env\.(development|production)$"
```

### 4. Fazer push inicial

```bash
# Adicionar todos os arquivos (arquivos sensíveis serão ignorados pelo .gitignore)
git add .

# Verificar o que será commitado (IMPORTANTE!)
git status

# Se tudo estiver OK, fazer commit
git commit -m "Initial commit - Blog API Backend"

# Fazer push
git push -u origin main
```

## ⚠️ Verificação Final

Após o push, verifique no GitHub:
1. ✅ Arquivos `.env*` NÃO devem aparecer
2. ✅ Arquivos `env.development` e `env.production` NÃO devem aparecer
3. ✅ Apenas arquivos `.example` devem aparecer
4. ✅ `.gitignore` deve estar presente

## 🔒 Segurança

Se por acaso algum arquivo sensível for commitado:
1. **NÃO faça push** se ainda não fez
2. Remova do índice: `git rm --cached arquivo.env`
3. Adicione ao `.gitignore` se ainda não estiver
4. Faça commit da correção
5. Se já fez push, use `git filter-branch` ou recrie o repositório novamente

## 📝 Comandos Rápidos

```bash
# Verificar o que será commitado
git status

# Ver arquivos ignorados
git status --ignored

# Verificar se arquivo específico está sendo rastreado
git ls-files | grep env

# Remover arquivo do índice (se necessário)
git rm --cached arquivo.env
```

