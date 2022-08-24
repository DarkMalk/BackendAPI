const { Router } = require('express')
const Note = require('../models/Note.js')
const User = require('../models/User.js')
require('dotenv').config()
const Errors = require('../helper/Errors.js')
const userExtractor = require('../middleware/userExtractor.js')
const notesRouter = Router()

notesRouter.get('/', userExtractor, (req, res, next) => {
  const { user } = req.body
  Note.find({ user })
    .then(notes => res.json(notes))
    .catch(() => next())
})

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { title, content, user } = req.body

  if (!title || !content) return next(Errors.MissingTitleOrContent)
  const newNote = new Note({ title, content, user })
  newNote
    .save()
    .then(async note => {
      const user = await User.findById(note.user)
      user.notes = [...user.notes, note.id]
      await user.save()
      return res.status(201).json(note)
    })
    .catch(() => next())
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.find({ _id: id })
    .then(note => res.status(302).json(note))
    .catch(error => next(error))
})

notesRouter.put('/:id', userExtractor, (req, res, next) => {
  const id = req.params.id
  const { title, content } = req.body
  if (!title && !content) return next(Errors.MissingTitleAndContent)
  Note.findOneAndUpdate({ _id: id }, { title, content }, { returnDocument: 'after' })
    .then(note => res.json(note))
    .catch(error => next(error))
})

notesRouter.delete('/:id', userExtractor, (req, res, next) => {
  const id = req.params.id
  Note.findOneAndRemove({ _id: id })
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

module.exports = notesRouter
