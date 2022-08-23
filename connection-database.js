const mongoose = require('mongoose')
require('dotenv').config()

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
