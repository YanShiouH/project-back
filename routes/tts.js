import express from 'express'
import { getTTSFile } from '../controllers/tts.js'

const router = express.Router()

router.get('/:text', getTTSFile)

export default router
