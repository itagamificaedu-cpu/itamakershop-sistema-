"use client"

import { ReactNode } from "react"

interface Column {
  key: string
  label: string
  formatter?: (value: unknown) => ReactNode
}

interface AdminTableProps {
  data: Record<string, unknown>[]
  columns: Column[]
}

export default function AdminTable({ data, columns }: AdminTableProps) {
  if (!data.length) {
    return <div className="text-center py-4">No data available</div>
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b last:border-0 hover:bg-muted/50"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm">
                  {column.formatter
                    ? column.formatter(row[column.key])
                    : (row[column.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 