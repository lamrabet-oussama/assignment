interface TableColumn {
  key: string;
  label: string;
  hasData: boolean;
}

interface TableRow {
  [key: string]: string | number | null | undefined;
}

export function searchRows(rows: TableRow[], searchTerm: string, columns: TableColumn[]): TableRow[] {
  if (!searchTerm.trim()) return rows
  
  const lowercaseSearch = searchTerm.toLowerCase()
  
  return rows.filter(row => {
    return columns.some(column => {
      const value = row[column.key]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(lowercaseSearch)
    })
  })
}

export function sortRows(
  rows: TableRow[], 
  sortKey: string, 
  direction: 'asc' | 'desc'
): TableRow[] {
  return [...rows].sort((a, b) => {
    const aValue = a[sortKey]
    const bValue = b[sortKey]
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1
    
    let comparison = 0
    
    // Compare numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue
    } else {
      // Compare as strings
      comparison = String(aValue).localeCompare(String(bValue))
    }
    
    return direction === 'asc' ? comparison : -comparison
  })
}