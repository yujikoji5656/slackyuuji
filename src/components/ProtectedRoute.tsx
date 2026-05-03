import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'

type Props = {
  readonly children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { session, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login', { replace: true })
    }
  }, [loading, session, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <div className="w-[260px] p-4 hidden md:flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  if (!session) return null

  return <>{children}</>
}
