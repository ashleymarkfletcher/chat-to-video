export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const fileToBase64 = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(imageFile)
    reader.onload = () => {
      const base64Img = reader.result

      resolve(base64Img)
    }
    reader.onerror = () => {
      console.error("Error uploading image")
      reject()
    }
  })
}

export const streamToBase64 = (stream) => {
  const concat = require("concat-stream")
  const { Base64Encode } = require("base64-stream")

  return new Promise((resolve, reject) => {
    const base64 = new Base64Encode()

    const cbConcat = (base64) => {
      resolve(base64)
    }

    stream
      .pipe(base64)
      .pipe(concat(cbConcat))
      .on("error", (error) => {
        reject(error)
      })
  })
}
