import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      if (info.message === 'Missing credentials') {
        info.message = 'Invalid Field(s) Error'
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: info.message
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid JWT'
        })
      } else {
        if (info.message === 'No auth token') {
          info.message = 'Please log in'
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message || 'Error'
        })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
