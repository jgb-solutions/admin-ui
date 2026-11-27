# Changelog

## 0.1.5

- `PageSize`: "Rows per page", a native select (default choices `PAGE_SIZES`: 25, 50, 100, 200). The app keeps the size (e.g. `?per=50`) and goes back to the first page when it changes. Use it beside a keyset pager, or through `Pagination`'s new `pageSize`, `onPageSize` and `pageSizes`.

## 0.1.4

- `DataTable` sorting. A column with `sort` gets a header button (the arrow shows the direction; `aria-sort` on the sorted header). The app keeps the sort (`sort`, `onSortChange`), e.g. in the URL's search params. With `sortRows`, the table sorts the rows it's given with the column's `compare` (when the app passes all the rows); without it, the app or the server sorts. On phones, where headers are hidden, a "Sort by" list does the same.
- `nextSort`, `sortRows`, `byText` (as people read it: case and accents aside, numbers in order), `byNumber` (a missing value counts as the smallest), and the `TableSort`, `SortDirection` and `ColumnSort` types.
- `ThemeToggle` in the sidebar: each choice is as wide as its name, so "Match system" keeps its padding.

## 0.1.3

- `ThemeToggle`: three choices, Light, Dark and Match system, as a radio group (arrow keys, Home and End move and pick; the chosen one is the tab stop). Before, it only switched between light and dark, so the system's theme couldn't be picked again. With `tone="night"` (the sidebar) the names show next to the icons; in a collapsed sidebar it's one button that goes to the next choice ("Theme: Light. Switch to Dark").
- `icons.screen`: a screen, for the system's theme.

## 0.1.2

- `LineChart`, `BarChart`: the screen-reader table of values sits in a hidden `div`. A table ignores the hidden box's size and overflow, so a 30-point chart stretched the page by about 200 px.
- `Tile`: a tile with a `title` is a region named by its heading (`aria-labelledby`), so assistive technology and tests find it by name. An `aria-label` or `aria-labelledby` the app passes still wins.
- `Field` (and `TextInput`, `TextArea`, `Select`): the error is `role="alert"`, so an error that appears after a submit is read out.
- `.ja-form`: a form inside a tile, spaced from the text above it and from what follows.

## 0.1.1

- The first version published from GitHub, with provenance (npm trusted publishing). No changes to the components.
- The release workflow builds before type-checking (`scripts/check-package.ts` imports `dist/`), and runs `check:install` too, like CI.

## 0.1.0

Published by hand: npm only lets a trusted publisher be set up on a package that already exists, so 0.1.0 has no provenance.

- Design tokens (light and dark, every text pair WCAG AA), scoped to `.ja-root`.
- The shell: `AdminShell` (theme, brand colour, layout), `Sidebar` (collapsible to an icon rail), `Dock`, `PageHeader`, `TopSearch`, `ThemeToggle`, `useAdminTheme`.
- Data blocks: `Bento`, `Tile` (spans, plain / night / sun), `StatTile`, `Meter`, `AvatarStack`, `DeltaText`, `HeroChartTile` (with `LineChart` and the period `SegmentedControl`), `DataTable` (headers, inline cells, row cards on phones, skeleton loading, empty state, row flash), `PersonCell`, `RowAction`, `FilterTabs`, `Pagination`, `StatusBadge` and `PEOPLE_STATUS`, `ActivityFeed` (grouped by day, loading and empty states).
- Forms and actions: `Field` (label, hint and error tied to any control), `TextInput`, `TextArea`, `Select`, `Checkbox`, `Switch`; `ConfirmDialog` (the browser's `<dialog>`: focus kept inside, Escape cancels); `useToast` (done and error toasts, announced politely; AdminShell provides them); `RolePicker` (inline, risky roles confirm first); `BanControl` (suspend with a reason, restore).
- Charts: `BarChart` (one series, or this period against the last with a legend) alongside `LineChart`; both SVG, no chart library. Values show on hover and from the keyboard (one tab stop per chart, arrow keys), and each chart has a table of its values for screen readers.
- Basics: `Button`, `IconButton`, `Avatar`, `icons`, `contrastRatio`, `inkOn`.
