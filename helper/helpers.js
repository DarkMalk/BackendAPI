const supertest = require('supertest')
const { app } = require('../index.js')

const Errors = {
  MissingTitleOrContent: new Error('title or content is missing'),
  MissingTitleAndContent: new Error('title and content is missing'),
  MissingEmailAndPasswordLogin: new Error('email and password is missing'),
  IncorrectEmailOrPassword: new Error('email or password is incorrect'),
  RequiredEmailUsernameAndPassword: new Error('Email, username and password is required')
}

const api = supertest(app)

module.exports = { Errors, api }
