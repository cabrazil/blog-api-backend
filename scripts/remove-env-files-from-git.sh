#!/bin/bash

# Script para remover env.development e env.production do Git
# Este script remove os arquivos do índice do Git e do histórico

set -e

echo "🔍 Verificando se os arquivos estão sendo rastreados pelo Git..."

# Verificar se os arquivos existem no índice do Git
if git ls-files --error-unmatch env.development env.production >/dev/null 2>&1; then
    echo "⚠️  Arquivos encontrados no índice do Git. Removendo..."
    git rm --cached env.development env.production
    echo "✅ Arquivos removidos do índice do Git"
else
    echo "✅ Arquivos não estão sendo rastreados pelo Git"
fi

# Verificar se os arquivos existem no repositório remoto
echo ""
echo "🔍 Verificando repositório remoto..."
git fetch origin 2>/dev/null || true

REMOTE_FILES=$(git ls-tree -r origin/main --name-only 2>/dev/null | grep -E "^env\.(development|production)$" || true)

if [ -n "$REMOTE_FILES" ]; then
    echo "⚠️  Arquivos encontrados no repositório remoto:"
    echo "$REMOTE_FILES"
    echo ""
    echo "📝 Para remover do repositório remoto, execute:"
    echo "   git rm --cached env.development env.production"
    echo "   git commit -m 'remove: remover arquivos env.development e env.production'"
    echo "   git push origin main"
else
    echo "✅ Arquivos não encontrados no repositório remoto"
fi

echo ""
echo "✅ Verificação concluída!"
echo ""
echo "💡 Se os arquivos ainda aparecerem no GitHub:"
echo "   1. Execute: git rm --cached env.development env.production"
echo "   2. Execute: git commit -m 'remove: remover arquivos sensíveis'"
echo "   3. Execute: git push origin main"

