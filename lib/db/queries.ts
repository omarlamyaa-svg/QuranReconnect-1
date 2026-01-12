import { prisma } from './prisma'
import { Status, ErrorCategory } from '@prisma/client'
import type { StudentStats, AdminStats } from '@/types'

// User queries
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

// Submission queries
export async function getSubmissionsByStudent(studentId: string) {
  return prisma.submission.findMany({
    where: { studentId },
    include: {
      assignment: true,
      feedbacks: {
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getSubmissionById(id: string) {
  return prisma.submission.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          level: true,
        },
      },
      assignment: true,
      feedbacks: {
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { timestamp: 'asc' },
      },
    },
  })
}

export async function getPendingSubmissions() {
  return prisma.submission.findMany({
    where: {
      status: {
        in: [Status.PENDING, Status.IN_REVIEW],
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          level: true,
        },
      },
      assignment: true,
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function updateSubmissionStatus(
  id: string,
  status: Status,
  grade?: number
) {
  return prisma.submission.update({
    where: { id },
    data: {
      status,
      ...(grade !== undefined && { grade }),
    },
  })
}

// Feedback queries
export async function createFeedback(data: {
  submissionId: string
  adminId: string
  timestamp: number
  comment: string
  category?: ErrorCategory
  audioUrl?: string
}) {
  return prisma.feedback.create({
    data,
  })
}

export async function getFeedbacksBySubmission(submissionId: string) {
  return prisma.feedback.findMany({
    where: { submissionId },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { timestamp: 'asc' },
  })
}

// Progress queries
export async function getProgressByStudent(studentId: string) {
  return prisma.progress.findMany({
    where: { studentId },
    orderBy: { surah: 'asc' },
  })
}

export async function updateProgress(
  studentId: string,
  surah: number,
  completed: boolean,
  grade?: number
) {
  return prisma.progress.upsert({
    where: {
      studentId_surah: {
        studentId,
        surah,
      },
    },
    update: {
      completed,
      ...(grade !== undefined && { grade }),
    },
    create: {
      studentId,
      surah,
      completed,
      ...(grade !== undefined && { grade }),
    },
  })
}

// Stats queries
export async function getStudentStats(studentId: string): Promise<StudentStats> {
  const [
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    retrySubmissions,
    averageGradeResult,
    completedSurahs,
    recentActivity,
  ] = await Promise.all([
    prisma.submission.count({ where: { studentId } }),
    prisma.submission.count({ where: { studentId, status: Status.PENDING } }),
    prisma.submission.count({ where: { studentId, status: Status.APPROVED } }),
    prisma.submission.count({ where: { studentId, status: Status.RETRY_REQUESTED } }),
    prisma.submission.aggregate({
      where: { studentId, grade: { not: null } },
      _avg: { grade: true },
    }),
    prisma.progress.count({ where: { studentId, completed: true } }),
    prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: true,
        student: true,
        feedbacks: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    retrySubmissions,
    averageGrade: averageGradeResult._avg.grade ?? 0,
    completedSurahs,
    totalSurahs: 114,
    recentActivity,
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalStudents,
    pendingReviews,
    totalSubmissions,
    averageGradeResult,
    recentSubmissions,
    categoryStatsRaw,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.submission.count({
      where: {
        status: {
          in: [Status.PENDING, Status.IN_REVIEW],
        },
      },
    }),
    prisma.submission.count(),
    prisma.submission.aggregate({
      where: { grade: { not: null } },
      _avg: { grade: true },
    }),
    prisma.submission.findMany({
      include: {
        student: true,
        assignment: true,
        feedbacks: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.feedback.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { category: { not: null } },
    }),
  ])

  const categoryStats = categoryStatsRaw
    .filter((item) => item.category !== null)
    .map((item) => ({
      category: item.category as ErrorCategory,
      count: item._count.category,
    }))

  return {
    totalStudents,
    pendingReviews,
    totalSubmissions,
    averageGrade: averageGradeResult._avg.grade ?? 0,
    recentSubmissions,
    categoryStats,
  }
}

// Assignment queries
export async function getAssignments() {
  return prisma.assignment.findMany({
    include: {
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAssignmentById(id: string) {
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      submissions: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              level: true,
            },
          },
        },
      },
    },
  })
}
