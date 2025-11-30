'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { Bars3Icon } from '@heroicons/react/24/outline'
import LogoutButton from '../auth/LogoutButton'

interface NavBarProps {
  onMenuClick: () => void
}

export default function NavBar({ onMenuClick }: NavBarProps) {
  const { user, isLoaded } = useUser()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={onMenuClick}
            title="Open sidebar menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Logout Button */}
          <LogoutButton 
            variant="minimal" 
            showText={false}
            className="hidden sm:inline-flex"
          />
          
          {/* User profile */}
          <div className="flex items-center space-x-3">
            {isLoaded && user && (
              <div className="hidden md:block text-sm">
                <div className="font-medium text-gray-700">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-gray-500">
                  {user.primaryEmailAddress?.emailAddress}
                </div>
              </div>
            )}
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}