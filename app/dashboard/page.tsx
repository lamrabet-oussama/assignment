import { loadAgenciesCSV } from '@/lib/csv/agencies'
import { loadContactsCSV } from '@/lib/csv/contacts'
import Link from 'next/link'

export default function Dashboard() {
  const agencies = loadAgenciesCSV()
  const contacts = loadContactsCSV()

  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0h-4m-2 0h-4m-2 0H3m2-2v2m0-2V9a2 2 0 012-2h4a2 2 0 012 2v10m-6 0a2 2 0 002 2h4a2 2 0 002-2m-6 0h6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Agencies</dt>
                      <dd className="text-lg font-medium text-gray-900">{agencies.totalRows}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-blue-100 px-5 py-3">
                <div className="text-sm">
                  <Link href="/dashboard/agencies" className="font-medium text-blue-700 hover:text-blue-900">
                    View all agencies
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                      <dd className="text-lg font-medium text-gray-900">{contacts.totalRows}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-green-100 px-5 py-3">
                <div className="text-sm">
                  <Link href="/dashboard/contacts" className="font-medium text-green-700 hover:text-green-900">
                    View all contacts
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Daily Contact Views</dt>
                      <dd className="text-lg font-medium text-gray-900">Limited to 50/day</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-100 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-yellow-700">
                    Contact view limit resets daily
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}