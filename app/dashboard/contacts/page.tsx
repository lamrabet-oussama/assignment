import { loadContactsCSV } from '@/lib/csv/contacts'
import LimitedContactsTable from '@/components/LimitedContactsTable'

export default async function ContactsPage() {
  const data = await loadContactsCSV()
  
  // Transform CSV data to match LimitedContactsTable interface
  const contacts = data.rows.map(row => ({
    id: String(row.id || ''),
    firstName: String(row.first_name || ''),
    lastName: String(row.last_name || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    title: String(row.title || ''),
    department: String(row.department || ''),
    agencyId: String(row.agency_id || ''),
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
    company: String(row.company || ''),
    position: String(row.position || ''),
    notes: String(row.notes || '')
  }))
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Browse contacts </p>
        </div>
      </div>

      <LimitedContactsTable contacts={contacts} />
    </div>
  )
}