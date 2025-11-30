import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Agency, Contact, AgencyCSVRow, ContactCSVRow } from './types'

function cleanPhoneNumber(phone: string): string {
  if (!phone) return ''
  // Remove all non-numeric characters except + at the start
  return phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')
}

function normalizeWebsite(website: string): string | undefined {
  if (!website || website.trim() === '') return undefined
  
  const cleaned = website.trim().toLowerCase()
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }
  return `https://${cleaned}`
}

function parseDate(dateString: string): Date {
  if (!dateString) return new Date()
  
  // Handle various date formats
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date() : date
}

function normalizeString(str: string): string {
  if (!str) return ''
  return str.trim()
}

function parsePopulation(population: string): number | undefined {
  if (!population || population.trim() === '') return undefined
  
  const num = parseInt(population.replace(/[^\d]/g, ''), 10)
  return isNaN(num) ? undefined : num
}

export async function loadAgencies(): Promise<Agency[]> {
  try {
    const csvPath = join(process.cwd(), 'data', 'agencies.csv')
    const fileContent = readFileSync(csvPath, 'utf-8')
    
    const records: AgencyCSVRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: false,
      trim: true,
      cast: false
    })

    return records
      .filter(record => record.id && record.name) // Filter out rows with missing critical data
      .map(record => ({
        id: normalizeString(record.id),
        name: normalizeString(record.name),
        state: normalizeString(record.state),
        stateCode: normalizeString(record.state_code),
        type: normalizeString(record.type),
        population: parsePopulation(record.population || ''),
        website: normalizeWebsite(record.website || ''),
        totalSchools: parsePopulation(record.total_schools || ''),
        totalStudents: parsePopulation(record.total_students || ''),
        mailingAddress: normalizeString(record.mailing_address || ''),
        gradeSpan: normalizeString(record.grade_span || ''),
        locale: normalizeString(record.locale || ''),
        csaCbsa: normalizeString(record.csa_cbsa || ''),
        domainName: normalizeString(record.domain_name || ''),
        physicalAddress: normalizeString(record.physical_address || ''),
        phone: cleanPhoneNumber(record.phone || ''),
        status: normalizeString(record.status || ''),
        studentTeacherRatio: parsePopulation(record.student_teacher_ratio || ''),
        supervisoryUnion: normalizeString(record.supervisory_union || ''),
        county: normalizeString(record.county || ''),
        createdAt: parseDate(record.created_at),
        updatedAt: parseDate(record.updated_at),
        // Legacy fields for backward compatibility
        contactPerson: '',
        email: '',
        address: normalizeString(record.mailing_address || record.physical_address || '')
      }))
  } catch (error) {
    console.error('Error loading agencies CSV:', error)
    return []
  }
}

export async function loadContacts(): Promise<Contact[]> {
  try {
    const csvPath = join(process.cwd(), 'data', 'contacts.csv')
    const fileContent = readFileSync(csvPath, 'utf-8')
    
    const records: ContactCSVRow[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: false,
      trim: true,
      cast: false
    })

    return records
      .filter(record => record.id && record.first_name && record.last_name) // Filter out rows with missing critical data
      .map(record => ({
        id: normalizeString(record.id),
        firstName: normalizeString(record.first_name),
        lastName: normalizeString(record.last_name),
        email: normalizeString(record.email).toLowerCase(),
        phone: cleanPhoneNumber(record.phone),
        company: normalizeString(record.company),
        position: normalizeString(record.position),
        agencyId: record.agency_id ? normalizeString(record.agency_id) : undefined,
        notes: record.notes ? normalizeString(record.notes) : undefined,
        createdAt: parseDate(record.created_at),
        updatedAt: parseDate(record.updated_at)
      }))
  } catch (error) {
    console.error('Error loading contacts CSV:', error)
    return []
  }
}