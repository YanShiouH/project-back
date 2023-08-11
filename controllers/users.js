import { StatusCodes } from 'http-status-codes'
import users from '../models/users.js'
import { getMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import culture from '../models/culture.js'
import courses from '../models/courses.js'
import mongoose from 'mongoose'

export const create = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'A request conflict with the current state of the target resource'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'The server has encountered a situation it does not know how to handle'
      })
    }
  }
}
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器端發生未知或無法處理的錯誤'
    })
  }
}
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器端發生未知或無法處理的錯誤'
    })
  }
}
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'The server has encountered a situation it does not know how to handle'
    })
  }
}
export const getProfile = async (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'The server has encountered a situation it does not know how to handle'
    })
  }
}
export const editLike = async (req, res) => {
  try {
    const articleId = req.body.culture
    const article = await culture.findById(articleId)

    if (!req.user.profile) {
      req.user.profile = []
    }
    if (!req.user.profile.length) {
      req.user.profile.push({ likedArticles: [] })
    }

    const likedArticleIndex = req.user.profile[0].likedArticles.findIndex(item => item.toString() === articleId)
    const idxForUser = article.likes.findIndex(
      item => item.toString() === req.user._id
    )

    if (likedArticleIndex > -1) {
      req.user.profile[0].likedArticles.splice(likedArticleIndex, 1)
      article.likes.splice(idxForUser, 1)
    } else {
      req.user.profile[0].likedArticles.push(articleId)
      article.likes.push(
        req.user._id
      )
    }

    const result = await req.user.save()
    await article.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.profile
    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Not found'
      })
    } else if (error.name === 'ValidationError') {
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
export const mark = async (req, res) => {
  try {
    const { lessonNo } = await courses.findById(req.body._id)

    if (!req.user.profile) {
      req.user.profile = []
    }
    if (!req.user.profile.length) {
      req.user.profile.push({ currentLesson: null })
    }
    req.user.profile[0].currentLesson = lessonNo
    const result = await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.profile
    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Not found'
      })
    } else if (error.name === 'ValidationError') {
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
