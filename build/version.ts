import { promises as fsp } from 'fs'

async function replaceInFile(path: string, regex: RegExp, result: string) {
  const source = await fsp.readFile(path, 'utf8')
  const updated = source.replace(regex, result)
  await fsp.writeFile(path, updated, 'utf8')
}

;(async () => {
  const version = process.argv[2]
  if (!version) {
    console.error('Usage: yarn bump <version>')
    process.exit(1)
  }

  await replaceInFile('package.json', /"version": "[^"]+"/, `"version": "${version}"`)
  await replaceInFile('src/hooks/native.ts', /export const version = "[^"]+"/, `export const version = "${version}"`)
  await replaceInFile('shizuku.user.js', /(?<=@version +)[^ ]+\n/, `${version}\n`)
})()
