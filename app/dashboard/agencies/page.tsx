import { loadAgenciesCSV } from '@/lib/csv/agencies'
import DynamicTable from '@/components/DynamicTable'

export default async function AgenciesPage() {
  const data = await loadAgenciesCSV()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agencies</h1>
          <p className="text-gray-600 mt-1">Browse all available agencies with dynamic column display</p>
        </div>
      </div>

      <DynamicTable initialData={data} />
    </div>
  )
}