#!/bin/bash

# Script para remover env.development e env.production do GitHub
# Este script força a remoção mesmo que os arquivos não apareçam no Git local

set -e

echo "🗑️  Removendo env.development e env.production do GitHub..."
echo ""

cd "$(dirname "$0")/.."

# Passo 1: Tentar remover do índice
echo "1️⃣  Removendo do índice do Git..."
git rm --cached env.development 2>/dev/null || echo "   ⚠️  env.development não encontrado no índice"
git rm --cached env.production 2>/dev/null || echo "   ⚠️  env.production não encontrado no índice"

# Passo 2: Usar filter-branch para remover do histórico
echo ""
echo "2️⃣  Removendo do histórico completo..."
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch env.development env.production" \
  --prune-empty --tag-name-filter cat -- --all 2>/dev/null || true

# Passo 3: Limpar referências antigas
echo ""
echo "3️⃣  Limpando referências antigas..."
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin 2>/dev/null || true
git reflog expire --expire=now --all 2>/dev/null || true
git gc --prune=now --aggressive 2>/dev/null || true

# Passo 4: Criar commit de remoção explícita
echo ""
echo "4️⃣  Criando commit de remoção..."
git add .gitignore
git commit -m "remove: remover env.development e env.production do repositório" 2>/dev/null || \
git commit --allow-empty -m "remove: remover env.development e env.production do repositório"

echo ""
echo "✅ Processo concluído!"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Execute: git push origin --force --all"
echo "   2. Isso irá sobrescrever o histórico no GitHub"
echo ""
echo "⚠️  ATENÇÃO: Force push reescreve o histórico!"
echo "   Certifique-se de que ninguém mais está trabalhando no repositório"
echo "   ou avise a equipe antes de fazer o push."

