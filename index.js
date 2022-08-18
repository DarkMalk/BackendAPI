import express from 'express'
import 'dotenv/config'
import clc from 'cli-color'
import bodyParser from 'body-parser'
import cors from 'cors'

// Test Notes
import notesTest from './test-notes.js'
let notes = notesTest

// Application
const app = express()

// MiddleWare
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// Routes of server
app
  .route('/api/notes')
  .get((req, res) => res.json(notes))
  .post((req, res) => {
    const { title, content } = req.body
    if (!title && !content) return res.status(400).json({ error: 'title and content is required' })
    const ids = notes.map(item => item.id)
    const maxId = Math.max(...ids)
    const newNote = {
      id: maxId + 1,
      title,
      content,
      date: new Date().toLocaleDateString()
    }
    notes = [...notes, newNote]
    res.status(201).json(newNote)
  })

app
  .route('/api/notes/:id')
  .get((req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(item => item.id === id)

    if (note) {
      res.json(note)
    } else {
      res.status(404).json({ message: 'Note Not Found' })
    }
  })
  .delete((req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(item => item.id !== id)
    res.status(204).end()
  })

// Server listen and message
const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  const message = `${clc.whiteBright('Server listen on Port:')} ${clc.blueBright(PORT)}`
  console.log(message)
})
