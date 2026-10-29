import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos Noiré Perfumes...');

  // 1. Limpieza de datos previa (orden por llaves foráneas)
  await prisma.pedido.deleteMany();
  await prisma.perfume.deleteMany();
  await prisma.user.deleteMany();

  // 2. Creación de usuarios con contraseña hasheada (bcrypt salt 10)
  const passwordHashAdmin = await bcrypt.hash('Admin123*', 10);
  const passwordHashUser = await bcrypt.hash('Cliente123*', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Noiré',
      email: 'admin@noireperfumes.co',
      password: passwordHashAdmin,
      role: Role.ADMIN,
    },
  });

  const cliente = await prisma.user.create({
    data: {
      name: 'Sebastián Pinilla',
      email: 'cliente@noireperfumes.co',
      password: passwordHashUser,
      role: Role.USER,
    },
  });

  console.log(`✅ Usuarios creados: Admin (${admin.email}) y Cliente (${cliente.email})`);

  // 3. Catálogo oficial de los 8 perfumes reales de la Entrega 1
  const perfumesData = [
    {
      nombre: 'Sauvage Elixir',
      marca: 'Christian Dior',
      precio: 890000,
      categoria: 'hombres',
      tipo: 'disenador',
      familiaOlfativa: 'Amaderada Especiada',
      concentracion: 'Parfum Concentré',
      notas: 'Canela, Nuez Moscada, Lavanda y Regaliz',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/Sauvage%20Elixir.jpg',
      descripcion: 'Fragancia nocturna con una concentración inusualmente alta de especias ardientes y maderas nobles.',
      stock: 12,
    },
    {
      nombre: 'Aventus',
      marca: 'House of Creed',
      precio: 1750000,
      categoria: 'hombres',
      tipo: 'nicho',
      familiaOlfativa: 'Chipre Frutal',
      concentracion: 'Eau de Parfum',
      notas: 'Piña ahumada, Grosellas negras, Abedul y Almizcle',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/aventus.jpg',
      descripcion: 'Obra maestra de la perfumería británica inspirada en la fuerza, el éxito y el legado de emperadores históricos.',
      stock: 8,
    },
    {
      nombre: 'Coco Mademoiselle',
      marca: 'Chanel',
      precio: 980000,
      categoria: 'mujeres',
      tipo: 'disenador',
      familiaOlfativa: 'Ámbar Floral',
      concentracion: 'Eau de Parfum Intense',
      notas: 'Naranja Siciliana, Rosa de Mayo, Pachulí y Vainilla',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/Coco%20Mademoiselle.jpg',
      descripcion: 'La esencia de una mujer libre y audaz. Un oriental ambarino de carácter afirmado, sorprendentemente fresco.',
      stock: 15,
    },
    {
      nombre: 'Delina Exclusif',
      marca: 'Parfums de Marly',
      precio: 1620000,
      categoria: 'mujeres',
      tipo: 'nicho',
      familiaOlfativa: 'Floral Oriental',
      concentracion: 'Extrait de Parfum',
      notas: 'Lichi, Rosa Turca, Incienso, Oud y Ámbar',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/Delina%20Exclusif.jpg',
      descripcion: 'Un ramillete floral suntuoso y sensual, vestido con un velo de misterio oriental e incienso aterciopelado.',
      stock: 7,
    },
    {
      nombre: 'XJ 1861 Naxos',
      marca: 'Xerjoff',
      precio: 1380000,
      categoria: 'unisex',
      tipo: 'nicho',
      familiaOlfativa: 'Aromático Especiado',
      concentracion: 'Eau de Parfum',
      notas: 'Miel, Hojas de Tabaco, Lavanda, Limón y Vainilla',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/XJ%201861%20Naxos.jpg',
      descripcion: 'Homenaje a la grandeza y belleza de Sicilia; un contraste radiante entre cítricos mediterráneos, tabaco y miel dorada.',
      stock: 10,
    },
    {
      nombre: 'Ani Extrait',
      marca: 'Nishane',
      precio: 1450000,
      categoria: 'unisex',
      tipo: 'nicho',
      familiaOlfativa: 'Ámbar Floral Vainilla',
      concentracion: 'Extrait de Parfum',
      notas: 'Jengibre, Bergamota, Grosellas, Vainilla y Cardamomo',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/Ani%20Extrait.jpg',
      descripcion: 'Reconocido mundialmente como el rey de las fragancias de vainilla especiada. Una creación cálida y magnética.',
      stock: 9,
    },
    {
      nombre: 'Oud Wood',
      marca: 'Tom Ford',
      precio: 1290000,
      categoria: 'unisex',
      tipo: 'disenador',
      familiaOlfativa: 'Ámbar Amaderada',
      concentracion: 'Eau de Parfum',
      notas: 'Madera de Oud, Palo de Rosa, Sándalo y Vetiver',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/Oud%20Wood.jpg',
      descripcion: 'Uno de los ingredientes más raros y caros del mundo, la madera de oud envuelta en sándalo y vetiver humeante.',
      stock: 11,
    },
    {
      nombre: 'Libre Intense',
      marca: 'Yves Saint Laurent',
      precio: 840000,
      categoria: 'mujeres',
      tipo: 'disenador',
      familiaOlfativa: 'Ámbar Fougère',
      concentracion: 'Eau de Parfum',
      notas: 'Lavanda francesa, Flor de Azahar de Marruecos y Orquídea',
      imagenUrl: 'https://raw.githubusercontent.com/PGSebas/Proyecto-semestral/en_desarrollo/assets/images/Libre%20Intense.jpg',
      descripcion: 'La fragancia de una mujer instintiva, salvaje y más libre que nunca. Una tensión ardiente entre lavanda y orquídea.',
      stock: 14,
    },
  ];

  const perfumesCreados = [];
  for (const p of perfumesData) {
    const perfume = await prisma.perfume.create({ data: p });
    perfumesCreados.push(perfume);
  }

  console.log(`✅ Catálogo creado con ${perfumesCreados.length} perfumes reales.`);

  // 4. Pedido de interacción inicial de demostración para el usuario cliente
  const primerPedido = await prisma.pedido.create({
    data: {
      userId: cliente.id,
      perfumeId: perfumesCreados[0].id, // Sauvage Elixir
      cantidad: 1,
      direccionEnvio: 'Calle 100 # 15-20, Bogotá D.C.',
      telefono: '+57 300 123 4567',
      mensaje: 'Por favor incluir muestras de la casa Xerjoff.',
      estado: 'CONFIRMADO',
    },
  });

  console.log(`✅ Pedido de prueba creado: ID ${primerPedido.id} para ${cliente.name}`);
  console.log('🎉 Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
