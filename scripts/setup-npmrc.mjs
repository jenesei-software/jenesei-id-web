import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const token = process.env.TIMEWEB_NPM_TOKEN

if (!token) {
  console.error('❌ Environment variable TIMEWEB_NPM_TOKEN is not set.')
  process.exit(1)
}

const npmrcContent = `//npm.pkg.github.com/:_authToken=${token}
@jenesei-software:registry=https://npm.pkg.github.com/
`

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const npmrcPath = path.resolve(__dirname, '../.npmrc')

fs.writeFileSync(npmrcPath, npmrcContent, 'utf8')

console.log(`✅ .npmrc created at ${npmrcPath}`)
