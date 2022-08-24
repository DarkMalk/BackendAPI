const { Router } = require('express')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Errors = require('../helper/Errors.js')
const loginRouter = Router()

loginRouter.post('/', async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return next(Errors.MissingEmailAndPasswordLogin)
  const user = await User.findOne({ email })

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) return next(Errors.IncorrectEmailOrPassword)

  const userForToken = { id: user._id, email: user.email }
  const token = jwt.sign(userForToken, process.env.PASSJWT, { expiresIn: 60 * 60 * 24 * 7 })

  res.json({ email: user.email, username: user.username, token })
})

module.exports = loginRouter
