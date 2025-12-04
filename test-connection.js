#!/usr/bin/env node

/**
 * Script de teste de conexão com o banco de dados PostgreSQL
 * Uso: node test-connection.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testando conexão com o banco de dados...\n');
  
  // Verificar variáveis de ambiente
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrado no .env');
    process.exit(1);
  }
  
  console.log('📋 Configuração:');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`   DIRECT_URL: ${process.env.DIRECT_URL ? process.env.DIRECT_URL.replace(/:[^:@]+@/, ':****@') : 'Não definido (usando DATABASE_URL)'}`);
  console.log('');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  
  try {
    // Testar conexão
    console.log('🔄 Conectando ao banco...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Testar query simples
    console.log('🔄 Testando query...');
    const blogCount = await prisma.blog.count();
    console.log(`✅ Query executada com sucesso!`);
    console.log(`   Total de blogs encontrados: ${blogCount}\n`);
    
    // Listar alguns blogs
    if (blogCount > 0) {
      console.log('📋 Blogs encontrados:');
      const blogs = await prisma.blog.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
        },
      });
      
      blogs.forEach(blog => {
        console.log(`   - [${blog.id}] ${blog.name} (${blog.slug}) - ${blog.status}`);
      });
      
      if (blogCount > 5) {
        console.log(`   ... e mais ${blogCount - 5} blogs`);
      }
      console.log('');
    }
    
    console.log('✅ Todos os testes passaram!');
    console.log('🚀 O banco de dados está configurado corretamente.\n');
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Dica: Verifique se o PostgreSQL está rodando no VPS');
      console.error('   e se a porta 5435 está acessível.\n');
    } else if (error.code === 'P1001') {
      console.error('💡 Dica: Verifique as credenciais (usuário/senha) no DATABASE_URL\n');
    } else if (error.code === 'P1003') {
      console.error('💡 Dica: Verifique se o banco de dados "blogs" existe\n');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão encerrada.');
  }
}

testConnection();

