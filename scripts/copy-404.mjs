// GitHub Pages serves 404.html for unknown paths; making it the SPA shell lets any path survive a reload.
// Known routes also get their own index.html so they answer 200 instead of 404 (search engines skip 404s).
import { copyFileSync, mkdirSync } from 'node:fs'

const ROUTES = ['research', 'gallery', 'battery-sim'] // keep in sync with src/App.tsx
copyFileSync('dist/index.html', 'dist/404.html')
for (const r of ROUTES) {
  mkdirSync(`dist/${r}`, { recursive: true })
  copyFileSync('dist/index.html', `dist/${r}/index.html`)
}
