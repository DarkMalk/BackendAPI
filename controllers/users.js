const { Router } = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User.js')
const { Errors } = require('../helper/helpers.js')
const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    title: 1,
    _id: 1,
    date: 1
  })
  res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) return next(Errors.RequiredEmailUsernameAndPassword)
  // return 
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ email, username, passwordHash })
  user
    .save()
    .then(note => res.status(201).json(note))
    .catch(err => next(err))
})

module.exports = usersRouter
