import { Role, Level, TestType, Status, ErrorCategory } from '@prisma/client'

export type { Role, Level, TestType, Status, ErrorCategory }

// User types
export interface User {
  id: string
  email: string
  name: string
  role: Role
  level?: Level | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithStats extends User {
  totalSubmissions: number
  averageGrade: number
  completedSurahs: number
}

// Assignment types
export interface Assignment {
  id: string
  type: TestType
  surah?: number | null
  startVerse?: number | null
  endVerse?: number | null
  description?: string | null
  dueDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface AssignmentWithSubmissions extends Assignment {
  submissions: Submission[]
  _count: {
    submissions: number
  }
}

// Submission types
export interface Submission {
  id: string
  studentId: string
  assignmentId: string
  audioUrl: string
  duration: number
  status: Status
  grade?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface SubmissionWithRelations extends Submission {
  student: User
  assignment: Assignment
  feedbacks: Feedback[]
}

// Feedback types
export interface Feedback {
  id: string
  submissionId: string
  adminId: string
  timestamp: number
  comment: string
  category?: ErrorCategory | null
  audioUrl?: string | null
  createdAt: Date
}

export interface FeedbackWithAdmin extends Feedback {
  admin: User
}

// Progress types
export interface Progress {
  id: string
  studentId: string
  surah: number
  completed: boolean
  grade?: number | null
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Audio recording types
export interface AudioRecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
}

// Dashboard stats types
export interface StudentStats {
  totalSubmissions: number
  pendingSubmissions: number
  approvedSubmissions: number
  retrySubmissions: number
  averageGrade: number
  completedSurahs: number
  totalSurahs: number
  recentActivity: SubmissionWithRelations[]
}

export interface AdminStats {
  totalStudents: number
  pendingReviews: number
  totalSubmissions: number
  averageGrade: number
  recentSubmissions: SubmissionWithRelations[]
  categoryStats: {
    category: ErrorCategory
    count: number
  }[]
}

// Surah metadata
export interface SurahMetadata {
  number: number
  name: string
  arabicName: string
  verses: number
  revelationType: 'Meccan' | 'Medinan'
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SubmissionFormData {
  assignmentId: string
  audioBlob: Blob
  duration: number
}

export interface FeedbackFormData {
  submissionId: string
  timestamp: number
  comment: string
  category?: ErrorCategory
  audioBlob?: Blob
}

// Upload types
export interface UploadUrlResponse {
  uploadUrl: string
  fileUrl: string
  key: string
}
