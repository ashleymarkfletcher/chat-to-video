import { base64toBuffer, sleep } from "../_lib/helpers"
import {
  createAudioBase64FromText,
  createAudioFileFromText
} from "../_lib/textToSpeech"
import { getLipSync, makeLipSync } from "../_lib/lipSync"

import { Blob } from "buffer"
import { ElevenLabsClient } from "elevenlabs"
import OpenAI from "openai"
import { put } from "@vercel/blob"

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] // This is the default and can be omitted
})

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY // Defaults to process.env.ELEVENLABS_API_KEY
})

export async function POST(request) {
  console.log("post request")
  const formData = await request.formData()
  const name = formData.get("name")
  const description = formData.get("description")

  // chatgpt
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Respond with a short funny limerick about ${name}. This is a description of them: ${description}`
      }
    ],
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

  console.log("creating audio")

  const audioBase64 = await createAudioBase64FromText(text)
  console.log("audioBase64", audioBase64)
  //   console.log(audio)

  console.log("audio blob to buffer")

  const audioBlob = new Blob([base64toBuffer(audioBase64)])

  console.log("storing audio blob")

  const { url } = await put("test.mp3", audioBlob, {
    access: "public"
  })
  //synclabs
  console.log("audio file:", url)

  //   const string64 = `data:audio/mpeg;base64,${audioBase64}`

  console.log("making lip sync:", url)

  const videoRespone = await makeLipSync(
    url,
    "https://lk8gussgku7l2lhf.public.blob.vercel-storage.com/dimiShort.mp4"
  )
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

  return Response.json(JSON.stringify({ videoUrl }))
}
