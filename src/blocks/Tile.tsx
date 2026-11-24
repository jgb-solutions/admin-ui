import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/** The bento grid: 12 columns on desktop, 2 on phones; tiles take spans. */
export function Bento({ children, className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={className ? `ja-bento ${className}` : 'ja-bento'} {...rest}>
      {children}
    </section>
  )
}

export type TileProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Columns out of 12 on desktop. */
  span?: number
  /** Rows (the hero takes 2). */
  rowSpan?: number
  /** Columns out of 2 on phones (default 2: full width). */
  phoneSpan?: 1 | 2
  /** plain (white), night (the dark hero), or sun (one highlight tile per page). */
  tone?: 'plain' | 'night' | 'sun'
  /** The tile's heading (an h2). With `actions`, they share the tile's top row. */
  title?: ReactNode
  actions?: ReactNode
  /** The element: "section" when it has a title, else "div". */
  as?: 'section' | 'div' | 'article'
}

/** A rounded tile in the bento grid. */
export function Tile({
  span = 12,
  rowSpan = 1,
  phoneSpan = 2,
  tone = 'plain',
  title,
  actions,
  as,
  style,
  children,
  className,
  ...rest
}: TileProps) {
  const Element = as ?? (title ? 'section' : 'div')
  const vars = { '--span': span, '--row-span': rowSpan, '--phone-span': phoneSpan, ...style } as CSSProperties
  return (
    <Element
      className={className ? `ja-tile ${className}` : 'ja-tile'}
      data-tone={tone === 'plain' ? undefined : tone}
      style={vars}
      {...rest}
    >
      {(title || actions) && (
        <div className="ja-tile-head">
          {title && <h2 className="ja-tile-title">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </Element>
  )
}
