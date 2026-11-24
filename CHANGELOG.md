# Changelog

## 0.1.0 (unreleased)

- Design tokens (light and dark, every text pair WCAG AA), scoped to `.ja-root`.
- The shell: `AdminShell` (theme, brand colour, layout), `Sidebar` (collapsible to an icon rail), `Dock`, `PageHeader`, `TopSearch`, `ThemeToggle`, `useAdminTheme`.
- Data blocks: `Bento`, `Tile` (spans, plain / night / sun), `StatTile`, `Meter`, `AvatarStack`, `DeltaText`, `HeroChartTile` (with `LineChart` and the period `SegmentedControl`), `DataTable` (headers, inline cells, row cards on phones, skeleton loading, empty state, row flash), `PersonCell`, `RowAction`, `FilterTabs`, `Pagination`, `StatusBadge` and `PEOPLE_STATUS`, `ActivityFeed` (grouped by day, loading and empty states).
- Forms and actions: `Field` (label, hint and error tied to any control), `TextInput`, `TextArea`, `Select`, `Checkbox`, `Switch`; `ConfirmDialog` (the browser's `<dialog>`: focus kept inside, Escape cancels); `useToast` (done and error toasts, announced politely; AdminShell provides them); `RolePicker` (inline, risky roles confirm first); `BanControl` (suspend with a reason, restore).
- Charts: `BarChart` (one series, or this period against the last with a legend) alongside `LineChart`; both SVG, no chart library, each with a table of its values for screen readers.
- Basics: `Button`, `IconButton`, `Avatar`, `icons`, `contrastRatio`, `inkOn`.
