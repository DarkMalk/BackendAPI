import mongoose from 'mongoose'
const { Schema, model } = mongoose

const noteSchema = new Schema({
  title: { type: String, required: true }, // -> propiedad unique: true (arroja error si hay otro dato igual)
  content: { type: String, required: true },
  date: { type: String, default: new Date().toLocaleDateString() },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

noteSchema.set('toJSON', {
  transform: (doc, retDoc) => {
    retDoc.id = retDoc._id
    delete retDoc._id
    delete retDoc.__v
  }
})

const Note = model('Note', noteSchema)

export default Note
