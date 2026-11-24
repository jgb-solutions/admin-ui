import { icons } from '../icons'

/** Which page numbers to show: the first, the last, and the current one's neighbours; null is a gap. */
export function pageWindow(page: number, pages: number): (number | null)[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const near = [page - 1, page, page + 1].filter((p) => p > 1 && p < pages)
  const list: (number | null)[] = [1]
  if (near[0]! > 2) list.push(null)
  list.push(...near)
  if (near[near.length - 1]! < pages - 1) list.push(null)
  list.push(pages)
  return list
}

export type PaginationProps = {
  page: number
  pages: number
  onPage: (page: number) => void
  /** "1–4 of 2,481 people": shown on desktop. */
  summary?: string | undefined
  /** What is paged, for the navigation's name ("People pages"). */
  label?: string | undefined
}

/** Page numbers with a next button; the current page is marked for screen readers. */
export function Pagination({ page, pages, onPage, summary, label = 'Pages' }: PaginationProps) {
  if (pages <= 1 && !summary) return null
  return (
    <div className="ja-pager">
      <span>{summary}</span>
      {pages > 1 && (
        <nav aria-label={label}>
          <ul className="ja-pages">
            {page > 1 && (
              <li>
                <button type="button" aria-label="Previous page" onClick={() => onPage(page - 1)}>
                  <icons.chevronLeft />
                </button>
              </li>
            )}
            {pageWindow(page, pages).map((p, i) =>
              p === null ? (
                <li key={`gap-${i}`} aria-hidden="true" className="ja-muted" style={{ alignSelf: 'center' }}>
                  …
                </li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    aria-current={p === page ? 'page' : undefined}
                    aria-label={`Page ${p}`}
                    onClick={() => p !== page && onPage(p)}
                  >
                    {p}
                  </button>
                </li>
              ),
            )}
            {page < pages && (
              <li>
                <button type="button" aria-label="Next page" onClick={() => onPage(page + 1)}>
                  <icons.chevronRight />
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}
