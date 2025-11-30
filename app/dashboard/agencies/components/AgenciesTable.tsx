'use client'

import { useState } from 'react'
import { Agency } from '@/data/types'

interface AgenciesTableProps {
  agencies: Agency[]
}

interface SortConfig {
  key: keyof Agency
  direction: 'asc' | 'desc'
}

export default function AgenciesTable({ agencies }: AgenciesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' })
  const itemsPerPage = 10

  // Determine which columns have data
  const hasData = {
    totalSchools: agencies.some(a => a.totalSchools && a.totalSchools > 0),
    totalStudents: agencies.some(a => a.totalStudents && a.totalStudents > 0),
    gradeSpan: agencies.some(a => a.gradeSpan),
    locale: agencies.some(a => a.locale),
    domainName: agencies.some(a => a.domainName),
    mailingAddress: agencies.some(a => a.mailingAddress),
    physicalAddress: agencies.some(a => a.physicalAddress),
    status: agencies.some(a => a.status),
    studentTeacherRatio: agencies.some(a => a.studentTeacherRatio && a.studentTeacherRatio > 0),
    supervisoryUnion: agencies.some(a => a.supervisoryUnion),
    csaCbsa: agencies.some(a => a.csaCbsa)
  }

  // Filter agencies based on search term
  const filteredAgencies = agencies.filter(agency =>
    agency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.stateCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.county?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.locale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.supervisoryUnion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.gradeSpan?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort agencies
  const sortedAgencies = [...filteredAgencies].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue == null) return 1
    if (bValue == null) return -1
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const result = aValue.localeCompare(bValue)
      return sortConfig.direction === 'asc' ? result : -result
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const result = aValue - bValue
      return sortConfig.direction === 'asc' ? result : -result
    }
    
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedAgencies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAgencies = sortedAgencies.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: keyof Agency) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const formatWebsite = (website: string) => {
    if (!website) return ''
    const url = website.startsWith('http') ? website : `https://${website}`
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline truncate max-w-32 block"
      >
        {website.replace(/^https?:\/\//, '')}
      </a>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search agencies by name, state, type, county, locale..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2 border placeholder-black text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
        />
        <div className="text-sm text-gray-600">
          Showing {paginatedAgencies.length} of {filteredAgencies.length} agencies
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {paginatedAgencies.map((agency) => (
          <div key={agency.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900 break-all">{agency.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {agency.stateCode || agency.state}
                </span>
                <span className="text-sm text-gray-500">{agency.type}</span>
                {agency.status && (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    agency.status.toLowerCase() === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agency.status}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                {agency.population && <div><strong>Population:</strong> {agency.population.toLocaleString()}</div>}
                {agency.county && <div><strong>County:</strong> {agency.county}</div>}
                {agency.locale && <div><strong>Locale:</strong> {agency.locale}</div>}
              </div>
              <div>
                {agency.totalSchools && <div><strong>Schools:</strong> {agency.totalSchools.toLocaleString()}</div>}
                {agency.totalStudents && <div><strong>Students:</strong> {agency.totalStudents.toLocaleString()}</div>}
                {agency.gradeSpan && <div><strong>Grades:</strong> {agency.gradeSpan}</div>}
              </div>
            </div>

            {(agency.phone || agency.website) && (
              <div className="border-t pt-2 space-y-1">
                {agency.phone && <div className="text-sm">📞 {agency.phone}</div>}
                {agency.website && (
                  <div className="text-sm break-all">
                    {formatWebsite(agency.website)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <span className="text-gray-400">
                    {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th 
                onClick={() => handleSort('population')}
                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>Population</span>
                  <span className="text-gray-400">
                    {sortConfig.key === 'population' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                County
              </th>
              {hasData.totalSchools && (
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Total Schools
                </th>
              )}
              {hasData.totalStudents && (
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Total Students
                </th>
              )}
              {hasData.gradeSpan && (
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Grade Span
                </th>
              )}
              {hasData.locale && (
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Locale
                </th>
              )}
              {hasData.status && (
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
              )}
              {hasData.studentTeacherRatio && (
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Student/Teacher Ratio
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAgencies.map((agency) => (
              <tr key={agency.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {agency.stateCode || agency.state}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.type}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.population ? agency.population.toLocaleString() : 'N/A'}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                  {formatWebsite(agency.website || '')}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.phone || 'N/A'}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.county || 'N/A'}
                </td>
                {hasData.totalSchools && (
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {agency.totalSchools ? agency.totalSchools.toLocaleString() : 'N/A'}
                  </td>
                )}
                {hasData.totalStudents && (
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {agency.totalStudents ? agency.totalStudents.toLocaleString() : 'N/A'}
                  </td>
                )}
                {hasData.gradeSpan && (
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    {agency.gradeSpan || 'N/A'}
                  </td>
                )}
                {hasData.locale && (
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    {agency.locale || 'N/A'}
                  </td>
                )}
                {hasData.status && (
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {agency.status && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agency.status.toLowerCase() === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agency.status}
                      </span>
                    )}
                  </td>
                )}
                {hasData.studentTeacherRatio && (
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    {agency.studentTeacherRatio ? `${agency.studentTeacherRatio}:1` : 'N/A'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedAgencies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No agencies found matching your search.
          </div>
        )}
      </div>

      {/* Empty State for Mobile */}
      {paginatedAgencies.length === 0 && (
        <div className="block sm:hidden text-center py-8 text-gray-500 bg-white rounded-lg shadow">
          No agencies found matching your search.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-black text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i
                if (pageNum > totalPages) return null
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-black text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}