import { ElevenLabsClient } from "elevenlabs"
import { createWriteStream } from "fs"
import { streamToBase64 } from "./helpers"
import { v4 as uuid } from "uuid"

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY
})

export const createAudioFileFromText = async (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const audio = await client.generate({
        voice: "Rachel",
        model_id: "eleven_turbo_v2_5",
        text
      })
      const fileName = `${uuid()}.mp3`
      const fileStream = createWriteStream(fileName)

      audio.pipe(fileStream)
      fileStream.on("finish", () => resolve(fileName)) // Resolve with the fileName
      fileStream.on("error", reject)
    } catch (error) {
      reject(error)
    }
  })
}

export const createAudioBase64FromText = async (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const audio = await client.generate({
        voice: "Rachel",
        model_id: "eleven_turbo_v2_5",
        text
      })
      const fileName = `${uuid()}.mp3`
      const fileStream = createWriteStream(fileName)

      const base64Audio = await streamToBase64(audio)

      resolve(base64Audio)
    } catch (error) {
      reject(error)
    }
  })
}
