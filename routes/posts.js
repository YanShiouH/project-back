import express from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'
import contentType from '../middlewares/contentType.js'
import { create, get, getId, addComment, getComment } from '../controllers/posts.js'

const router = express.Router()

router.post('/', auth.jwt, contentType('multipart/form-data'), upload, create)
// router.get('/all', auth.jwt, admin, getAll)
router.get('/', get)
router.get('/:id', getId)
router.get('/:id/1', getComment)
router.post('/:id', auth.jwt, contentType('multipart/form-data'), upload, addComment)

// router.patch('/:id', auth.jwt, admin, contentType('multipart/form-data'), upload, edit)

export default router
