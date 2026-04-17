const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;`);
    console.log('Dropped legacy role constraint.');
  } catch(e) {
    console.log('Constraint already dropped or missing.', e.message);
  }

  // 1. Create Tenant
  const tenant = await prisma.tenants.upsert({
    where: { subdominio: 'default' },
    update: {},
    create: {
      nome: 'FitGym Premium',
      subdominio: 'default',
      status: 'active',
      primary_color: '#DC2626',
      secondary_color: '#000000',
      endereco: 'Av. Eduardo Mondlane, Maputo',
      telefone: '+258 84 000 0000',
      horario_funcionamento: 'Seg-Sex 5h-22h, Sáb 7h-18h, Dom 8h-13h',
      descricao: 'O melhor ginásio de Moçambique com equipamentos de última geração.',
    },
  });

  console.log(`Tenant created: ${tenant.id}`);

  // 2. Create Products
  const products = [
    {
      nome: 'Whey Protein Gold Standard',
      descricao: 'Proteína de alta qualidade para recuperação muscular.',
      preco: 4500,
      tipo: 'supplement',
      categoria: 'Proteínas',
      stock_quantidade: 50,
      status: 'active',
      destaque: true,
      tenant_id: tenant.id,
    },
    {
      nome: 'Creatina Monohidratada 300g',
      descricao: 'Aumento de força e explosão muscular.',
      preco: 1200,
      tipo: 'supplement',
      categoria: 'Aminoácidos',
      stock_quantidade: 30,
      status: 'active',
      destaque: true,
      tenant_id: tenant.id,
    },
    {
      nome: 'Passadeira Profissional T90',
      descricao: 'Motor de 3HP, inclinação automática.',
      preco: 85000,
      tipo: 'equipment',
      categoria: 'Cardio',
      is_machine: true,
      stock_quantidade: 5,
      status: 'active',
      tenant_id: tenant.id,
    },
  ];

  for (const p of products) {
    await prisma.products.create({ data: p });
  }

  // 3. Create Services
  const services = [
    {
      nome: 'Plano Mensal Full Access',
      descricao: 'Acesso total ao ginásio e aulas de grupo.',
      preco_mensal: 3500,
      status: 'active',
      destaque: true,
      tenant_id: tenant.id,
    },
    {
      nome: 'Plano Trimestral',
      descricao: 'Pague 3 meses com desconto.',
      preco_mensal: 3000,
      preco_trimestral: 9000,
      status: 'active',
      tenant_id: tenant.id,
    },
  ];

  for (const s of services) {
    await prisma.services.create({ data: s });
  }

  // 4. Create Users (Admin, Staff, Internal, External)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Admin
  await prisma.users.upsert({
    where: { email: 'admin@hardrock.com' },
    update: { password: hashedPassword, role: 'admin' },
    create: {
      full_name: 'Administrador Hard Rock',
      email: 'admin@hardrock.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Staff (Funcionário)
  await prisma.users.upsert({
    where: { email: 'staff@hardrock.com' },
    update: { password: hashedPassword, role: 'staff' },
    create: {
      full_name: 'Instrutor Carlos',
      email: 'staff@hardrock.com',
      password: hashedPassword,
      role: 'staff',
    },
  });

  // Internal Client (Membro)
  await prisma.users.upsert({
    where: { email: 'internal@hardrock.com' },
    update: { password: hashedPassword, role: 'internal_client' },
    create: {
      full_name: 'Membro Premium João',
      email: 'internal@hardrock.com',
      password: hashedPassword,
      role: 'internal_client',
    },
  });

  // External Client (Visitante da Loja)
  await prisma.users.upsert({
    where: { email: 'external@hardrock.com' },
    update: { password: hashedPassword, role: 'external_client' },
    create: {
      full_name: 'Visitante da Loja Ana',
      email: 'external@hardrock.com',
      password: hashedPassword,
      role: 'external_client',
    },
  });

  // 5. Create Testimonial
  await prisma.testimonials.create({
    data: {
      nome: 'João Silva',
      texto: 'Melhor investimento na minha saúde. Recomendo!',
      stars: 5,
      status: 'approved',
      tenant_id: tenant.id,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
