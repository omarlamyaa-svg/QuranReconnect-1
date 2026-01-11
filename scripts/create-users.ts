import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating demo users...')

  // Hash password
  const hashedPassword = await hash('password', 10)

  // Create student
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Demo Student',
      password: hashedPassword,
      role: 'STUDENT',
      level: 'BEGINNER',
    },
  })

  console.log('Created student:', student.email)

  // Create admin/docent
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Demo Docent',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Created admin:', admin.email)

  // Create sample assignment
  const assignment = await prisma.assignment.create({
    data: {
      type: 'HIFZ',
      surah: 1,
      startVerse: 1,
      endVerse: 7,
      description: 'Reciteer Surah Al-Fatihah uit het hoofd',
    },
  })

  console.log('Created sample assignment:', assignment.id)

  console.log('\nDemo accounts created successfully!')
  console.log('Student: student@example.com / password')
  console.log('Admin: admin@example.com / password')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
