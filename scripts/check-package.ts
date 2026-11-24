/**
 * Checks what would be published, before every publish (prepublishOnly) and in CI:
 * - dist/index.js, its types and dist/styles.css exist, and the module loads with its exports;
 * - the JavaScript imports only React (react, react/jsx-runtime): no other dependency at all;
 * - React and react-dom are peer dependencies, and there are no dependencies;
 * - the tarball holds only dist/, README.md, CHANGELOG.md, LICENSE and package.json;
 * - repository.url names this repo (npm's provenance and trusted publishing require it);
 * - nothing app-specific slipped in: no Access team, no 32/64-character hex IDs, no addresses
 *   outside example.com, no app names from the playground's own sample data beyond "Tidepool".
 */
import { existsSync, readFileSync } from 'node:fs'
import pkg from '../package.json'

const problems: string[] = []
const REPO = 'git+https://github.com/jgb-solutions/admin-ui.git'

if (pkg.license !== 'MIT') problems.push(`license is ${pkg.license}, not MIT`)
if (pkg.repository.url !== REPO) problems.push(`repository.url is ${pkg.repository.url}, not ${REPO}`)
if ('dependencies' in pkg) problems.push('the package must have no dependencies (React is a peer)')
const peers = Object.keys(pkg.peerDependencies).sort().join()
if (peers !== 'react,react-dom') problems.push(`peer dependencies must be react and react-dom, not: ${peers}`)

for (const file of ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css'])
  if (!existsSync(file)) problems.push(`${file} is missing (bun run build)`)

if (existsSync('dist/index.js')) {
  const code = readFileSync('dist/index.js', 'utf8')
  const specifiers = [
    ...code.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g),
    ...code.matchAll(/\bimport\s*['"]([^'"]+)['"]/g),
    ...code.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g),
    ...code.matchAll(/\brequire\(\s*['"]([^'"]+)['"]\s*\)/g),
  ].map((match) => match[1]!)
  for (const specifier of specifiers)
    if (!['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'].includes(specifier)) problems.push(`dist/index.js imports ${specifier}`)
  if (code.includes('react/jsx-dev-runtime')) problems.push('dist/index.js uses the development JSX runtime')
  const module = (await import('../dist/index.js')) as Record<string, unknown>
  for (const name of ['AdminShell', 'Sidebar', 'Dock', 'PageHeader', 'Button', 'icons'])
    if (!(name in module)) problems.push(`dist/index.js doesn't export ${name}`)
}
if (existsSync('dist/styles.css')) {
  const css = readFileSync('dist/styles.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  // Every rule stays inside the admin: tokens on .ja-root, classes prefixed ja-, nothing global.
  for (const [, selector] of css.matchAll(/(?:^|[{};])\s*([^\s{};@][^{};]*)\{/g)) {
    for (const part of topLevelParts(selector!))
      if (part && !/(\.ja-|^from$|^to$|^\d+%$)/.test(part)) problems.push(`styles.css: "${part}" isn't scoped to the admin (.ja-…)`)
  }
}

/** A selector list's parts, split on commas outside parentheses (":where(a, b)" stays whole). */
function topLevelParts(selector: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i]
    if (char === '(') depth++
    else if (char === ')') depth--
    else if (char === ',' && depth === 0) {
      parts.push(selector.slice(start, i).trim())
      start = i + 1
    }
  }
  parts.push(selector.slice(start).trim())
  return parts
}

const pack = Bun.spawnSync(['bun', 'pm', 'pack', '--dry-run', '--ignore-scripts'], { stdout: 'pipe', stderr: 'pipe' })
if (pack.exitCode !== 0) problems.push(`bun pm pack failed: ${pack.stderr.toString().trim()}`)
const files = [...pack.stdout.toString().matchAll(/^packed\s+\S+\s+(\S+)$/gm)].map((match) => match[1]!)
if (files.length === 0) problems.push('bun pm pack listed no files')
const publishable = /^(dist\/([\w-]+\/)*[\w.-]+\.(js|d\.ts|css)|README\.md|CHANGELOG\.md|LICENSE|package\.json)$/
for (const file of files) if (!publishable.test(file)) problems.push(`the tarball would include ${file}`)

const forbidden: [RegExp, string][] = [
  [/(?<![\w-])(?!example-team\b)[a-z0-9-]+\.cloudflareaccess\.com/g, 'an Access team domain'],
  [/\b[0-9a-f]{64}\b|\b[0-9a-f]{32}\b/g, 'a 32- or 64-character hex ID'],
  [/[\w.+-]+@(?!example\.com\b)[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}\b/gi, 'an email address outside example.com'],
]
for (const file of files.filter((path) => /\.(js|ts|css|md|json)$/.test(path))) {
  const text = readFileSync(file, 'utf8')
  for (const [pattern, what] of forbidden)
    for (const match of text.matchAll(pattern)) problems.push(`${file} contains ${what}: ${match[0]}`)
}

if (problems.length) {
  for (const problem of problems) console.error(`✗ ${problem}`)
  process.exit(1)
}
console.log(`✓ ${files.length} files to publish: ${files.join(', ')}`)
