#!/bin/bash

# Script para forçar remoção de env.development e env.production do GitHub
# Mesmo que os arquivos não apareçam no Git local, este script garante a remoção

set -e

echo "🔍 Verificando arquivos env.development e env.production..."

cd "$(dirname "$0")/.."

# Verificar se os arquivos existem localmente
if [ -f "env.development" ] || [ -f "env.production" ]; then
    echo "⚠️  Arquivos encontrados localmente (serão mantidos)"
fi

# Tentar remover do índice do Git (mesmo que não estejam rastreados)
echo ""
echo "🗑️  Removendo arquivos do índice do Git..."
git rm --cached env.development 2>/dev/null && echo "  ✅ env.development removido" || echo "  ℹ️  env.development não estava no índice"
git rm --cached env.production 2>/dev/null && echo "  ✅ env.production removido" || echo "  ℹ️  env.production não estava no índice"

# Verificar se há mudanças para commitar
if [ -n "$(git status --porcelain | grep -E 'env\.(development|production)')" ]; then
    echo ""
    echo "📝 Criando commit de remoção..."
    git add .gitignore
    git commit -m "remove: remover arquivos env.development e env.production do repositório" || true
    echo "✅ Commit criado"
else
    echo ""
    echo "✅ Nenhuma mudança necessária no índice"
fi

echo ""
echo "📋 Status atual:"
git status --short | grep -E "env\.(development|production)" || echo "  Nenhum arquivo env.* em staging"

echo ""
echo "🚀 Próximos passos:"
echo "   1. Execute: git push origin main"
echo "   2. Se os arquivos ainda aparecerem no GitHub após o push:"
echo "      - Aguarde alguns minutos (pode ser cache do GitHub)"
echo "      - Ou force a atualização da página no GitHub (Ctrl+F5)"
echo ""
echo "💡 Se os arquivos ainda persistirem, pode ser necessário usar git filter-branch"
echo "   ou BFG Repo-Cleaner para removê-los do histórico completo."

