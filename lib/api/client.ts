import type {
  ApiResponse,
  Submission,
  SubmissionWithRelations,
  Feedback,
  Progress,
  Assignment,
  StudentStats,
  AdminStats,
} from '@/types'

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Er is een fout opgetreden',
      }
    }

    return {
      success: true,
      data: data.data || data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Submission API
export async function createSubmission(data: {
  assignmentId: string
  audioUrl: string
  duration: number
}): Promise<ApiResponse<Submission>> {
  return fetchApi<Submission>('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getSubmissions(): Promise<
  ApiResponse<SubmissionWithRelations[]>
> {
  return fetchApi<SubmissionWithRelations[]>('/api/submissions')
}

export async function getSubmissionById(
  id: string
): Promise<ApiResponse<SubmissionWithRelations>> {
  return fetchApi<SubmissionWithRelations>(`/api/submissions/${id}`)
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
  grade?: number
): Promise<ApiResponse<Submission>> {
  return fetchApi<Submission>(`/api/submissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, grade }),
  })
}

// Feedback API
export async function createFeedback(data: {
  submissionId: string
  timestamp: number
  comment: string
  category?: string
  audioUrl?: string
}): Promise<ApiResponse<Feedback>> {
  return fetchApi<Feedback>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getFeedbackBySubmission(
  submissionId: string
): Promise<ApiResponse<Feedback[]>> {
  return fetchApi<Feedback[]>(`/api/feedback/${submissionId}`)
}

// Progress API
export async function getProgress(): Promise<ApiResponse<Progress[]>> {
  return fetchApi<Progress[]>('/api/progress')
}

export async function getProgressReport(): Promise<
  ApiResponse<{
    progress: Progress[]
    errorStats: { category: string; count: number }[]
  }>
> {
  return fetchApi('/api/progress/report')
}

// Stats API
export async function getStudentStats(): Promise<ApiResponse<StudentStats>> {
  return fetchApi<StudentStats>('/api/stats/student')
}

export async function getAdminStats(): Promise<ApiResponse<AdminStats>> {
  return fetchApi<AdminStats>('/api/stats/admin')
}

// Assignment API
export async function getAssignments(): Promise<ApiResponse<Assignment[]>> {
  return fetchApi<Assignment[]>('/api/assignments')
}

export async function getAssignmentById(
  id: string
): Promise<ApiResponse<Assignment>> {
  return fetchApi<Assignment>(`/api/assignments/${id}`)
}
