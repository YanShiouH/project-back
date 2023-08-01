import { StatusCodes } from 'http-status-codes'

/**
 *檢查請求的Content-type格式
 *@param {string} type Content-type
 *@return express middleware function
 */

export default (type) => {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: ''
      })
      return
    }
    next()
  }
}
