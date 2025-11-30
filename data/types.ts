export interface Agency {
  id: string
  name: string
  state: string
  stateCode: string
  type: string
  population?: number
  website?: string
  totalSchools?: number
  totalStudents?: number
  mailingAddress?: string
  gradeSpan?: string
  locale?: string
  csaCbsa?: string
  domainName?: string
  physicalAddress?: string
  phone?: string
  status?: string
  studentTeacherRatio?: number
  supervisoryUnion?: string
  county?: string
  createdAt: Date
  updatedAt: Date
  // Legacy fields for backward compatibility
  contactPerson?: string
  email?: string
  address?: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  agencyId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AgencyCSVRow {
  id: string
  name: string
  state: string
  state_code: string
  type: string
  population?: string
  website?: string
  total_schools?: string
  total_students?: string
  mailing_address?: string
  grade_span?: string
  locale?: string
  csa_cbsa?: string
  domain_name?: string
  physical_address?: string
  phone?: string
  status?: string
  student_teacher_ratio?: string
  supervisory_union?: string
  county?: string
  created_at: string
  updated_at: string
}

export interface ContactCSVRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  position: string
  agency_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Dynamic CSV types for flexible table generation
export interface DynamicCSVRow {
  [key: string]: string | number | null | undefined
}

export interface TableColumn {
  key: string
  label: string
  hasData: boolean
}

export interface DynamicTableData {
  columns: TableColumn[]
  rows: DynamicCSVRow[]
  totalRows: number
}