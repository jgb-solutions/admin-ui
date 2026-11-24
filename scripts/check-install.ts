/**
 * Installs the packed package into an empty project with only React, and checks that it loads,
 * renders on the server without React warnings, ships styles.css, and type-checks with strict
 * TypeScript. Run after `bun run build`, in CI.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const run = (cmd: string[], cwd: string) => {
  const result = Bun.spawnSync(cmd, { cwd, stdout: 'pipe', stderr: 'pipe' })
  const out = result.stdout.toString() + result.stderr.toString()
  if (result.exitCode !== 0) {
    console.error(`✗ ${cmd.join(' ')}\n${out}`)
    process.exit(1)
  }
  return out
}

const CHECK = `import { renderToString } from 'react-dom/server'
import * as admin from '@jgb-solutions/admin'
import { AdminShell, BarChart, Button, LineChart, PageHeader, icons } from '@jgb-solutions/admin'

const css = await Bun.file(Bun.resolveSync('@jgb-solutions/admin/styles.css', import.meta.dir)).text()
if (!css.includes('.ja-root')) throw new Error('styles.css has no .ja-root')

const problems: unknown[] = []
console.error = (...args: unknown[]) => problems.push(args.join(' '))
const html = renderToString(
  <AdminShell
    app={{ name: 'Check', mark: 'C' }}
    nav={[{ items: [
      { key: 'home', label: 'Home', href: '/', icon: <icons.home />, current: true },
      { key: 'users', label: 'Users', href: '/users', icon: <icons.users />, count: 3 },
    ] }]}
    user={{ name: 'Ada Lovelace', role: 'Admin' }}
  >
    <PageHeader title="Check" />
    <Button>Save</Button>
    <LineChart data={[{ label: 'a', value: 1 }, { label: 'b', value: 3 }]} label="Line" />
    <BarChart labels={['a', 'b']} series={[{ label: 'x', values: [1, 2] }]} label="Bars" />
  </AdminShell>,
)
if (problems.length > 0) throw new Error('React warned while rendering:\\n' + problems.join('\\n'))
if (!html.includes('ja-root') || !html.includes('<table')) throw new Error('the render is missing parts')
console.log(Object.keys(admin).length + ' exports')
`

const dir = mkdtempSync(join(tmpdir(), 'admin-install-'))
try {
  const packed = run(['bun', 'pm', 'pack', '--ignore-scripts', '--destination', dir], process.cwd())
  const tarball = packed.match(/\S+\.tgz/)?.[0]
  if (!tarball) throw new Error(`bun pm pack gave no tarball:\n${packed}`)
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'admin-install-check', private: true, type: 'module' }))
  run(['bun', 'add', join(dir, tarball.split('/').pop()!), 'react@19', 'react-dom@19'], dir)
  run(['bun', 'add', '-d', 'typescript@6.0.3', '@types/react@19', '@types/react-dom@19', '@types/bun'], dir)
  writeFileSync(join(dir, 'check.tsx'), CHECK)
  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        target: 'es2022',
        lib: ['es2022', 'dom'],
        jsx: 'react-jsx',
        noEmit: true,
        skipLibCheck: false,
        types: ['bun'],
      },
      include: ['check.tsx'],
    }),
  )
  const loaded = run(['bun', 'check.tsx'], dir).trim()
  run(['bunx', 'tsc', '-p', 'tsconfig.json'], dir)
  console.log(`✓ the packed package installs with React alone, renders without warnings and type-checks (${loaded})`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
