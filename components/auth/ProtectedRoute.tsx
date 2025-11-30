import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default async function ProtectedRoute({ children }: ProtectedRouteProps) {
  let userId: string | null = null
  
  try {
    const authResult = await auth()
    userId = authResult.userId
  } catch (error) {
    console.error('ProtectedRoute auth error:', error)
    redirect('/sign-in')
    return null
  }

  if (!userId) {
    redirect('/sign-in')
    return null
  }

  return <>{children}</>
}
