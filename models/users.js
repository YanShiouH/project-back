import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const profileSchema = new mongoose.Schema({
  likedArticles: [{
    type: mongoose.ObjectId,
    ref: 'culture'
  }],
  currentLesson: {
    type: mongoose.ObjectId,
    ref: 'lesson',
    default: null
  },
  postedPosts: [{
    type: mongoose.ObjectId,
    ref: 'posts'
  }]
}, { versionKey: false })

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, 'Account is required'],
    minlength: [4, 'Account should have at least 4 characters'],
    maxlength: [20, 'Account should not exceed 20 characters'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, 'Account can only contain letters and numbers']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value)
      },
      message: 'Invalid email format'
    }
  },
  tokens: {
    type: [String],
    default: []
  },
  profile: {
    type: [profileSchema],
    default: []
  },
  role: {
    type: Number,
    default: UserRole.USER
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'Password is too short' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'Password is too long' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'Password is too short' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'Password is too long' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default mongoose.model('users', schema)
