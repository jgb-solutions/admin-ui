# @jgb-solutions/admin

The admin panel kit for JGB Solutions apps: a React shell, data blocks, forms and SVG charts, styled once, accessible (WCAG 2.1 AA), phone-ready, light and dark. Each app builds its own pages from it. MIT.

**Status: 0.1.x, the first version:** the tokens, the shell, data blocks, forms and actions, and charts.

## What it is, and what it isn't

- **In:** the shell, navigation, data blocks, forms, actions and charts every admin needs.
- **Not in:** any app's pages, data, roles or rules. Components take data and callbacks; the app fetches, checks permissions on the server, and decides what happens. No business logic, secrets, app IDs or infrastructure details.

The look, "Bento + Daylight's details" (2026-11-24): rounded tiles of different sizes on a tinted canvas, a dark hero tile, a floating dark sidebar and a floating dock on phones, with a labelled sidebar, real table headers, an inline role picker and an activity feed.

## Use

```sh
bun add @jgb-solutions/admin
```

React 19 is a peer dependency. Import the stylesheet once, and load the two fonts (or let the fallbacks stand in):

```tsx
import '@jgb-solutions/admin/styles.css'
import { AdminShell, PageHeader, Button, TopSearch, ThemeToggle, icons } from '@jgb-solutions/admin'
// Fonts: Bricolage Grotesque (700, 800) and Figtree (400, 500, 600), from Google Fonts or self-hosted.

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      app={{ name: 'Example', mark: 'E' }}
      brand="#6b4ce6"
      nav={[
        {
          label: 'Manage',
          items: [
            { key: 'overview', label: 'Overview', href: '/admin', icon: <icons.home />, current: true },
            { key: 'users', label: 'Users', href: '/admin/users', icon: <icons.users />, count: 2481 },
          ],
        },
        { placement: 'end', items: [{ key: 'settings', label: 'Settings', href: '/admin/settings', icon: <icons.gear /> }] },
      ]}
      user={{ name: 'Maya Reyes', role: 'Admin' }}
      // With a router, render its own link: renderLink={({ item, children, ...rest }) => <Link to={item.href} {...rest}>{children}</Link>}
    >
      {children}
    </AdminShell>
  )
}
```

Every class is prefixed `ja-` and every token lives on `.ja-root` (AdminShell's element): the admin never restyles the rest of the app.

## Components

### Shell

- `AdminShell`: the frame. Desktop: the floating dark sidebar. At 760 px and below: a top bar (the app's mark, the theme switch, `mobileActions`) and the floating dock. Holds the theme and the app's brand colour.
  - `brand`: a hex colour. Text on it (buttons, the current page) is white or ink, whichever reads better (`inkOn`).
  - `nav`: sections of items (`key`, `label`, `href`, `icon`, optional `count`, `current`). Sections with `placement: 'end'` sit at the bottom.
  - `dockItems`: the keys the phone's dock shows (at most 5; default the first 5).
  - `renderLink`: renders a link with the app's router. Default `<a href>`.
  - Theme: light, dark or the system's (default). Remembered in this browser, or controlled with `theme` and `onThemeChange` (e.g. kept in a cookie so the server renders it). Server rendering shows `defaultTheme` ("system": the CSS follows the system's dark mode with no script).
- `Sidebar`: collapses to an icon rail, remembered per browser. In the rail, labels become tooltips and stay the links' names; counts over 99 show as "99+".
- `Dock`: up to 5 items, icon over label.
- `PageHeader`: the page's one h1, a line of context, desktop-only `tools` (search, theme, notifications) and `actions` (one primary).
- `TopSearch`, `useAdminTheme()`.
- `ThemeToggle`: Light, Dark or Match system, a radio group. The phone's top bar has one; put another in the sidebar with `sidebarFooter={<ThemeToggle tone="night" />}` (names shown; one cycling button when the sidebar is collapsed).

### Data blocks

- `Bento` and `Tile` (`span` of 12, `rowSpan`, `phoneSpan` of 2, `tone="plain" | "night" | "sun"`, optional `title` and `actions`); a titled tile is a region named by its title).
- `StatTile`: label, number, `delta` (up or down, coloured by whether it's good news), `note`, and a `Meter` or `AvatarStack` inside.
- `HeroChartTile`: the dark tile with the big number, its delta, a period switch (`SegmentedControl`) and a `LineChart`.
- `DataTable`: column headers, any cell (`PersonCell`, `StatusBadge`, `RowAction`…), rows that become cards on phones (each column's `phone` setting places it), skeleton rows while loading, an empty state that says what to do, and a one-second highlight for changed rows (`flash`). `FilterTabs` and `Pagination` sit around it (`Pagination` can offer "Rows per page" with `pageSize` and `onPageSize`; `PageSize` alone goes beside a keyset pager). Sortable columns: give a column `sort` (`compare: byText(...)` or `byNumber(...)`, `first: 'desc'` for numbers), keep the sort in the app (`sort`, `onSortChange`, e.g. in the URL), and pass `sortRows` when the table holds all the rows; for a long list, sort on the server and pass the page. Phones get a "Sort by" list.
- `ActivityFeed`: icon, sentence and time, grouped by day; loading and empty states.
- `LineChart`: one series, a fading fill, the last point marked, labels underneath, and a table of the values for screen readers.

### Forms and actions

- `TextInput`, `TextArea`, `Select` (native), each with its `label`, `hint` and `error` tied to the control; `Field` does the same for any other control; an error is read out when it appears. Put a form inside a tile in `<form className="ja-form">`.
- `Checkbox`, and `Switch` for settings that apply at once (`role="switch"`).
- `ConfirmDialog`: the browser's own `<dialog>` (focus stays inside, Escape and the backdrop cancel, focus returns), a button that names the action ("Suspend Leo Martin"), destructive styling.
- `useToast()`: `toast.done('Suspended Leo Martin.')` (gone after 4 s) and `toast.error(…)` (stays until dismissed); above the dock on phones.
- `RolePicker`: an inline role select for a table row; roles listed in `confirm` ask first ("Make Ada Okafor an Admin?").
- `BanControl`: suspend with an optional reason, after a confirmation, or restore.

### Charts (SVG, no chart library)

- `LineChart`: one series, a fading fill, the last point marked, labels underneath (`color="sun" | "brand"`).
- `BarChart`: one series, or two (this period and the last, with a legend).
- Both stretch to their tile, take an accessible `label`, and add a table of the values for screen readers.

### Basics

- `Button` (`primary`, `quiet`, `danger`; `small`), `IconButton` (always named by `label`; optional `dot`).
- `Avatar`: a picture or initials, with a colour pair kept per name.
- `icons`: a small line-icon set (24×24, `currentColor`). Any other icon works as a ReactNode.

## Design tokens

CSS custom properties on `.ja-root`, light by default, dark with `data-theme="dark"` or the system's dark mode. Apps set `--brand` (AdminShell's `brand`); the rest are the kit's.

| Token                         | Light                             | Dark                              | Use                                                                  |
| ----------------------------- | --------------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| `--brand`                     | the app's (example `#6b4ce6`)     | same                              | current page, primary buttons, meters, links                         |
| `--brand-ink`                 | white or ink, picked for contrast | same                              | text on `--brand`                                                    |
| `--sun` / `--sun-ink`         | `#ffc84a` / `#4a3500`             | same                              | the kit's highlight: the hero chart line, one highlight tile, badges |
| `--canvas`                    | `#eceaf6`                         | `#121022`                         | page background                                                      |
| `--tile` / `--tile-sunk`      | `#ffffff` / `#f6f5fb`             | `#1c1930` / `#24203a`             | tiles, inputs; rows and fields inside tiles                          |
| `--night`                     | `#1f1b33`                         | `#0d0b18`                         | sidebar, hero tile, dock, toasts                                     |
| `--ink` / `--muted`           | `#1c1930` / `#6b6785`             | `#f1effa` / `#a39fbf`             | text, secondary text                                                 |
| `--line`                      | `#e4e1f0`                         | `#2e2a47`                         | control borders                                                      |
| `--good` / `--warn` / `--bad` | `#158150` / `#946200` / `#b42318` | `#4cc38a` / `#f0b429` / `#ff7a6b` | status: active, invited, suspended; deltas                           |

Every text pair meets WCAG AA; `src/contrast.test.ts` checks them, and the E2E tests run axe in light and dark. Two values differ slightly from the approved mockup for that reason: `--muted` (`#6d6987` was 4.39:1 on the canvas) and `--good` (`#18915a` was 3.7:1 on rows).

Type: Bricolage Grotesque (700/800) for titles and numbers (`tabular-nums`), Figtree (400/500/600) for the rest. Sentence case everywhere. Shape: tiles 24 px (20 on phones), controls 12 px, pills. Motion only in answer to an action, and none with `prefers-reduced-motion`.

## Develop

```sh
bun install
bun run playground      # every component with sample data, http://127.0.0.1:4400
bun run test            # unit tests (contrast, avatars…)
bun run test:e2e        # axe (light and dark), phone width, behaviour, against the playground
bun run screenshots     # desktop and phone screenshots into .screenshots/
bun run build && bun run check:package
```

## Publishing

Releases come from GitHub, with provenance: GitHub Actions publishes (`.github/workflows/publish.yml`) when a GitHub release is published for the tag `vX.Y.Z` matching `package.json`'s version, after the run is approved in the `npm` environment. It uses npm's trusted publishing (OIDC): no npm token is stored anywhere. A stable version moves the `latest` tag; a prerelease (`0.2.0-beta.1`) goes to `next`. 0.1.0 was published by hand, because npm only lets a trusted publisher be set up on a package that already exists, so it has no provenance; 0.1.1 is the first from GitHub.

Versions follow semver. Until 1.0, a minor version may change components' props; the changelog says how.
