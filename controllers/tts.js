import axios from 'axios'
import { StatusCodes } from 'http-status-codes'

export const getTTSFile = async (req, res) => {
  try {
    const fd = new FormData()
    fd.append('ttv_mode', 1)
    fd.append('bgMusic', undefined)
    fd.append('userID', 'guest3699410299')
    fd.append('provider', 'aws')
    fd.append('text', req.params.text)
    fd.append('voice', 'Zeina')
    fd.append('language', 'ar-XA')
    fd.append('speed', 100)
    fd.append('volume', 3)
    fd.append('usePremium', 0)
    fd.append('premium', 0)
    fd.append('voiceStyle', 'neutral')
    fd.append('isEmotion', 0)
    fd.append('vol', 0.3)
    fd.append('rand', 20)
    fd.append('isSample', 0)
    fd.append('voiceName', 'Zeina')

    const { data } = await axios.post('https://www.texttovoice.online/scripts/awsRequest2.php', fd, {
      headers: {
        Referer: 'https://www.texttovoice.online/?lang=ar-XA',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    })
    const audioResponse = await axios.get('https://www.texttovoice.online/' + data.content, { responseType: 'stream' })
    audioResponse.data.pipe(res)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Soundtrack Error'
    })
  }
}
