import { server } from '../index.js'
import mongoose from 'mongoose'
import Note from '../models/Note.js'
import User from '../models/User.js'
import { INITIAL_NOTES, deleteAndCreateNoteTest, firstNoteTest, api, createUserTest } from '../helper/helpers.js'

beforeEach(async () => {
  await deleteAndCreateNoteTest()
})

// TESTS

describe('GET /api/notes', () => {
  test('Notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There is at least two notes in the database', async () => {
    const res = await api.get('/api/notes')
    expect(res.body.length).toBeGreaterThanOrEqual(INITIAL_NOTES.length)
  })

  test('Notes must contain an id, title, content and date', async () => {
    const res = await api.get('/api/notes')
    const keysNote = Object.keys(res.body[0])
    expect(keysNote).toContain('id')
    expect(keysNote).toContain('title')
    expect(keysNote).toContain('content')
    expect(keysNote).toContain('date')
  })

  test('A note must contain in its title "note 1" and in its content "content of note 1"', async () => {
    const res = await api.get('/api/notes')
    const contents = res.body.map(item => item.content)
    const titles = res.body.map(item => item.title)

    expect(titles).toContain('note 1')
    expect(contents).toContain('content of note 1')
  })
})

describe('POST /api/notes', () => {
  test('Create a valid note', async () => {
    const { id } = await createUserTest()
    const title = 'new note valid'
    const content = 'content of note valid'
    const userId = id

    const matchObject = { title, content, user: userId }

    const res = await api
      .post('/api/notes')
      .send({ title, content, user: userId })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toMatchObject(matchObject)
  })

  test('Create a invalid note without userId', async () => {
    const res = await api
      .post('/api/notes')
      .send({ title: 'invalid note', content: 'content of note invalid' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Id from user is required' })
  })

  test('Create a invalid note', async () => {
    const res = await api
      .post('/api/notes')
      .send({ content: 'invalid note' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'title and content is required' })
  })
})

describe('DELETE /api/notes/:id', () => {
  test('Delete a note with id correct', async () => {
    const note = await firstNoteTest()
    await api.delete(`/api/notes/${note.id}`).expect(204)
  })
  test('Delete a note with id incorrect', async () => {
    const id = 'IncorrectIdNote'
    const res = await api.delete(`/api/notes/${id}`).expect(404)
    expect(res.body).toEqual({ error: `Note not exist with the id: ${id}` })
  })
})

describe('PUT /api/notes/:id', () => {
  test('Update a note with id correct', async () => {
    const note = await firstNoteTest()

    const title = 'title updated'
    const content = 'content updated'

    const matchObject = { title, content }

    const res = await api
      .put(`/api/notes/${note.id}`)
      .send({ title, content })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toMatchObject(matchObject)
  })

  test('Update a note with id incorrect', async () => {
    const id = 'IncorrectIdNote'
    const res = await api
      .put(`/api/notes/${id}`)
      .expect(404)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: `Note not exist with the id: ${id}` })
  })

  test('Update a note with an only parameter', async () => {
    const noteOriginal = await firstNoteTest()
    const { id } = noteOriginal
    const title = 'TITLE UPDATED'
    const res = await api.put(`/api/notes/${id}`).send({ title }).expect(200)

    expect(res.body).toMatchObject({ title, content: noteOriginal.content })
  })
})

afterAll(async () => {
  server.close()
  await Note.deleteMany({})
  await User.deleteMany({})
  mongoose.connection.close()
})
