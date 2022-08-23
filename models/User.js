const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdDate: { type: String, default: new Date().toLocaleDateString() },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
})

userSchema.set('toJSON', {
  transform: (doc, retDoc) => {
    retDoc.id = retDoc._id
    delete retDoc._id
    delete retDoc.__v
    delete retDoc.passwordHash
    delete retDoc.createdDate
  }
})

const User = model('User', userSchema)

module.exports = User
