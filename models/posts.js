import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  account: {
    type: String
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [{
    user: {
      type: mongoose.ObjectId,
      ref: 'users'
    },
    account: {
      type: String
    },
    content: {
      type: String,
      required: [true, 'Comment is required']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected'],
    default: 'Pending Approval'
  }
}, { versionKey: false })

export default mongoose.model('posts', schema)
