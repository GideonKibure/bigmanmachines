import EmptyState from './EmptyState'

export default function DataTable({ columns, rows, rowKey, empty }) {
  if (!rows?.length) {
    return <EmptyState title={empty || 'Hakuna kitu bado'} />
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-line bg-card md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-line">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-top text-paper">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={rowKey(row)} className="rounded-lg border border-line bg-card p-4">
            {columns.map((column) => (
              <div key={column.key} className="flex items-start justify-between gap-3 py-1.5 text-sm">
                <span className="text-muted">{column.header}</span>
                <span className="text-right text-paper">{column.cell(row)}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </>
  )
}
