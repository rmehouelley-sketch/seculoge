import { PrismaClient, UserRole, PropertyType, PropertyStatus, VisitStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.deposit.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.tenantProfile.deleteMany();
  await prisma.ownerProfile.deleteMany();
  await prisma.agentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.applicationSettings.deleteMany();

  // Create application settings
  const settings = await prisma.applicationSettings.create({
    data: {
      id: 'settings-1',
      tenantFeePercentage: 25,
      depositReturnDelayHours: 48,
      companyName: 'SécuLoge',
      companyEmail: 'contact@seculoge.bj',
      companyPhone: '+229 12 34 56 78',
      companyAddress: 'Cotonou, Bénin',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
    },
  });
  console.log('✓ Application settings created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@seculoge.bj',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'SécuLoge',
      phone: '+229 01 23 45 67',
      role: UserRole.ADMIN,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log('✓ Admin user created');

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 12);
  const agent = await prisma.user.create({
    data: {
      email: 'agent@seculoge.bj',
      password: agentPassword,
      firstName: 'Agent',
      lastName: 'SécuLoge',
      phone: '+229 02 34 56 78',
      role: UserRole.AGENT,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  await prisma.agentProfile.create({
    data: {
      userId: agent.id,
      employeeId: 'AGENT-001',
      department: 'Vérification',
      position: 'Agent Immobilier',
    },
  });
  console.log('✓ Agent user created');

  // Create owner users
  const owner1Password = await bcrypt.hash('owner123', 12);
  const owner1 = await prisma.user.create({
    data: {
      email: 'proprietaire1@demo.com',
      password: owner1Password,
      firstName: 'Jean',
      lastName: 'Koffi',
      phone: '+229 03 45 67 89',
      role: UserRole.OWNER,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  await prisma.ownerProfile.create({
    data: {
      userId: owner1.id,
      companyName: 'Immobilier Koffi',
      companyRegNo: 'REG-2023-001',
      taxId: 'TIN-123456',
      bankAccount: 'BJ00100010001',
    },
  });

  const owner2Password = await bcrypt.hash('owner123', 12);
  const owner2 = await prisma.user.create({
    data: {
      email: 'proprietaire2@demo.com',
      password: owner2Password,
      firstName: 'Marie',
      lastName: 'Yao',
      phone: '+229 04 56 78 90',
      role: UserRole.OWNER,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  await prisma.ownerProfile.create({
    data: {
      userId: owner2.id,
      companyName: 'Location Yao',
      companyRegNo: 'REG-2023-002',
      taxId: 'TIN-654321',
      bankAccount: 'BJ00100010002',
    },
  });
  console.log('✓ Owner users created');

  // Create tenant users
  const tenant1Password = await bcrypt.hash('tenant123', 12);
  const tenant1 = await prisma.user.create({
    data: {
      email: 'locataire1@demo.com',
      password: tenant1Password,
      firstName: 'Pierre',
      lastName: 'Assouma',
      phone: '+229 05 67 89 01',
      role: UserRole.TENANT,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  await prisma.tenantProfile.create({
    data: {
      userId: tenant1.id,
      dateOfBirth: new Date('1990-05-15'),
      occupation: 'Enseignant',
      employer: 'Université de Cotonou',
      monthlyIncome: 500000,
      emergencyContact: 'Paul Assouma',
      emergencyPhone: '+229 06 78 90 12',
    },
  });

  const tenant2Password = await bcrypt.hash('tenant123', 12);
  const tenant2 = await prisma.user.create({
    data: {
      email: 'locataire2@demo.com',
      password: tenant2Password,
      firstName: 'Ada',
      lastName: 'Sossou',
      phone: '+229 06 78 90 12',
      role: UserRole.TENANT,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  await prisma.tenantProfile.create({
    data: {
      userId: tenant2.id,
      dateOfBirth: new Date('1988-08-20'),
      occupation: 'Infirmière',
      employer: 'Hôpital de Cotonou',
      monthlyIncome: 450000,
      emergencyContact: 'Luc Sossou',
      emergencyPhone: '+229 07 89 01 23',
    },
  });
  console.log('✓ Tenant users created');

  // Create properties
  const propertyImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  ];

  const properties = [
    {
      title: 'Bel appartement 3 pièces à Akpakpa',
      description: 'Magnifique appartement de 3 pièces situé dans un quartier calme d\'Akpakpa. Proche de toutes commodités, écoles et marchés. Parfait pour une famille.',
      city: 'Cotonou',
      district: 'Akpakpa',
      address: 'Rue 15, Quartier Akpakpa, Cotonou',
      type: PropertyType.APARTMENT,
      roomCount: 3,
      bedroomCount: 2,
      bathroomCount: 1,
      area: 85,
      floor: 1,
      monthlyRent: 150000,
      securityDeposit: 300000,
      hasWater: true,
      hasWaterMeter: true,
      hasElectricity: true,
      hasElectricMeter: true,
      hasInternet: true,
      hasFurniture: true,
      hasAirConditioning: true,
      hasParking: true,
      hasGarden: false,
      hasSecurity: true,
      status: PropertyStatus.PUBLISHED,
      isVerified: true,
      ownerId: owner1.id,
    },
    {
      title: 'Studio meublé à Cocotomey',
      description: 'Studio moderne et meublé à Cocotomey. Idéal pour étudiant ou jeune professionnel. Très bien situé près des transports.',
      city: 'Cotonou',
      district: 'Cocotomey',
      address: 'Rue 25, Quartier Cocotomey, Cotonou',
      type: PropertyType.STUDIO,
      roomCount: 1,
      bedroomCount: 1,
      bathroomCount: 1,
      area: 35,
      floor: 0,
      monthlyRent: 80000,
      securityDeposit: 160000,
      hasWater: true,
      hasWaterMeter: true,
      hasElectricity: true,
      hasElectricMeter: true,
      hasInternet: false,
      hasFurniture: true,
      hasAirConditioning: false,
      hasParking: false,
      hasGarden: false,
      hasSecurity: true,
      status: PropertyStatus.PUBLISHED,
      isVerified: true,
      ownerId: owner1.id,
    },
    {
      title: 'Maison spacieuse à Godomey',
      description: 'Grande maison de 4 chambres avec jardin à Godomey. Parfaite pour les familles nombreuses. Quartier résidentiel et sécurisé.',
      city: 'Cotonou',
      district: 'Godomey',
      address: 'Rue 5, Quartier Godomey, Cotonou',
      type: PropertyType.HOUSE,
      roomCount: 6,
      bedroomCount: 4,
      bathroomCount: 2,
      area: 150,
      floor: 0,
      monthlyRent: 300000,
      securityDeposit: 600000,
      hasWater: true,
      hasWaterMeter: true,
      hasElectricity: true,
      hasElectricMeter: true,
      hasInternet: true,
      hasFurniture: true,
      hasAirConditioning: true,
      hasParking: true,
      hasGarden: true,
      hasSecurity: true,
      status: PropertyStatus.PUBLISHED,
      isVerified: true,
      ownerId: owner2.id,
    },
    {
      title: 'Appartement 2 pièces à Dantokpa',
      description: 'Appartement de 2 pièces bien situé à Dantokpa. Proche du marché et des transports. Bon état général.',
      city: 'Cotonou',
      district: 'Dantokpa',
      address: 'Rue 8, Quartier Dantokpa, Cotonou',
      type: PropertyType.APARTMENT,
      roomCount: 2,
      bedroomCount: 1,
      bathroomCount: 1,
      area: 55,
      floor: 2,
      monthlyRent: 100000,
      securityDeposit: 200000,
      hasWater: true,
      hasWaterMeter: false,
      hasElectricity: true,
      hasElectricMeter: true,
      hasInternet: false,
      hasFurniture: false,
      hasAirConditioning: false,
      hasParking: false,
      hasGarden: false,
      hasSecurity: false,
      status: PropertyStatus.PENDING_REVIEW,
      isVerified: false,
      ownerId: owner2.id,
    },
    {
      title: 'Villa luxueuse à Abomey-Calavi',
      description: 'Superbe villa moderne à Abomey-Calavi. 5 chambres, piscine, grand jardin. Quartier très calme et sécurisé.',
      city: 'Abomey-Calavi',
      district: 'Abomey-Calavi',
      address: 'Rue Principale, Abomey-Calavi',
      type: PropertyType.VILLA,
      roomCount: 8,
      bedroomCount: 5,
      bathroomCount: 3,
      area: 250,
      floor: 0,
      monthlyRent: 500000,
      securityDeposit: 1000000,
      hasWater: true,
      hasWaterMeter: true,
      hasElectricity: true,
      hasElectricMeter: true,
      hasInternet: true,
      hasFurniture: true,
      hasAirConditioning: true,
      hasParking: true,
      hasGarden: true,
      hasSecurity: true,
      status: PropertyStatus.PUBLISHED,
      isVerified: true,
      ownerId: owner1.id,
    },
    {
      title: 'Chambre à louer à Ménontin',
      description: 'Chambre individuelle à louer à Ménontin. Dans une maison partagée. Accès à la cuisine et salle de bain communes.',
      city: 'Cotonou',
      district: 'Ménontin',
      address: 'Rue 12, Quartier Ménontin, Cotonou',
      type: PropertyType.ROOM,
      roomCount: 1,
      bedroomCount: 1,
      bathroomCount: 1,
      area: 20,
      floor: 0,
      monthlyRent: 40000,
      securityDeposit: 80000,
      hasWater: true,
      hasWaterMeter: false,
      hasElectricity: true,
      hasElectricMeter: false,
      hasInternet: false,
      hasFurniture: true,
      hasAirConditioning: false,
      hasParking: false,
      hasGarden: false,
      hasSecurity: false,
      status: PropertyStatus.PUBLISHED,
      isVerified: true,
      ownerId: owner2.id,
    },
  ];

  for (const propertyData of properties) {
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        verificationDate: propertyData.isVerified ? new Date() : null,
        verifiedById: propertyData.isVerified ? agent.id : null,
      },
    });

    // Create property images
    for (let i = 0; i < Math.min(propertyImages.length, 4); i++) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          url: propertyImages[i],
          isPrimary: i === 0,
          order: i,
        },
      });
    }

    // Create verification for verified properties
    if (propertyData.isVerified) {
      await prisma.verification.create({
        data: {
          propertyId: property.id,
          scheduledAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
          completedAt: new Date(Date.now() - 86400000), // 1 day ago
          agentId: agent.id,
          status: 'COMPLETED',
          notes: 'Logement en excellent état. Correspond parfaitement à la description.',
          photosTaken: 15,
        },
      });
    }
  }
  console.log('✓ Properties created');

  // Create favorites
  await prisma.favorite.createMany({
    data: [
      { tenantId: tenant1.id, propertyId: (await prisma.property.findFirst({ where: { title: 'Bel appartement 3 pièces à Akpakpa' } }))!.id },
      { tenantId: tenant1.id, propertyId: (await prisma.property.findFirst({ where: { title: 'Villa luxueuse à Abomey-Calavi' } }))!.id },
      { tenantId: tenant2.id, propertyId: (await prisma.property.findFirst({ where: { title: 'Studio meublé à Cocotomey' } }))!.id },
      { tenantId: tenant2.id, propertyId: (await prisma.property.findFirst({ where: { title: 'Maison spacieuse à Godomey' } }))!.id },
    ],
    skipDuplicates: true,
  });
  console.log('✓ Favorites created');

  // Create visits
  const property1 = await prisma.property.findFirst({ where: { title: 'Bel appartement 3 pièces à Akpakpa' } });
  const property2 = await prisma.property.findFirst({ where: { title: 'Studio meublé à Cocotomey' } });
  const property3 = await prisma.property.findFirst({ where: { title: 'Maison spacieuse à Godomey' } });

  if (property1 && property2 && property3) {
    await prisma.visit.createMany({
      data: [
        {
          propertyId: property1.id,
          tenantId: tenant1.id,
          ownerId: owner1.id,
          agentId: agent.id,
          scheduledAt: new Date(Date.now() + 86400000 * 2), // In 2 days
          duration: 60,
          status: VisitStatus.CONFIRMED,
          tenantNotes: 'Intéressé par ce logement, disponible pour visite mercredi ou jeudi.',
        },
        {
          propertyId: property2.id,
          tenantId: tenant2.id,
          ownerId: owner1.id,
          agentId: agent.id,
          scheduledAt: new Date(Date.now() - 86400000 * 1), // Yesterday
          duration: 45,
          completedAt: new Date(),
          status: VisitStatus.COMPLETED,
          tenantNotes: 'Logement très bien, mais un peu petit pour mes besoins.',
          agentNotes: 'Locataire très sérieux. A visité d\'autres logements.',
        },
        {
          propertyId: property3.id,
          tenantId: tenant1.id,
          ownerId: owner2.id,
          agentId: agent.id,
          scheduledAt: new Date(Date.now() + 86400000 * 5), // In 5 days
          duration: 90,
          status: VisitStatus.REQUESTED,
          tenantNotes: 'Souhaite visiter avec sa famille.',
        },
      ],
      skipDuplicates: true,
    });
    console.log('✓ Visits created');
  }

  // Create rentals
  const property4 = await prisma.property.findFirst({ where: { title: 'Appartement 2 pièces à Dantokpa' } });
  const property5 = await prisma.property.findFirst({ where: { title: 'Chambre à louer à Ménontin' } });

  if (property4 && property5) {
    await prisma.rental.createMany({
      data: [
        {
          propertyId: property4.id,
          tenantId: tenant1.id,
          ownerId: owner2.id,
          startDate: new Date(Date.now() - 86400000 * 30), // 1 month ago
          endDate: new Date(Date.now() + 86400000 * 30 * 11), // 1 year from now
          monthlyRent: property4.monthlyRent,
          securityDeposit: property4.securityDeposit || 0,
          status: 'ACTIVE',
          notes: 'Contrat signé pour 1 an. Paiement mensuel.',
        },
        {
          propertyId: property5.id,
          tenantId: tenant2.id,
          ownerId: owner2.id,
          startDate: new Date(Date.now() - 86400000 * 60), // 2 months ago
          endDate: new Date(Date.now() + 86400000 * 30 * 5), // 6 months from now
          monthlyRent: property5.monthlyRent,
          securityDeposit: property5.securityDeposit || 0,
          status: 'ACTIVE',
          notes: 'Location pour 6 mois. Paiement trimestriel.',
        },
      ],
      skipDuplicates: true,
    });
    console.log('✓ Rentals created');
  }

  // Create payments
  const rental1 = await prisma.rental.findFirst();
  const rental2 = await prisma.rental.findFirst({ where: { tenantId: tenant2.id } });

  if (rental1 && rental2) {
    await prisma.payment.createMany({
      data: [
        {
          rentalId: rental1.id,
          userId: tenant1.id,
          type: 'RENT',
          amount: rental1.monthlyRent,
          currency: 'XOF',
          method: 'MOBILE_MONEY',
          reference: 'PAY-2023-001',
          status: 'COMPLETED',
          dueDate: new Date(Date.now() - 86400000 * 30),
          paidAt: new Date(Date.now() - 86400000 * 30),
          notes: 'Paiement du loyer de novembre',
        },
        {
          rentalId: rental1.id,
          userId: tenant1.id,
          type: 'RENT',
          amount: rental1.monthlyRent,
          currency: 'XOF',
          method: 'MOBILE_MONEY',
          reference: 'PAY-2023-002',
          status: 'COMPLETED',
          dueDate: new Date(Date.now() - 86400000 * 60),
          paidAt: new Date(Date.now() - 86400000 * 60),
          notes: 'Paiement du loyer de décembre',
        },
        {
          rentalId: rental2.id,
          userId: tenant2.id,
          type: 'RENT',
          amount: rental2.monthlyRent,
          currency: 'XOF',
          method: 'CASH',
          reference: 'PAY-2023-003',
          status: 'PENDING',
          dueDate: new Date(Date.now() - 86400000 * 15),
          notes: 'Paiement en retard',
        },
      ],
      skipDuplicates: true,
    });
    console.log('✓ Payments created');
  }

  // Create deposits
  const rentalForDeposit = await prisma.rental.findFirst();
  if (rentalForDeposit) {
    await prisma.deposit.create({
      data: {
        rentalId: rentalForDeposit.id,
        amount: rentalForDeposit.securityDeposit,
        currency: 'XOF',
        status: 'HELD',
        inspectionDate: new Date(),
        inspectionNotes: 'Logement en bon état à l\'entrée. État des lieux signé.',
        hasDamages: false,
      },
    });
    console.log('✓ Deposits created');
  }

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: tenant1.id,
        title: 'Nouvelle visite confirmée',
        message: 'Votre visite pour l\'appartement à Akpakpa a été confirmée pour le 15 décembre.',
        type: 'SUCCESS',
        isRead: false,
        propertyId: (await prisma.property.findFirst({ where: { title: 'Bel appartement 3 pièces à Akpakpa' } }))!.id,
      },
      {
        userId: owner1.id,
        title: 'Nouvelle demande de visite',
        message: 'Un locataire souhaite visiter votre studio à Cocotomey.',
        type: 'INFO',
        isRead: false,
        propertyId: (await prisma.property.findFirst({ where: { title: 'Studio meublé à Cocotomey' } }))!.id,
      },
      {
        userId: agent.id,
        title: 'Nouvelle propriété à vérifier',
        message: 'Une nouvelle propriété a été soumise pour vérification: Appartement 2 pièces à Dantokpa.',
        type: 'INFO',
        isRead: false,
        propertyId: (await prisma.property.findFirst({ where: { title: 'Appartement 2 pièces à Dantokpa' } }))!.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✓ Notifications created');

  console.log('\n✅ Database seed completed successfully!');
  console.log(`\nCreated:`);
  console.log(`- ${1} application settings`);
  console.log(`- ${2} admin/agent users`);
  console.log(`- ${2} owner users`);
  console.log(`- ${2} tenant users`);
  console.log(`- ${6} properties`);
  console.log(`- ${4} favorites`);
  console.log(`- ${3} visits`);
  console.log(`- ${2} rentals`);
  console.log(`- ${3} payments`);
  console.log(`- ${1} deposit`);
  console.log(`- ${3} notifications`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
