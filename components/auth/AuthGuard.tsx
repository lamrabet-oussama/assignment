'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Authenticating...</p>
      </div>
    </div>
  )
}

export default function AuthGuard({ children, fallback = <LoadingSpinner /> }: AuthGuardProps) {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (isLoaded && !userId && !isRedirecting) {
      setIsRedirecting(true)
      
      // Add a small delay to prevent race conditions
      timeoutId = setTimeout(() => {
        try {
          router.push('/sign-in')
        } catch (error) {
          console.error('Navigation error:', error)
          // Fallback: force page reload to sign-in
          window.location.href = '/sign-in'
        }
      }, 100)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoaded, userId, router, isRedirecting])

  // Show loading state while auth is initializing or redirecting
  if (!isLoaded || isRedirecting) {
    return fallback
  }

  // If user is not authenticated, show loading (redirect in progress)
  if (!userId) {
    return fallback
  }

  // User is authenticated, render children
  return <>{children}</>
}
