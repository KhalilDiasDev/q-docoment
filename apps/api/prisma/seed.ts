import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@doc-versioning.local' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@doc-versioning.local',
      passwordHash,
      role: 'admin',
    },
  });

  const project = await prisma.project.upsert({
    where: { slug: 'projeto-exemplo' },
    update: {},
    create: {
      name: 'Projeto Exemplo',
      slug: 'projeto-exemplo',
    },
  });

  console.log('Seed criado:', { admin: admin.email, project: project.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
