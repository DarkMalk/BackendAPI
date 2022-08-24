const mongoose = require('mongoose')
const { server } = require('../index.js')
const Note = require('../models/Note.js')
const User = require('../models/User.js')
const {
  api,
  tokenAuthenticate,
  INITIAL_NOTES,
  createTwoNotesInitial,
  createUserInitial,
  firstNote
} = require('./helpers.js')

beforeEach(async () => {
  await Note.deleteMany({})
  await User.deleteMany({})
  await createUserInitial()
  await createTwoNotesInitial()
})

describe('GET /api/notes', () => {
  test('The notes returned as json', async () => {
    const token = await tokenAuthenticate()
    await api
      .get('/api/notes')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('The notes must contains: ["title", "content", "date", "user", "id"]', async () => {
    const token = await tokenAuthenticate()
    const res = await api
      .get('/api/notes')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const firstNote = res.body[0]
    expect(Object.keys(firstNote)).toEqual(['title', 'content', 'date', 'user', 'id'])
  })
  test('There are at least two notes in the database', async () => {
    const token = await tokenAuthenticate()
    const res = await api
      .get('/api/notes')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })
  test('At least one note contains the title "title note 1" and content "content of note 1"', async () => {
    const { title, content } = INITIAL_NOTES[0]
    const token = await tokenAuthenticate()
    const res = await api
      .get('/api/notes')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body[0]).toMatchObject({ title, content })
  })
})

describe('POST /api/notes', () => {
  test('Create a valid note', async () => {
    const token = await tokenAuthenticate()
    const note = { title: 'new note valid', content: 'content of note valid' }
    const res = await api
      .post('/api/notes')
      .set('Authorization', `bearer ${token}`)
      .send({ title: note.title, content: note.content })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toMatchObject({ title: note.title, content: note.content })
  })

  test('Create a note invalid with one parameter', async () => {
    const token = await tokenAuthenticate()
    const res = await api
      .post('/api/notes')
      .set('Authorization', `bearer ${token}`)
      .send({ title: 'invalid note' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'title and content is required' })
  })

  test('Attempting to create a note without authorization', async () => {
    const res = await api
      .post('/api/notes')
      .send({ title: 'note without authorization', content: 'note without authorization' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Token is missing' })
  })
})

describe('PUT /api/notes/:id', () => {
  test('Update a note with id correct', async () => {
    const token = await tokenAuthenticate()
    const note = await firstNote()

    const dataUpdated = { title: 'title updated', content: 'content updated' }

    const res = await api
      .put(`/api/notes/${note.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ title: dataUpdated.title, content: dataUpdated.content })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toMatchObject({ title: dataUpdated.title, content: dataUpdated.content })
  })

  test('Update a note with id incorrect', async () => {
    const token = await tokenAuthenticate()
    const id = 'IncorrectIdNote'
    const res = await api
      .put(`/api/notes/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ title: 'hello', content: 'hello' })
      .expect(404)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: `Note not found with id: ${id}` })
  })

  test('Update a note with an only parameter', async () => {
    const token = await tokenAuthenticate()
    const noteOriginal = await firstNote()
    const { id } = noteOriginal
    const title = 'TITLE UPDATED'
    const res = await api.put(`/api/notes/${id}`).set('Authorization', `bearer ${token}`).send({ title }).expect(200)

    expect(res.body).toMatchObject({ title, content: noteOriginal.content })
  })
})

describe('DELETE /api/notes/:id', () => {
  test('Delete a note with id correct', async () => {
    const token = await tokenAuthenticate()
    const note = await firstNote()
    await api.delete(`/api/notes/${note.id}`).set('Authorization', `bearer ${token}`).expect(204)
  })
  test('Delete a note with id incorrect', async () => {
    const token = await tokenAuthenticate()
    const id = 'IncorrectIdNote'
    const res = await api.delete(`/api/notes/${id}`).set('Authorization', `bearer ${token}`).expect(404)
    expect(res.body).toEqual({ error: `Note not found with id: ${id}` })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  server.close()
})
