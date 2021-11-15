import express from 'express'
import cors from 'cors'
import {promises as fs} from 'fs'
import {fileURLToPath} from 'url'
import {resolve, dirname} from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))
const bookmarks = await fs.readFile(
  resolve(__dirname, 'bookmarks.json'),
  'utf-8',
)
app.get('/', (_, res) => {
  res.header('Content-Type', 'application/json')
  res.send(bookmarks)
})

app.post('/', async (req, res) => {
  const bookmarks = req.body
  console.log(bookmarks)
  await fs.writeFile(
    resolve(__dirname, 'bookmarks.json'),
    JSON.stringify(bookmarks),
  )
  res.end()
})

const port = 3200
app.listen(port, () => {
  console.log(`beaker-bookmarker listening at http://localhost:${port}`)
})
