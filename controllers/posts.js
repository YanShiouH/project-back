import posts from '../models/posts.js'
import users from '../models/users.js'
import { StatusCodes } from 'http-status-codes'
import { getMessageFromValidationError } from '../utils/error.js'

export const create = async (req, res) => {
  try {
    const userAccount = await users.findById(req.user._id).select('account')

    const result = await posts.create({
      user: req.user._id,
      account: userAccount.account,
      title: req.body.title,
      content: req.body.content,
      date: req.body.date
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'The server has encountered a situation it does not know how to handle'
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    // .skip()跳過幾筆資料
    // .limit()回傳幾筆
    let result = posts
      .find({
        $or: [
          { title: new RegExp(req.query.search, 'i') },
          { content: new RegExp(req.query.search, 'i') }
          // { date: new RegExp(req.query.search, 'i') },
          // { publish: new RegExp(req.query.search, 'i') }
        ]
      })
      .sort({ [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 })
    if (req.query.itemsPerPage > -1) {
      result = result
        .skip((req.query.page - 1) * req.query.itemsPerPage)
        .limit(req.query.itemsPerPage)
    }
    result = await result
    const count = await posts.estimatedDocumentCount()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data: result,
        count
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'The server has encountered a situation it does not know how to handle.'
    })
  }
}

export const get = async (req, res) => {
  try {
    const result = await posts.find({ status: 'Approved' })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'The server has encountered a situation it does not know how to handle.'
    })
  }
}

export const getId = async (req, res) => {
  try {
    const result = await posts.findById(req.params.id)
    const commentResult = result.comments
    if (!result) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result,
      commentResult
    })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'The server cannot or will not process the request due to something that is perceived to be a client error'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'The server cannot find the requested resource'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'The server has encountered a situation it does not know how to handle'
      })
    }
  }
}
export const getComment = async (req, res) => {
  try {
    const result = await posts.findById(req.params.id).comments
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'The server has encountered a situation it does not know how to handle.'
    })
  }
}
export const edit = async (req, res) => {
  try {
    const result = await posts.findByIdAndUpdate(req.params.id, {
      // title: req.body.title,
      // content: req.body.content,
      // image: req.file?.path,
      status: req.body.status
    }, { new: true, runValidators: true })
    if (!result) {
      throw new Error('NOT FOUND')
    }
    if (req.body.status === 'Approved') {
      const postId = req.params.id
      const post = await posts.findById(postId).populate('user')

      if (post && post.user && post.user.profile) {
        if (!post.user.profile.length) {
          post.user.profile.push({ postedPosts: [] })
        }
        post.user.profile[0].postedPosts.push(postId)
        await post.user.save()
      }
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'The server cannot or will not process the request due to something that is perceived to be a client error'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'The server cannot find the requested resource'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'The server has encountered a situation it does not know how to handle'
      })
    }
  }
}

export const addComment = async (req, res) => {
  try {
    const post = await posts.findById(req.params.id)
    const newComment = {
      user: req.user._id,
      account: req.user.account,
      content: req.body.content,
      date: req.body.date
    }
    post.comments.push(newComment)
    const result = await post.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Comment added successfully',
      result

    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add comment',
      result: null
    })
  }
}
