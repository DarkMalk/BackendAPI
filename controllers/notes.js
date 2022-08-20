import { Router } from 'express'
import Note from '../models/Note.js'

const notesRouter = Router()

notesRouter.get('/', (req, res) => {
  Note.find({})
    .then(notes => res.json(notes))
    .catch(() => res.status(500).json({ error: 'An error has ocurred!' }))
})

notesRouter.post('/', (req, res) => {
  const { title, content, user } = req.body
  if (!title || !content) return res.status(400).json({ error: 'title and content is required' })
  if (!user) return res.status(400).json({ error: 'Id from user is required' })
  const newNote = new Note({ title, content, user })
  newNote
    .save()
    .then(note => res.status(201).json(note))
    .catch(() => res.status(500).json({ error: 'An error has ocurred!' }))
})

notesRouter.get('/:id', (req, res) => {
  const id = req.params.id
  Note.find({ _id: id })
    .then(note => res.status(302).json(note))
    .catch(() => res.status(404).json({ error: 'Note not found' }))
})

notesRouter.put('/:id', (req, res) => {
  const id = req.params.id
  const { title, content } = req.body
  Note.findOneAndUpdate({ _id: id }, { title, content }, { returnDocument: 'after' })
    .then(note => res.json(note))
    .catch(() => res.status(404).json({ error: `Note not exist with the id: ${id}` }))
})

notesRouter.delete('/:id', (req, res) => {
  const id = req.params.id
  Note.findOneAndRemove({ _id: id })
    .then(() => res.status(204).end())
    .catch(() => res.status(404).json({ error: `Note not exist with the id: ${id}` }))
})

export default notesRouter