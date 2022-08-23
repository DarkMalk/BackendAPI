const express = require('express')
const cors = require('cors')
const notFound = require('./middleware/notFound.js')
const usersRouter = require('./controllers/users.js')
const notesRouter = require('./controllers/notes.js')
const loginRouter = require('./controllers/login.js')
const handleErrors = require('./middleware/handleErrors.js')
require('dotenv').config()

// Database and models
require('./connection-database.js')

// Application
const app = express()

// MiddleWares
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Routes of server

app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// MiddleWares
app.use(handleErrors)
app.use(notFound)

// Server listen and message
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server listen on port: ${PORT}`))

module.exports = { app, server }
