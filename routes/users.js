import express from 'express'
import contentType from '../middlewares/contentType.js'
import { create, login, logout, extend, getProfile, editLike, mark, resetPassword, uploadImage } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = express.Router()

router.post('/', contentType('application/json'), create)
router.post('/login', contentType('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getProfile)
router.post('/like', contentType('application/json'), auth.jwt, editLike)
router.patch('/currentLesson', auth.jwt, mark)
router.patch('/reset', contentType('application/json'), auth.jwt, resetPassword)
router.patch('/image', auth.jwt, contentType('multipart/form-data'), upload, uploadImage)
export default router
