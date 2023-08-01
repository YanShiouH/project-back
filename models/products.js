import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少']
  },
  price: {
    type: Number,
    required: [true, '缺少'],
    min: [0, '價格太低']
  },
  image: {
    type: String,
    required: [true, '缺少']
  },
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  category: {
    type: String,
    required: [true, '缺少'],
    enum: {
      values: ['衣服', '食品', '3C', '遊戲'],
      message: '分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    required: [true, '缺少']
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
