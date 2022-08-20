import { server } from '../index.js'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { api, createUserTest } from '../helper/helpers.js'

const INITIAL_USER = {
  username: 'newuser',
  email: 'newuser@hotmail.com',
  password: 'hola123'
}

describe('POST /api/users', () => {
  test('Create new user', async () => {
    const { username, email } = INITIAL_USER
    const res = await api
      .post('/api/users')
      .send(INITIAL_USER)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toMatchObject({ username, email })
  })
  test('Create invalid user', async () => {
    const newUserInvalid = { username: 'testInvalid' }
    const res = await api
      .post('/api/users')
      .send(`username: ${newUserInvalid.username}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'username, email and password is required' })
  })
  test('Create user with email used', async () => {
    const { email } = INITIAL_USER
    const res = await api
      .post('/api/users')
      .send({ username: 'newUser123', email, password: 'hola123' })
      .expect(409)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Email in use' })
  })
  test('Create user with username used', async () => {
    const { username } = INITIAL_USER
    const res = await api
      .post('/api/users')
      .send({ username, email: 'newUser123@gmail.com', password: 'hola123' })
      .expect(409)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toEqual({ error: 'Username in use' })
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await createUserTest()
  mongoose.connection.close()
  server.close()
})
