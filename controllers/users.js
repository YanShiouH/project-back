import { StatusCodes } from 'http-status-codes'
import users from '../models/users.js'
import { getMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import culture from '../models/culture.js'

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
      message: '伺服器端發生未知或無法處理的錯誤'
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
      message: '伺服器端發生未知或無法處理的錯誤'
    })
  }
}
export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.cart
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器端發生未知或無法處理的錯誤'
    })
  }
}
export const editLike = async (req, res) => {
  try {
    const articleId = req.body.culture
    const article = await culture.findById(articleId)

    // Ensure that likedArticles is initialized if not present
    if (!req.user.profile) {
      req.user.profile = [] // Initialize the profile array if it doesn't exist
    }
    if (!req.user.profile.length) {
      req.user.profile.push({ likedArticles: [] }) // Initialize the profile array with an object if it's empty
    }
    // if (!req.user.profile[0].likedArticles) {
    //   req.user.profile[0].likedArticles = []
    // }

    // Find the index of the liked article in the user's profile
    const likedArticleIndex = req.user.profile[0].likedArticles.findIndex(item => item.toString() === articleId)
    const idxForUser = article.likes.findIndex(
      item => item.toString() === req.user._id
    )

    if (likedArticleIndex > -1) {
      // If the article is already liked, remove it from the user's liked articles
      req.user.profile[0].likedArticles.splice(likedArticleIndex, 1)
      article.likes.splice(idxForUser, 1)
    } else {
      // If the article is not yet liked, add it to the user's liked articles
      req.user.profile[0].likedArticles.push(articleId)
      article.likes.push(
        req.user._id
      )
    }

    // Save the user's profile
    const result = await req.user.save()
    await article.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.profile
    })
  } catch (error) {
    console.log(error)
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
