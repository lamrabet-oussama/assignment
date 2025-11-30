import { getAgencyById } from '@/data/agencies'
import { getContactsByAgencyId } from '@/data/contacts'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface AgencyPageProps {
  params: Promise<{ id: string }>
}

export default async function AgencyPage({ params }: AgencyPageProps) {
  const { id } = await params
  const agency = await getAgencyById(id)
  
  if (!agency) {
    notFound()
  }

  const contacts = await getContactsByAgencyId(id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/dashboard/agencies" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Agencies
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{agency.name}</h1>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Edit Agency
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            Delete Agency
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agency Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Agency Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="mt-1 text-sm text-gray-900">{agency.contactPerson}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`mailto:${agency.email}`} className="text-blue-600 hover:text-blue-800">
                    {agency.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={`tel:${agency.phone}`} className="text-blue-600 hover:text-blue-800">
                    {agency.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    agency.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {agency.status}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{agency.address}</dd>
              </div>
              {agency.website && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a 
                      href={agency.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {agency.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Agency Contacts */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Contacts ({contacts.length})</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Add Contact
              </button>
            </div>
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <Link href={`/contacts/${contact.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-blue-600">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{contact.title || contact.position || 'No position'}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </Link>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-gray-500 text-sm">No contacts associated with this agency.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}