import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})


usersRouter.post('/', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email and password is required' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ email, username, passwordHash })
  user
    .save()
    .then(note => res.status(201).json(note))
    .catch(err => {
      if (/email_1 dup key/.test(err.message)) return res.status(409).json({ error: 'Email in use' })
      if (/username_1 dup key/.test(err.message)) return res.status(409).json({ error: 'Username in use' })
      console.error(err)
    })
})

export default usersRouter
