import mongoose from 'mongoose'
import 'dotenv/config'

const { URI_DATABASE, URI_DATABASE_LOCAL, URI_DATABASE_LOCAL_TEST, NODE_ENV } = process.env

const connectionString =
  NODE_ENV === 'production' ? URI_DATABASE : NODE_ENV === 'test' ? URI_DATABASE_LOCAL_TEST : URI_DATABASE_LOCAL

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Database connected on: ${connectionString}`))
  .catch(err => console.error(err))

// Crear nota
// const note = new Note({
//   title: 'my note',
//   content: 'my note content',
//   date: new Date().toLocaleDateString()
// })

// Guardar nota
// note.save()
//   .then(() => mongoose.connection.close())
//   .catch(err => console.error(err))

// Buscar notas (MODELO)
// Note.find({})
//   .then(result => {
//     console.log(result)
//     return mongoose.connection.close()
//   })
//   .catch(err => console.error(err))
