// GitHub Pages serves 404.html for unknown paths; making it the SPA shell lets /research survive a reload.
import { copyFileSync } from 'node:fs'
copyFileSync('dist/index.html', 'dist/404.html')
