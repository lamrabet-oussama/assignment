import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface ContactRow {
  [key: string]: string | number | null | undefined;
}

export interface ContactColumn {
  key: string;
  label: string;
  hasData: boolean;
}

export interface ContactsTableData {
  columns: ContactColumn[];
  rows: ContactRow[];
  totalRows: number;
}

function cleanContactValue(value: string): string | number | null {
  if (!value || value.trim() === '') {
    return null;
  }
  
  const trimmed = value.trim();
  
  // Don't try to parse dates as numbers
  if (trimmed.includes('-') || trimmed.includes(':') || trimmed.includes(' ')) {
    return trimmed;
  }
  
  // Try to parse as number only for pure numeric values
  const num = parseFloat(trimmed.replace(/,/g, ''));
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }
  
  return trimmed;
}

function formatContactColumnHeader(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function loadContactsCSV(): ContactsTableData {
  try {
    // Try both root directory and data directory
    let csvPath = join(process.cwd(), 'contacts.csv');
    let fileContent: string;
    
    try {
      fileContent = readFileSync(csvPath, 'utf-8');
    } catch {
      // If not found in root, try data directory
      csvPath = join(process.cwd(), 'data', 'contacts.csv');
      fileContent = readFileSync(csvPath, 'utf-8');
    }
    
    if (!fileContent.trim()) {
      return { columns: [], rows: [], totalRows: 0 };
    }

    const records: Record<string, string>[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: false,
      trim: true,
      cast: false
    });

    if (records.length === 0) {
      return { columns: [], rows: [], totalRows: 0 };
    }

    // Get all possible column keys from all records
    const allKeys = new Set<string>();
    records.forEach(record => {
      Object.keys(record).forEach(key => allKeys.add(key));
    });

    const columnKeys = Array.from(allKeys);

    // Process all rows and clean data
    const processedRows: ContactRow[] = records.map(record => {
      const row: ContactRow = {};
      columnKeys.forEach(key => {
        row[key] = cleanContactValue(record[key] || '');
      });
      return row;
    });

    // Determine which columns have data
    const columns: ContactColumn[] = columnKeys.map(key => {
      const hasData = processedRows.some(row => {
        const value = row[key];
        return value !== null && value !== undefined && value !== '';
      });
      
      return {
        key,
        label: formatContactColumnHeader(key),
        hasData
      };
    }).filter(column => column.hasData); // Only include columns with data

    return {
      columns,
      rows: processedRows,
      totalRows: processedRows.length
    };

  } catch (error) {
    console.error('Error loading contacts CSV file:', error);
    return { columns: [], rows: [], totalRows: 0 };
  }
}