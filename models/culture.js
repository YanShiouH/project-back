import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  publish: {
    type: Boolean,
    required: [true, 'Publish status is require']
  },
  likes: [{
    type: mongoose.ObjectId,
    ref: 'users',
    default: []
  }]
}, { versionKey: false })

export default mongoose.model('culture', schema)
