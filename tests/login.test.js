const { server } = require('../index.js')
const mongoose = require('mongoose')
const User = require('../models/User.js')
const { api, INITIAL_USER } = require('./helpers.js')

beforeAll(async () => {
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send({ email: INITIAL_USER.email, username: INITIAL_USER.username, password: INITIAL_USER.password })
})

describe('POST /api/login', () => {
  test('Login with user correct', async () => {
    const { email, password, username } = INITIAL_USER
    const res = await api
      .post('/api/login')
      .send({ email, password })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toMatchObject({ email, username })
  })
  test('Login with user incorrect', async () => {
    const userIncorrect = { email: 'incorrect.test@gmail.com', password: 'incorrect123' }
    const res = await api
      .post('/api/login')
      .send({ email: userIncorrect.email, password: userIncorrect.password })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Email or password incorrect' })
  })
  test('Login with one parameter', async () => {
    const { email } = INITIAL_USER
    const res = await api
      .post('/api/login')
      .send({ email })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Email and password is required' })
  })
})

afterAll(async () => {
  server.close()
  await mongoose.connection.close()
})
