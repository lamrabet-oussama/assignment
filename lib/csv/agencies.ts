import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { join } from 'path'

export interface AgencyRow {
  [key: string]: string | number | null | undefined
}

export interface AgencyColumn {
  key: string
  label: string
  hasData: boolean
}

export interface AgenciesTableData {
  columns: AgencyColumn[]
  rows: AgencyRow[]
  totalRows: number
}

function cleanAgencyValue(value: string): string | number | null {
  if (!value || value.trim() === '') {
    return null
  }
  
  const trimmed = value.trim()
  
  // Don't try to parse dates as numbers
  if (trimmed.includes('-') || trimmed.includes(':') || trimmed.includes(' ')) {
    return trimmed
  }
  
  // Try to parse as number only for pure numeric values
  const num = parseFloat(trimmed.replace(/,/g, ''))
  if (!isNaN(num) && isFinite(num)) {
    return num
  }
  
  return trimmed
}

function formatAgencyColumnHeader(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function loadAgenciesCSV(): AgenciesTableData {
  try {
    // Try both root directory and data directory
    let csvPath = join(process.cwd(), 'agencies.csv')
    let fileContent: string
    
    try {
      fileContent = readFileSync(csvPath, 'utf-8')
    } catch {
      // If not found in root, try data directory
      csvPath = join(process.cwd(), 'data', 'agencies.csv')
      fileContent = readFileSync(csvPath, 'utf-8')
    }
    
    if (!fileContent.trim()) {
      return { columns: [], rows: [], totalRows: 0 }
    }

    const records: Record<string, string>[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: false,
      trim: true,
      cast: false
    })

    if (records.length === 0) {
      return { columns: [], rows: [], totalRows: 0 }
    }

    // Get all possible column keys from all records
    const allKeys = new Set<string>()
    records.forEach(record => {
      Object.keys(record).forEach(key => allKeys.add(key))
    })

    const columnKeys = Array.from(allKeys)

    const BLACKLISTED_COLUMNS = [
      'total_schools',
      'total_students',
      'mailing_address',
      'grade_span',
      'locale',
      'csa_cbsa',
      'domain_name',
      'physical_address',
      'phone',
      'status',
      'student_teacher_ratio',
      'supervisory_union',
    ];

    // Process all rows and clean data
    const processedRows: AgencyRow[] = records.map(record => {
      const row: AgencyRow = {}
      columnKeys.forEach(key => {
        row[key] = cleanAgencyValue(record[key] || '')
      })
      return row
    })

    // Determine which columns have data and are not blacklisted
    const columns: AgencyColumn[] = columnKeys
      .filter(key => !BLACKLISTED_COLUMNS.includes(key)) // Apply blacklist filter
      .map(key => {
      const hasData = processedRows.some(row => {
        const value = row[key]
        return value !== null && value !== undefined && value !== ''
      })
      
      return {
        key,
        label: formatAgencyColumnHeader(key),
        hasData
      }
    }).filter(column => column.hasData) // Only include columns with data

    return {
      columns,
      rows: processedRows,
      totalRows: processedRows.length
    }

  } catch (error) {
    console.error('Error loading agencies CSV file:', error)
    return { columns: [], rows: [], totalRows: 0 }
  }
}