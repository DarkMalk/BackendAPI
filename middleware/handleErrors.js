const handleErrors = (error, req, res, next) => {
  // Errors token authorization
  if (error.name === 'JsonWebTokenError' && error.message === 'invalid signature')
    return res.status(401).json({ error: 'Token is invalid' })
  if (error.name === 'JsonWebTokenError' && error.message === 'jwt must be provided')
    return res.status(401).json({ error: 'Token is missing' })
  if (error.name === 'TokenExpirerError') return res.status(401).json({ error: 'Token expired' })

  // Errors /api/notes
  if (
    error.name === 'CastError' &&
    /Cast to ObjectId failed for value || at path "_id" for model "Note"/.test(error.message)
  ) {
    const id = error.message.split('"')[1]
    return res.status(404).json({ error: `Note not found with id: ${id}` })
  }
  if (error.message === 'title or content is missing')
    return res.status(400).json({ error: 'title and content is required' })
  if (error.message === 'title and content is missing')
    return res.status(400).json({ error: 'At least one parameter is required' })

  // Errors /api/users
  if (/email_1 dup key/.test(error.message)) return res.status(409).json({ error: 'Email in use' })
  if (/username_1 dup key/.test(error.message)) return res.status(409).json({ error: 'Username in use' })
  if (error.message === 'email and password is missing')
    return res.status(400).json({ error: 'Email and password is required' })
  if (error.message === 'email or password is incorrect')
    return res.status(400).json({ error: 'Email or password incorrect' })
  if (error.message === 'Email, username and password is required')
    return res.status(400).json({ error: 'username, email and password is required' })

  // Error default
  else {
    console.log(`ERROR NAME: ${error.name}\nERROR MESSAGE: ${error.message}`)
    return res.status(500).json({ error: 'An error has ocurred!' })
  }
}

module.exports = handleErrors
