const supertest = require('supertest')
const { app } = require('../index.js')

// Helper global tests
const api = supertest(app)

// Helpers tests of login.test.js
const INITIAL_USER = {
  email: 'test@hotmail.com',
  username: 'test',
  password: 'test123'
}

// Helpers tests of notes.test.js
const tokenAuthenticate = async () => {
  const res = await api.post('/api/login').send({ email: INITIAL_USER.email, password: INITIAL_USER.password })
  return res.body.token
}

const INITIAL_NOTES = [
  { title: 'title note 1', content: 'content of note 1' },
  { title: 'title note 2', content: 'content of note 2' }
]

const createTwoNotesInitial = async () => {
  const token = await tokenAuthenticate()
  const firstNote = { title: INITIAL_NOTES[0].title, content: INITIAL_NOTES[0].content }
  await api.post('/api/notes').set('Authorization', `bearer ${token}`).send(firstNote)
  const secondNote = { title: INITIAL_NOTES[1].title, content: INITIAL_NOTES[1].content }
  await api.post('/api/notes').set('Authorization', `bearer ${token}`).send(secondNote)
}

const firstNote = async () => {
  const token = await tokenAuthenticate()
  const res = await api.get('/api/notes').set('Authorization', `bearer ${token}`)
  return res.body[0]
}

// Others helpers
const createUserInitial = async () => {
  await api
    .post('/api/users')
    .send({ email: INITIAL_USER.email, username: INITIAL_USER.username, password: INITIAL_USER.password })
}

module.exports = {
  api,
  INITIAL_USER,
  tokenAuthenticate,
  createTwoNotesInitial,
  INITIAL_NOTES,
  createUserInitial,
  firstNote
}
