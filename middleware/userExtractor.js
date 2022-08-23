const jwt = require('jsonwebtoken')
require('dotenv').config()

const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1]
  }
  let decodedToken = null
  try {
    decodedToken = jwt.verify(token, process.env.PASSJWT)
  } catch (error) {
    return next(error)
  }
  const { id: user } = decodedToken
  req.body.user = user
  next()
}

module.exports = userExtractor