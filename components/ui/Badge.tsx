import React from 'react'
import type { Status } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  status?: Status
  className?: string
}

export function Badge({ children, variant, status, className = '' }: BadgeProps) {
  // Als status is opgegeven, bepaal variant op basis van status
  let finalVariant = variant

  if (status) {
    const statusVariantMap: Record<Status, BadgeProps['variant']> = {
      PENDING: 'warning',
      IN_REVIEW: 'info',
      APPROVED: 'success',
      RETRY_REQUESTED: 'error',
    }
    finalVariant = statusVariantMap[status]
  }

  const variantStyles = {
    success: 'bg-success-100 text-success-700 border-success-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    error: 'bg-error-100 text-error-700 border-error-200',
    info: 'bg-primary-100 text-primary-700 border-primary-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variantStyles[finalVariant || 'default']
      } ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  const statusLabels: Record<Status, string> = {
    PENDING: 'In afwachting',
    IN_REVIEW: 'In beoordeling',
    APPROVED: 'Goedgekeurd',
    RETRY_REQUESTED: 'Herhaling nodig',
  }

  return <Badge status={status}>{statusLabels[status]}</Badge>
}
