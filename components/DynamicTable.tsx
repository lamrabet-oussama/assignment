"use client";

import { useState, useMemo } from "react";
import { searchRows, sortRows } from "@/lib/clientUtils";

interface TableColumn {
  key: string;
  label: string;
  hasData: boolean;
}

interface TableRow {
  [key: string]: string | number | null | undefined;
}

interface DynamicTableProps {
  initialData: {
    columns: TableColumn[];
    rows: TableRow[];
    totalRows: number;
  };
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export default function DynamicTable({ initialData }: DynamicTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
const nonSortableColumns = ["id", "phone", "city"];

  // Filter out columns that are empty for all rows
  const filteredColumns = useMemo(() => {
    return initialData.columns.filter((col) =>
      initialData.rows.some((row) => {
        const val = row[col.key];
        return val !== null && val !== undefined && val !== "";
      })
    );
  }, [initialData.columns, initialData.rows]);

  // Apply search and sort
  const processedRows = useMemo(() => {
    let filtered = searchRows(initialData.rows, searchTerm, filteredColumns);

    if (sortConfig) {
      filtered = sortRows(filtered, sortConfig.key, sortConfig.direction);
    }

    return filtered;
  }, [initialData.rows, filteredColumns, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRows = processedRows.slice(
    startIndex,
    startIndex + itemsPerPage
  );

 const handleSort = (columnKey: string) => {
   if (nonSortableColumns.includes(columnKey.toLowerCase())) return;

   setSortConfig((prev) => ({
     key: columnKey,
     direction:
       prev?.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
   }));
 };


  const formatCellValue = (
    value: string | number | null | undefined
  ): string => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "number") return value.toLocaleString();
    return String(value);
  };

  const renderCell = (
    value: string | number | null | undefined,
    columnKey: string
  ) => {
    const formattedValue = formatCellValue(value);

    if (columnKey.toLowerCase().includes("website") && formattedValue) {
      const url = formattedValue.startsWith("http")
        ? formattedValue
        : `https://${formattedValue}`;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {formattedValue.replace(/^https?:\/\//, "")}
        </a>
      );
    }

    return (
      <span className={formattedValue ? "" : "text-gray-400"}>
        {formattedValue || "—"}
      </span>
    );
  };

  if (filteredColumns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          No data available or all columns are empty.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Info */}
      <div className="flex flex-col placeholder-black text-black sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search all columns..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
        />
        <div className="text-sm text-gray-600">
          Showing {paginatedRows.length} of {processedRows.length} rows (
          {filteredColumns.length} columns)
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {paginatedRows.map((row, index) => {
          const rowId = row.id || `row-${startIndex + index}`;
          return (
            <div
              key={rowId}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              {filteredColumns.map((col) => {
                const val = row[col.key];
                if (val === null || val === undefined || val === "")
                  return null;
                return (
                  <dl key={col.key} className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      {col.label}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {renderCell(val, col.key)}
                    </dd>
                  </dl>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
    <div className="hidden lg:block bg-white rounded-lg shadow">
  <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {filteredColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`
    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
    min-w-[200px] max-w-[300px] w-auto
    whitespace-nowrap
    ${
      nonSortableColumns.includes(col.key.toLowerCase())
        ? "cursor-default"
        : "cursor-pointer hover:bg-gray-100"
    }
  `}
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{col.label}</span>

                    {!nonSortableColumns.includes(col.key.toLowerCase()) && (
                      <span className="text-gray-400">
                        {sortConfig?.key === col.key
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRows.map((row, index) => {
              const rowId = row.id || `row-${startIndex + index}`;
              return (
                <tr key={rowId} className="hover:bg-gray-50">
                  {filteredColumns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {renderCell(row[col.key], col.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
</div>
        {paginatedRows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No rows found matching your search.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-black text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-black text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
