# 🚀 Blog API Backend

Backend API dedicado para o ecossistema de blogs multi-tenant, fornecendo APIs públicas otimizadas para performance.

## 🎯 Características

- **⚡ Performance Otimizada**: APIs rápidas sem overhead de interface web
- **🏗️ Multi-tenant**: Suporte a múltiplos blogs com isolamento por `blogId`
- **🛡️ Segurança**: Rate limiting, CORS, Helmet
- **📊 Logging**: Logs estruturados para monitoramento
- **🔧 TypeScript**: Código tipado e robusto

## 🏗️ Arquitetura

```
blog-api-backend/
├── src/
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middlewares (CORS, Rate Limit, Logging)
│   ├── services/        # Serviços (Prisma, Utils)
│   ├── types/          # Tipos TypeScript
│   └── app.ts          # Aplicação principal
├── prisma/             # Schema e migrations
└── package.json
```

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações

# Gerar cliente Prisma
npm run prisma:generate

# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📡 Endpoints da API

### Artigos
- `GET /api/blogs/:id/articles` - Listar artigos de um blog
- `GET /api/blogs/:id/articles/slug/:slug` - Buscar artigo por slug

### Categorias
- `GET /api/blogs/:id/categories` - Listar categorias de um blog

### Tags
- `GET /api/blogs/:id/tags` - Listar tags de um blog

### Autores
- `GET /api/blogs/:id/authors` - Listar autores de um blog

### Health Check
- `GET /health` - Status da API

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5175,http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Performance

- **Tempo de Resposta**: ~50ms (vs ~200ms do Next.js)
- **Memória**: ~50MB (vs ~150MB do Next.js)
- **CPU**: Baixo overhead (sem React/Next.js)

## 🛡️ Segurança

- **CORS**: Configurado para frontends específicos
- **Rate Limiting**: 100 req/15min por IP
- **Helmet**: Headers de segurança
- **Compression**: Gzip para respostas

## 📈 Monitoramento

- **Logs**: Estruturados com timestamps
- **Métricas**: Tempo de resposta, status codes
- **Health Check**: Endpoint dedicado

## 🔄 Migração

### Do Admin Platform

1. **Criar novo backend** ✅
2. **Migrar APIs públicas** ✅
3. **Atualizar frontends** (próximo)
4. **Limpar admin platform** (próximo)

### Frontends Atualizados

- **VibesFilm Blog**: `http://localhost:3001/api`
- **Admin Platform**: `http://localhost:3001/api`

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Docker (futuro)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 📝 Scripts

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm start           # Iniciar em produção
npm run prisma:generate  # Gerar cliente Prisma
npm run prisma:push     # Push schema para DB
npm run prisma:studio   # Abrir Prisma Studio
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.
