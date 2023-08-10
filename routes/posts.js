import express from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import contentType from '../middlewares/contentType.js'
import { create, get, getId, addComment } from '../controllers/posts.js'

const router = express.Router()

router.post('/', auth.jwt, contentType('multipart/form-data'), upload, create)
router.get('/', get)
router.get('/:id', getId)
router.post('/:id', auth.jwt, contentType('multipart/form-data'), upload, addComment)

export default router
