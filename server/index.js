import express from 'express'
import cors from 'cors'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {resolve, dirname} from 'path'
import {config} from 'dotenv'
import fetchFavicon from './fetchFavicon.js'
config()

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))
const bookmarks = await fs.readFile(
  resolve(__dirname, '../dist/bookmarks.json'),
  'utf-8',
)
app.get('/', (_, res) => {
  res.header('Content-Type', 'application/json')
  res.send(bookmarks)
})

app.post('/', async (req, res) => {
  const bookmarks = req.body
  await fs.writeFile(
    resolve(__dirname, '../dist/bookmarks.json'),
    JSON.stringify(bookmarks),
  )
  await fs.writeFile(
    resolve(__dirname, '../public/bookmarks.json'),
    JSON.stringify(bookmarks),
  )
  res.end()
})

app.get('/icon', async (req, res) => {
  const domain = req.query.domain
  const base64String = await fetchFavicon(domain)
  res.send(base64String)
})

const port = process.env.VITE_PORT
app.listen(port, () => {
  console.log(`beaker-bookmarker listening at http://localhost:${port}`)
})
