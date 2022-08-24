const { api, createUserInitial, INITIAL_USER } = require('./helpers.js')
const { server } = require('../index.js')
const User = require('../models/User.js')
const mongoose = require('mongoose')

beforeEach(async () => {
  await User.deleteMany({})
  await createUserInitial()
})

describe('POST /api/users', () => {
  test('Create new user valid', async () => {
    const res = await api
      .post('/api/users')
      .send({ email: 'newuser@hotmail.com', username: 'newUser', password: 'newuser123' })
      .expect(201)
    const keys = Object.keys(res.body)
    expect(keys).toEqual(['email', 'username', 'notes', 'id'])
  })
  test('Create new user invalid without passing required parameters', async () => {
    const res = await api
      .post('/api/users')
      .send({ email: 'hello@gmail.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'username, email and password is required' })
  })
  test('Create new user with email in use', async () => {
    const res = await api
      .post('/api/users')
      .send({ email: INITIAL_USER.email, username: 'newUser123', password: 'newuser' })
      .expect(409)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Email in use' })
  })
  test('Create new user with username in use', async () => {
    const res = await api
      .post('/api/users')
      .send({ email: 'newuser123@hotmail.com', username: INITIAL_USER.username, password: 'newuser' })
      .expect(409)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Username in use' })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  server.close()
})
