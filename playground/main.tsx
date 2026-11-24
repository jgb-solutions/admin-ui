import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ActivityFeed,
  AdminShell,
  Avatar,
  AvatarStack,
  Bento,
  Button,
  DataTable,
  FilterTabs,
  HeroChartTile,
  IconButton,
  icons,
  Meter,
  PageHeader,
  Pagination,
  PEOPLE_STATUS,
  PersonCell,
  RowAction,
  StatTile,
  StatusBadge,
  ThemeToggle,
  Tile,
  TopSearch,
  type Column,
  type NavSection,
  type RenderLink,
} from '../src'
import { ACTIVITY, PEOPLE, VISITS, type Person } from './data'

/**
 * The playground: what an app builds with the kit, on sample data (a made-up app, "Tidepool").
 * Pages switch through the hash, as a router would. `?state=loading` or `?state=empty` shows the
 * loading and empty states.
 */
const PAGES = ['overview', 'users', 'content', 'reports', 'analytics', 'settings'] as const
type Page = (typeof PAGES)[number]
const STATE = new URLSearchParams(location.search).get('state')

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

const hashLink =
  (go: (page: Page) => void): RenderLink =>
  ({ item, children, ...rest }) => (
    <a
      href={item.href}
      {...rest}
      onClick={(event) => {
        event.preventDefault()
        history.replaceState(null, '', `${location.search}${item.href}`)
        go(pageOf(item.href))
      }}
    >
      {children}
    </a>
  )

type Filter = 'all' | 'admins' | 'suspended'

function UsersTile({ span, pageSize }: { span: number; pageSize: number }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState(STATE === 'empty' ? 'zebra' : '')
  const [page, setPage] = useState(1)
  const rows = useMemo(
    () =>
      PEOPLE.filter((p) => (filter === 'admins' ? p.role === 'Admin' : filter === 'suspended' ? p.status === 'suspended' : true)).filter(
        (p) => !query || `${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query],
  )
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const shown = rows.slice((page - 1) * pageSize, page * pageSize)
  const columns: Column<Person>[] = [
    {
      key: 'person',
      header: 'Person',
      cell: (p) => <PersonCell name={p.name} detail={p.email} avatar={<Avatar name={p.name} shape="soft" />} />,
    },
    { key: 'role', header: 'Role', cell: (p) => p.role, phone: { order: 3 } },
    {
      key: 'status',
      header: 'Status',
      cell: (p) => <StatusBadge tone={PEOPLE_STATUS[p.status].tone}>{PEOPLE_STATUS[p.status].label}</StatusBadge>,
      phone: { order: 2, align: 'end' },
    },
    { key: 'joined', header: 'Joined', cell: (p) => <span className="ja-muted">{p.joined}</span>, phone: { hidden: true } },
    {
      key: 'action',
      header: '',
      srHeader: 'Actions',
      align: 'end',
      phone: { order: 4, align: 'end' },
      cell: (p) =>
        p.status === 'suspended' ? (
          <RowAction aria-label={`Restore ${p.name}`}>Restore</RowAction>
        ) : p.status === 'invited' ? (
          <RowAction aria-label={`Resend invite to ${p.name}`}>Resend invite</RowAction>
        ) : (
          <RowAction danger aria-label={`Suspend ${p.name}`}>
            Suspend
          </RowAction>
        ),
    },
  ]
  return (
    <Tile
      span={span}
      title="Users"
      actions={
        <>
          <FilterTabs<Filter>
            label="Show"
            options={[
              { value: 'all', label: 'All' },
              { value: 'admins', label: 'Admins' },
              { value: 'suspended', label: 'Suspended' },
            ]}
            value={filter}
            onChange={(value) => {
              setFilter(value)
              setPage(1)
            }}
          />
          <TopSearch
            className="ja-filter-search"
            label="Search by name or email"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
        </>
      }
    >
      <DataTable
        label="Users"
        columns={columns}
        rows={shown}
        rowKey={(p) => p.id}
        loading={STATE === 'loading'}
        empty={
          <>
            No people match “{query}”.{' '}
            <button type="button" className="ja-row-action" onClick={() => setQuery('')}>
              Clear the search
            </button>
          </>
        }
      />
      <Pagination
        page={page}
        pages={pages}
        onPage={setPage}
        label="User pages"
        summary={rows.length ? `${(page - 1) * pageSize + 1}–${(page - 1) * pageSize + shown.length} of ${rows.length} people` : undefined}
      />
    </Tile>
  )
}

function Overview() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')
  const totals = { day: '3,420', week: '48,920', month: '157,220' }
  return (
    <Bento aria-label="Tidepool at a glance">
      <HeroChartTile
        label={`Visits this ${period}`}
        value={totals[period]}
        delta={{ value: '+12.4%', direction: 'up', label: `on last ${period}` }}
        data={[...VISITS[period]]}
        chartLabel={`Visits per ${period === 'day' ? 'hour today' : period === 'week' ? 'day this week' : 'week this month'}`}
        periods={{
          label: 'Period',
          options: [
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ],
          value: period,
          onChange: setPeriod,
        }}
      />
      <StatTile
        span={4}
        label="Active users"
        value="2,481"
        note="72% of everyone with an account"
        delta={{ value: 'up 8.2%', direction: 'up' }}
      >
        <Meter value={0.72} label="72% of everyone with an account" />
      </StatTile>
      <StatTile span={3} label="New sign-ups" value="316">
        <AvatarStack
          names={['Priya Nair', 'Ada Okafor', 'Sun-hee Kim']}
          more={313}
          label="Priya Nair, Ada Okafor, Sun-hee Kim and 313 others"
        />
      </StatTile>
      <StatTile span={3} phoneSpan={1} tone="sun" label="Open reports" value="7" note="3 fewer than Monday" />
      <StatTile span={4} phoneSpan={1} label="Pages published" value="94" note="Busiest day: Thursday, 22 pages" />
      <UsersTile span={8} pageSize={4} />
      <Tile span={4} title="Latest activity">
        <ActivityFeed items={STATE === 'empty' ? [] : ACTIVITY} loading={STATE === 'loading'} />
      </Tile>
    </Bento>
  )
}

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
        title={page === 'users' ? 'Users' : "Hi Maya, it's a good week."}
        description={page === 'users' ? 'Everyone with an account.' : 'Tidepool at a glance.'}
        tools={
          <>
            <TopSearch label="Search anything" />
            <ThemeToggle />
            <IconButton label="Notifications" icon={<icons.bell />} dot />
          </>
        }
        actions={<Button icon={<icons.plus />}>Invite people</Button>}
      />
      {page === 'users' ? (
        <Bento aria-label="Users">
          <UsersTile span={12} pageSize={6} />
        </Bento>
      ) : (
        <Overview />
      )}
    </AdminShell>
  )
}

createRoot(document.getElementById('root')!).render(<Playground />)
