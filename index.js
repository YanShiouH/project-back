import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import routeUsers from './routes/users.js'
import routeCulture from './routes/culture.js'
import routeOrders from './routes/orders.js'
import routePosts from './routes/posts.js'
import routeAdmin from './routes/admin.js'
import './passport/passport.js'

const app = express()

// app.use(rateLimit({
//   設定一個IP在15分鐘內最多100次請求
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   設定回應headers
//   standardHeaders: true,
//   legacyHeaders: false,
//   超出流量時回應的狀態碼
//   statusCode: StatusCodes.TOO_MANY_REQUESTS,
//   超出流量時回應的訊息
//   message: '用戶在給定的時間內發送了過多的請求',
//   超出流量時回應的function
//   handler: (req, res, next, options) => {
//     res.status(options.statusCode).json({
//       success: false,
//       message: options.message
//     })
//   }
// }))

app.use(cors({
  // origin=請求來源
  // callback=是否允許請求
  origin(origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '用戶端並無訪問權限，所以伺服器拒絕給予應有的回應'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '伺服器因為收到無效語法，而無法理解請求'
  })
})

app.use(mongoSanitize())

app.use('/users', routeUsers)
app.use('/culture', routeCulture)
app.use('/orders', routeOrders)
app.use('/discussion', routePosts)
app.use('/admin', routeAdmin)

app.all('*', (req, res) => {
  console.log(req)
  console.log(res)
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '伺服器找不到請求的資源'
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  mongoose.set('sanitizeFilter', true)
  console.log('資料庫連線成功')
})
