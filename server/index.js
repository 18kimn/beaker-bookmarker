import express from 'express'
import cors from 'cors'
import {promises as fs} from 'fs'
const app = express()
app.use(cors())
const port = 3200

const bookmarks = await fs.readFile('./bookmarks.json', 'utf-8')
console.log(bookmarks)
app.get('/', (_, res) => {
  res.send(bookmarks)
})

app.post('/', (req) => {
  fs.writeFile('./bookmarks.json', req)
  res.end()
})

app.listen(port, () => {
  console.log(`beaker-bookmarker listening at http://localhost:${port}`)
})
