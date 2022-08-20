import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import notFound from './middleware/notFound.js'
import usersRouter from './controllers/users.js'
import notesRouter from './controllers/notes.js'

// Database and models
import './connection-database.js'

// Application
const app = express()

// MiddleWares
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Routes of server

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// MiddleWares
app.use(notFound)

// Server listen and message
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server listen on port: ${PORT}`))

export { app, server }
