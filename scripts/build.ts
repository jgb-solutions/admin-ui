/**
 * Builds the package: dist/index.js (every component, ESM, React left to the app), its type
 * declarations (tsc, tsconfig.build.json), and dist/styles.css (src/styles/*.css, in order). The app
 * imports the stylesheet once: `import '@jgb-solutions/admin/styles.css'`.
 */
import { readdirSync, rmSync } from 'node:fs'

rmSync('dist', { recursive: true, force: true })

const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: 'dist',
  root: 'src',
  format: 'esm',
  target: 'browser',
  packages: 'external',
  splitting: false,
  minify: false,
  sourcemap: 'none',
  // The production JSX runtime (react/jsx-runtime), whatever NODE_ENV the build runs with.
  jsx: { development: false },
})
if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}

// One stylesheet, from the files in src/styles/ in name order (00-tokens.css first).
const sheets = readdirSync('src/styles')
  .filter((name) => name.endsWith('.css'))
  .sort()
const css = (await Promise.all(sheets.map((name) => Bun.file(`src/styles/${name}`).text()))).join('\n')
await Bun.write('dist/styles.css', css)

const types = Bun.spawnSync(['bunx', 'tsc', '-p', 'tsconfig.build.json'], { stdout: 'inherit', stderr: 'inherit' })
if (types.exitCode !== 0) process.exit(types.exitCode ?? 1)
console.log(`Built dist/index.js, its types and dist/styles.css (${sheets.length} sheets).`)
