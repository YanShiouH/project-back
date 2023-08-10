import express from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'
import contentType from '../middlewares/contentType.js'
import { getAll, edit } from '../controllers/posts.js'

const router = express.Router()

router.get('/discussion/all', auth.jwt, admin, getAll)
router.patch('/discussion/:id', auth.jwt, admin, contentType('multipart/form-data'), upload, edit)

export default router
