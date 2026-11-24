import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminShell, Button, IconButton, icons, PageHeader, ThemeToggle, TopSearch, type NavSection, type RenderLink } from '../src'

/**
 * Sample data only (a made-up app, "Tidepool"): what an app passes. Pages switch through the hash,
 * as a router would, so the playground shows `renderLink` and the current item at work.
 */
const PAGES = ['overview', 'users', 'content', 'reports', 'analytics', 'settings'] as const
type Page = (typeof PAGES)[number]

function nav(current: Page): NavSection[] {
  const item = (key: Page, label: string, Icon: (typeof icons)[keyof typeof icons], count?: number) => ({
    key,
    label,
    href: `#${key}`,
    icon: <Icon />,
    count,
    current: current === key,
  })
  return [
    {
      label: 'Manage',
      items: [
        item('overview', 'Overview', icons.home),
        item('users', 'Users', icons.users, 2481),
        item('content', 'Content', icons.box),
        item('reports', 'Reports', icons.flag, 7),
        item('analytics', 'Analytics', icons.chart),
      ],
    },
    { placement: 'end', items: [item('settings', 'Settings', icons.gear)] },
  ]
}

const pageOf = (hash: string): Page => PAGES.find((page) => `#${page}` === hash) ?? 'overview'

/** A link that switches the page (as a router's Link would). */
const hashLink =
  (go: (page: Page) => void): RenderLink =>
  ({ item, children, ...rest }) => (
    <a
      href={item.href}
      {...rest}
      onClick={(event) => {
        event.preventDefault()
        history.replaceState(null, '', item.href)
        go(pageOf(item.href))
      }}
    >
      {children}
    </a>
  )

function Playground() {
  const [page, setPage] = useState<Page>(() => pageOf(location.hash))
  return (
    <AdminShell
      app={{ name: 'Tidepool', mark: 'T' }}
      brand="#6b4ce6"
      nav={nav(page)}
      dockItems={['overview', 'users', 'reports', 'settings']}
      user={{ name: 'Maya Reyes', role: 'Admin' }}
      renderLink={hashLink(setPage)}
      mobileActions={<IconButton label="Notifications" icon={<icons.bell />} dot />}
    >
      <PageHeader
        title="Hi Maya, it's a good week."
        description="Tidepool at a glance."
        tools={
          <>
            <TopSearch label="Search anything" />
            <ThemeToggle />
            <IconButton label="Notifications" icon={<icons.bell />} dot />
          </>
        }
        actions={<Button icon={<icons.plus />}>Invite people</Button>}
      />
      <section aria-label="Buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        <Button>Save changes</Button>
        <Button variant="quiet">Cancel</Button>
        <Button variant="danger">Suspend Leo Martin</Button>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted)' }}>
          Small, for actions in a row:
          <Button size="small" variant="quiet">
            Resend invite
          </Button>
        </span>
        <Button disabled>Saving…</Button>
      </section>
      <p style={{ color: 'var(--muted)', maxWidth: 560 }}>
        The shell, navigation, page header and buttons. Data blocks, forms and charts come in the next pull requests.
      </p>
      {/* Tall enough to show the sticky sidebar and the floating dock over content. */}
      <div style={{ height: 900 }} aria-hidden="true" />
      {/* The page's last control: on a phone it must end above the dock (e2e/shell.spec.ts). */}
      <Button variant="quiet">Load more</Button>
    </AdminShell>
  )
}

createRoot(document.getElementById('root')!).render(<Playground />)
