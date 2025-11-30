import { loadContactsCSV } from '@/lib/csv/contacts'
import { loadAgenciesCSV } from '@/lib/csv/agencies'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ContactPageProps {
  params: Promise<{ id: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { id } = await params
  
  // Load contact data from CSV
  const contactsData = await loadContactsCSV()
  const contact = contactsData.rows.find(row => row.id === id)
  
  if (!contact) {
    notFound()
  }

  // Load agency data if contact has agencyId
  let agency = null
  if (contact.agency_id) {
    const agenciesData = await loadAgenciesCSV()
    agency = agenciesData.rows.find(row => row.id === contact.agency_id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/dashboard/contacts"
            className="text-green-600 hover:text-green-800 text-sm"
          >
            ← Back to Contacts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {contact.first_name} {contact.last_name}
          </h1>
        </div>
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-gray-700">
                  {contact.first_name?.[0] || "C"}
                  {contact.last_name?.[0] || "N"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {contact.first_name} {contact.last_name}
                </h2>
                <p className="text-lg text-gray-600">
                  {contact.title || "No position"}
                </p>
                <p className="text-gray-500">
                  {contact.department || "No department"}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-green-600 hover:text-green-800"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-green-600 hover:text-green-800"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Department
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {contact.department || "No department"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {contact.title || "No position"}
                </dd>
              </div>
              {agency && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Associated Agency
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className="text-blue-600">{agency.name}</span>
                  </dd>
                </div>
              )}
              {contact.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {contact.notes}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Contact Actions */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl text-black font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Email
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Phone
              </a>
            </div>
          </div>

          {/* Contact History */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl text-black font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-sm text-gray-500">
                <p>
                  Contact created on{" "}
                  {contact.created_at
                    ? new Date(String(contact.created_at)).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  Last updated on{" "}
                  {contact.updated_at
                    ? new Date(String(contact.updated_at)).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Contact Data */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Toutes les données du contact
        </h2>

        <div className="divide-y divide-gray-100">
          {Object.entries(contact).map(([key, value], index) => (
            <div
              key={key}
              className={`flex flex-col sm:flex-row sm:items-start py-4 ${
                index % 2 === 0 ? "bg-gray-50/30" : ""
              }`}
            >
              {/* Label */}
              <div className="sm:w-48 text-gray-600 font-medium capitalize mb-1 sm:mb-0">
                {key.replace(/_/g, " ")}
              </div>

              {/* Value */}
              <div className="flex-1 text-gray-900 break-words">
                {value !== null && value !== undefined && value !== "" ? (
                  typeof value === "string" && value.startsWith("http") ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {value}
                    </a>
                  ) : (
                    String(value)
                  )
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}