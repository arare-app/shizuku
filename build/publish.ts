import { execSync as exec } from 'child_process';

import { statSync, rmSync } from 'fs';

// Remove the old build
if (statSync('dist').isDirectory()) {
  rmSync('dist', { recursive: true });
}

// Build the new one
exec('yarn run build');

const option = { cwd: 'dist' }
// Git init
exec('git init', option);
exec('git add .', option);
exec('git commit -m "ci: publish"', option);

// Git add remote
exec('git remote add origin git@github.com:maikolib/bcscripts', option);

// Git push
exec('git push -u origin master:dist --force', option);
