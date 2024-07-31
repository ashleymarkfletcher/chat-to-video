import {
  createAudioBase64FromText,
  createAudioFileFromText
} from "../_lib/textToSpeech"
import { getLipSync, makeLipSync } from "../_lib/lipSync"

import { ElevenLabsClient } from "elevenlabs"
import OpenAI from "openai"
import { sleep } from "../_lib/helpers"

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] // This is the default and can be omitted
})

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY // Defaults to process.env.ELEVENLABS_API_KEY
})

export async function POST(request) {
  console.log("post request")

  // chatgpt
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-4-turbo"
  })
  console.log("chatCompletion", chatCompletion)

  const text = chatCompletion.choices[0].message.content

  //elevenlabs
  //   const audio = await elevenlabs.generate({
  //     voice: "Rachel",
  //     text: text,
  //     model_id: "eleven_multilingual_v2",
  //     stream: false
  //   })

  const audioBase64 = await createAudioBase64FromText(text)
  console.log("audioBase64", audioBase64)

  //synclabs

  const string64 = `data:audio/mpeg;base64,${audioBase64}`

  const videoRespone = await makeLipSync(string64)
  console.log("videoRespone", videoRespone)

  const lipSyncId = videoRespone.id
  let videoUrl = null

  while (!videoUrl) {
    await sleep(1000)
    const lipsyncStatus = await getLipSync(lipSyncId)

    videoUrl = lipsyncStatus.videoUrl
    console.log(lipsyncStatus, videoUrl)
  }

  //   console.log("video made!", videoUrl)

  return Response.json(JSON.stringify(chatCompletion))
}
