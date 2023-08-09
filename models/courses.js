import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  content: [{
    type: String,
    required: [true, 'Content is required']
  }],
  topic: {
    type: String,
    required: [true, 'Topic is required']
  },
  description: {
    type: String
  },
  lessonNo: {
    type: String,
    required: [true, 'Lesson Number is required']
  },
  publish: {
    type: Boolean,
    required: [true, 'Publish status is require']
  }
}, { versionKey: false })

export default mongoose.model('courses', schema)
