'use client'

import { SignOutButton } from '@clerk/nextjs'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
  showText?: boolean
  variant?: 'default' | 'minimal' | 'sidebar'
}

export default function LogoutButton({ 
  className = '', 
  showIcon = true, 
  showText = true,
  variant = 'default'
}: LogoutButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantStyles = {
    default: "px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-md focus:ring-gray-500",
    minimal: "px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:ring-gray-500",
    sidebar: "w-full px-2.5 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:ring-gray-500 justify-start"
  }

  return (
    <SignOutButton 
      redirectUrl="/sign-in"
    >
      <button 
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        type="button"
      >
        {showIcon && (
          <ArrowRightOnRectangleIcon 
            className={`h-4 w-4 ${showText ? 'mr-2' : ''}`}
            strokeWidth={1.5}
          />
        )}
        {showText && 'Sign out'}
      </button>
    </SignOutButton>
  )
}