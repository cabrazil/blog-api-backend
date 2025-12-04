#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface TagData {
  name: string;
}

async function populateTags() {
  try {
    console.log('🚀 Iniciando população de Tags...');
    
    // Ler arquivo CSV
    const csvPath = '/home/cabrazil/newprojs/blogs/Tags.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse do CSV
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    const dataLines = lines.slice(1);
    
    console.log(`📊 Encontradas ${dataLines.length} tags no arquivo CSV`);
    
    const blogId = 3;
    const tags: TagData[] = [];
    
    // Processar cada linha do CSV
    for (const line of dataLines) {
      if (line.trim()) {
        const values = line.split(',');
        const name = values[0]?.trim();
        
        if (name) {
          tags.push({ name });
        }
      }
    }
    
    console.log(`📋 Processando ${tags.length} tags para blogId: ${blogId}`);
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    
    // Processar cada tag
    for (const tagData of tags) {
      try {
        // Gerar slug baseado no nome
        const slug = tagData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '-') // Substitui espaços por hífens
          .replace(/-+/g, '-') // Remove hífens duplicados
          .trim();
        
        // Verificar se a tag já existe (por nome ou slug)
        const existingTag = await prisma.tag.findFirst({
          where: {
            blogId: blogId,
            OR: [
              { name: tagData.name },
              { slug: slug }
            ]
          }
        });
        
        if (existingTag) {
          // Atualizar tag existente
          await prisma.tag.update({
            where: { id: existingTag.id },
            data: {
              name: tagData.name,
              slug: slug,
              updatedAt: new Date()
            }
          });
          updated++;
          console.log(`✅ Atualizada: ${tagData.name}`);
        } else {
          // Criar nova tag
          await prisma.tag.create({
            data: {
              name: tagData.name,
              slug: slug,
              blogId: blogId,
              color: generateRandomColor(),
              aiRelated: false
            }
          });
          created++;
          console.log(`🆕 Criada: ${tagData.name}`);
        }
        
      } catch (error) {
        console.error(`❌ Erro ao processar tag "${tagData.name}":`, error);
        skipped++;
      }
    }
    
    console.log('\n📊 Resumo da operação:');
    console.log(`✅ Tags criadas: ${created}`);
    console.log(`🔄 Tags atualizadas: ${updated}`);
    console.log(`⏭️ Tags ignoradas: ${skipped}`);
    console.log(`📈 Total processado: ${created + updated + skipped}`);
    
    // Verificar total de tags no banco para este blog
    const totalTags = await prisma.tag.count({
      where: { blogId: blogId }
    });
    
    console.log(`📊 Total de tags no banco para blogId ${blogId}: ${totalTags}`);
    
  } catch (error) {
    console.error('❌ Erro durante a população de tags:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

// Executar script
if (require.main === module) {
  populateTags()
    .then(() => {
      console.log('🎉 Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export { populateTags };
