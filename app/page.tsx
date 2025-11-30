import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  
  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Agency & Contact Management
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Streamline your business relationships with our comprehensive management platform
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Agencies</h2>
              <p className="text-gray-600 mb-6">
                Organize and track all your partner agencies in one centralized location
              </p>
              <Link 
                href="/dashboard/agencies" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Agencies
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Contacts</h2>
              <p className="text-gray-600 mb-6">
                Keep track of all your important business contacts with daily view limits
              </p>
              <Link 
                href="/dashboard/contacts" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Contacts (50/day limit)
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Get Started</h3>
            <p className="text-gray-600 mb-6">
              Sign in to access your dashboard and manage your agencies and contacts
            </p>
            <div className="space-x-4">
              <Link 
                href="/sign-in" 
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="inline-block border-2 border-gray-600 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
