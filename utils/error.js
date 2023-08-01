/**
 * 從Mongoose的ValidationError取第一個驗證錯誤訊息
 * @param error Mongoose ValidationError變數
 * @returns 錯誤訊息
 */
export const getMessageFromValidationError = (error) => {
  const key = Object.keys(error.errors)[0]
  return error.errors[key].message
}
