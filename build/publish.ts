import { execSync as exec } from 'child_process'

import { cpSync, statSync, rmSync } from 'fs'

// Remove the old build
try {
  if (statSync('dist').isDirectory()) {
    rmSync('dist', { recursive: true })
  }
} catch (e) {
  // Ignore
}

// Build the new one
exec('yarn run build')

// copy `index.html` to `dist`
cpSync('index.html', 'dist/index.html')
// copy `shizuku.user.js` to `dist`
cpSync('shizuku.user.js', 'dist/shizuku.user.js')

const option = { cwd: 'dist' }
// Git init
exec('git init', option)
exec('git add .', option)
exec('git commit -m "ci: publish"', option)

// Git add remote
exec('git remote add origin git@github.com:maikolib/shizuku', option)

// Git push
exec('git push -u origin master:dist --force', option)
