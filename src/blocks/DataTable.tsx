import type { CSSProperties, ReactNode } from 'react'

export type Column<Row> = {
  key: string
  /** The column's header ("Person", "Role"). An empty one is still named for screen readers by `srHeader`. */
  header: ReactNode
  srHeader?: string | undefined
  cell: (row: Row) => ReactNode
  align?: 'start' | 'end' | undefined
  /**
   * On phones each row is a card with two columns. `order` places the cell (lower first), `align`
   * puts it on the right, `hidden` drops it, `full` takes the whole width.
   */
  phone?: { order?: number; align?: 'start' | 'end'; hidden?: boolean; full?: boolean } | undefined
}

export type DataTableProps<Row> = {
  /** The table's accessible name ("Users"); the tile's heading usually says it too. */
  label: string
  columns: Column<Row>[]
  rows: Row[]
  rowKey: (row: Row) => string
  /** Rows to highlight for a second after a change (by key). */
  flash?: ReadonlySet<string> | undefined
  loading?: boolean | undefined
  /** Shown when there are no rows and nothing is loading: say what to do ("Clear the search."). */
  empty?: ReactNode
}

/**
 * Daylight's real table (column headers, row actions, inline cells) in Bento's rounded rows. Rows
 * become cards on phones. Search, filters and pagination sit around it (FilterTabs, Pagination).
 */
export function DataTable<Row>({ label, columns, rows, rowKey, flash, loading = false, empty }: DataTableProps<Row>) {
  if (!loading && rows.length === 0) return <div className="ja-empty">{empty ?? 'Nothing here yet.'}</div>
  return (
    <div className="ja-table-wrap" aria-busy={loading || undefined}>
      <table className="ja-table" aria-label={label}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" data-align={column.align === 'end' ? 'end' : undefined}>
                {column.header || (column.srHeader && <span className="ja-sr">{column.srHeader}</span>)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? // Skeleton rows: the table keeps its shape while it loads, with no spinner flash.
              Array.from({ length: Math.max(3, Math.min(rows.length, 6)) }, (_, i) => (
                <tr key={`skeleton-${i}`} aria-hidden="true">
                  {columns.map((column) => (
                    <td key={column.key} data-phone={column.phone?.hidden ? 'hidden' : undefined}>
                      <span className="ja-skeleton" style={{ width: `${50 + ((i * 17 + column.key.length * 7) % 40)}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => {
                const key = rowKey(row)
                return (
                  <tr key={key} data-flash={flash?.has(key) ? 'true' : undefined}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        data-align={column.align === 'end' ? 'end' : undefined}
                        data-phone={column.phone?.hidden ? 'hidden' : column.phone?.full ? 'full' : undefined}
                        data-phone-align={column.phone?.align === 'end' ? 'end' : undefined}
                        style={column.phone?.order !== undefined ? ({ '--phone-order': column.phone.order } as CSSProperties) : undefined}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                )
              })}
        </tbody>
      </table>
      {loading && (
        <span className="ja-sr" role="status">
          Loading
        </span>
      )}
    </div>
  )
}

/** A person in a table: avatar, name and a second line (email). */
export function PersonCell({ name, detail, avatar }: { name: ReactNode; detail?: ReactNode; avatar: ReactNode }) {
  return (
    <div className="ja-who">
      {avatar}
      <span>
        <b>{name}</b>
        {detail && <small>{detail}</small>}
      </span>
    </div>
  )
}

/** A small action in a row ("Suspend", "Resend invite"). Its label should name the row in `aria-label` when the text alone doesn't. */
export function RowAction({ children, danger = false, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button type="button" className="ja-row-action" data-variant={danger ? 'danger' : undefined} {...rest}>
      {children}
    </button>
  )
}
