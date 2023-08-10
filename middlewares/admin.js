import UserRole from '../enums/UserRole.js'
import { StatusCodes } from 'http-status-codes'

export default (req, res, next) => {
  if (req.user.role === UserRole.USER) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'No permission'
    })
  } else {
    next()
  }
}
