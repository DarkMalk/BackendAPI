import Note from '../models/Note.js'
import User from '../models/User.js'
import { app } from '../index.js'
import supertest from 'supertest'

const api = supertest(app)

const INITIAL_NOTES = [
  { title: 'note 1', content: 'content of note 1' },
  { title: 'note 2', content: 'content of note 2' }
]

const deleteAndCreateNoteTest = async () => {
  await Note.deleteMany({})
  const note1 = new Note(INITIAL_NOTES[0])
  await note1.save()
  const note2 = new Note(INITIAL_NOTES[1])
  await note2.save()
}

const firstNoteTest = async () => {
  const note = await Note.findOne({})
  return note
}

const createUserTest = async () => {
  const res = await api.post('/api/users').send({ username: 'test', email: 'test@gmail.com', password: 'hola123' })
  return res.body
}

const getAllUsers = async () => {
  const users = await User.find({})
  return users
}

export { INITIAL_NOTES, deleteAndCreateNoteTest, firstNoteTest, api, createUserTest, getAllUsers }
