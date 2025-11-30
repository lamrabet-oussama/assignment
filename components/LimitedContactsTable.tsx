'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useContactLimits } from '@/hooks/useContactLimits'
// import UpgradeModal from './UpgradeModal'

interface ContactRow {
  [key: string]: string | number | null | undefined
}

interface LimitedContactsTableProps {
  contacts: ContactRow[]
}

export default function LimitedContactsTable({ contacts }: LimitedContactsTableProps) {
  const router = useRouter()
  const { 
    count, 
    limit, 
    remaining, 
    hasExceeded, 
    isLoading, 
    incrementCount, 
    resetDailyCount 
  } = useContactLimits()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showResetButton, setShowResetButton] = useState(false)
  const itemsPerPage = 10
  
  // Limit contacts to first 50 for viewing in table
  const maxViewableContacts = 50

  // Limit contacts to first 50, then filter based on search
  const filteredContacts = useMemo(() => {
    const limitedContacts = contacts.slice(0, maxViewableContacts)
    return limitedContacts.filter(contact =>
      String(contact.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(contact.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(contact.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [contacts, searchTerm, maxViewableContacts])

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage)

  // Only check limit when viewing a contact
  const handleViewContact = async (contactId: string | number | null | undefined) => {
    // Limit check ONLY here
    if (hasExceeded) {
      router.push('/dashboard/upgrade')
      return
    }
    const success = await incrementCount()
    if (success) {
      router.push(`/dashboard/contacts/${String(contactId)}`)
    } else {
      router.push('/dashboard/upgrade')
    }
  }

  // Upgrade button now navigates to upgrade page



  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Usage Stats */}
      {/* Usage Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <p className="text-sm text-blue-700 mt-1">
              {`${count} of ${limit} contact details viewed today (${remaining} remaining)`}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {`Showing up to ${limit} contacts in table • Click "View Details" to see full contact info`}
            </p>

            {/* Progress Bar */}
            {limit > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    count >= limit ? "bg-red-600" : "bg-blue-600"
                  }`}
                  style={{ width: `${Math.min((count / limit) * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={() => setShowResetButton(!showResetButton)}
                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
              >
                Dev
              </button>
            )}
            <button
              onClick={() => router.push("/dashboard/upgrade")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Dev Reset Button */}
        {showResetButton && process.env.NODE_ENV === "development" && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <button
              onClick={async () => {
                const success = await resetDailyCount();
                if (success) {
                  setShowResetButton(false);
                }
              }}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded border border-red-300"
            >
              Reset Daily Count (Dev Only)
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border text-black placeholder-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
        />
        <p className="text-sm text-gray-600">
          Showing {displayedContacts.length} of {filteredContacts.length}{" "}
          contacts
        </p>
      </div>

      {/* Contacts Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Form
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedContacts.map((contact) => {
                // All contacts in the filtered list are viewable in the table (up to 50)
                // The limit applies to clicking "View Details"
                const canView = true;

                return (
                  <tr
                    key={contact.id}
                    className={`hover:bg-gray-50 ${
                      !canView ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {String(contact.first_name || "C")[0]}
                            {String(contact.last_name || "N")[0]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.first_name} {contact.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {contact.phone ? (
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {contact.title || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {contact.department || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 font-mono">
                      {contact.agency_id ? (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {String(contact.agency_id).substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {contact.email_type || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {contact.contact_form_url ? (
                        <a
                          href={String(contact.contact_form_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {String(contact.contact_form_url)}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {contact.created_at ? (
                        <span className="text-xs">
                          {new Date(
                            String(contact.created_at)
                          ).toLocaleDateString("fr-FR")}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewContact(contact.id)}
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {displayedContacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No contacts found matching your search."
              : "No contacts available."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm text-black border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm text-blue-600  border rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-black text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Modal removed, navigation only */}
    </div>
  );
}