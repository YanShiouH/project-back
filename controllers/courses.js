import courses from '../models/courses.js'
import { StatusCodes } from 'http-status-codes'
import { getMessageFromValidationError } from '../utils/error.js'

export const create = async (req, res) => {
  try {
    const result = await courses.create({
      description: req.body.description,
      content: req.body.content,
      topic: req.body.topic,
      lessonNo: req.body.lessonNo,
      publish: req.body.publish
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
    let result = courses
      .find({
        $or: [
          { topic: new RegExp(req.query.search, 'i') },
          { lessonNo: req.query.search },
          { description: new RegExp(req.query.search, 'i') },
          { content: new RegExp(req.query.search, 'i') }
        ]
      })
      .sort({ [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 })
    if (req.query.itemsPerPage > -1) {
      result = result
        .skip((req.query.page - 1) * req.query.itemsPerPage)
        .limit(req.query.itemsPerPage)
    }
    result = await result
    const count = await courses.estimatedDocumentCount()
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
      message: 'The server has encountered a situation it does not know how to handle'
    })
  }
}

export const get = async (req, res) => {
  try {
    const result = await courses.find({ publish: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'The server has encountered a situation it does not know how to handle'
    })
  }
}

export const getId = async (req, res) => {
  try {
    const result = await courses.findById(req.params.id)
    if (!result) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
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

export const edit = async (req, res) => {
  try {
    const result = await courses.findByIdAndUpdate(req.params.id, {
      description: req.body.description,
      content: req.body.content,
      topic: req.body.topic,
      lessonNo: req.body.lessonNo,
      publish: req.body.publish
    }, { new: true, runValidators: true })
    if (!result) {
      throw new Error('NOT FOUND')
    }
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
