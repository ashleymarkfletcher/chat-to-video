export const maxDuration = 300 // This function can run for a maximum of 5 seconds

import { base64toBuffer, sleep } from "../../_lib/helpers"
import {
  createAudioBase64FromText,
  createAudioFileFromText
} from "../../_lib/textToSpeech"
import { getLipSync, makeLipSync } from "../../_lib/lipSync"

import { Blob } from "buffer"
import { ElevenLabsClient } from "elevenlabs"
import OpenAI from "openai"
import { unstable_after as after } from "next/server"
import { put } from "@vercel/blob"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is the default and can be omitted
})

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY // Defaults to process.env.ELEVENLABS_API_KEY
})

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

const generateVideo = async (
  conversationId,
  firstName,
  achievement,
  department
) => {
  // chatgpt
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `you are the boss of a company called Dept, give me a nice message about ${firstName} who works in the department: ${department}. Their recent achievement is: ${achievement}. Respond with a few sentences in plain text, don't respond in the format of a letter or email`
      }
    ],
    model: "gpt-4-turbo"
  })
  console.log("chatCompletion", chatCompletion)

  const text = chatCompletion.choices[0].message.content

  console.log("text: ", text)

  console.log("creating audio")

  const audioBase64 = await createAudioBase64FromText(text)
  // console.log("audioBase64", audioBase64)

  console.log("audio blob to buffer")

  const audioBlob = new Blob([base64toBuffer(audioBase64)])

  console.log("storing audio blob")

  // store audio for later
  const { url } = await put("test.mp3", audioBlob, {
    access: "public",
    addRandomSuffix: true
  })

  // synclabs
  console.log("audio file:", url)

  // const string64 = `data:audio/mpeg;base64,${audioBase64}`

  console.log("making lip sync:", url)

  const videoRespone = await makeLipSync(
    url,
    "https://lk8gussgku7l2lhf.public.blob.vercel-storage.com/dimiShort.mp4"
  )
  console.log("videoRespone", videoRespone)

  // const lipSyncId = videoRespone.id
  // let videoUrl = null

  // let timeProcessing = 0

  // while (!videoUrl) {
  //   await sleep(1000)
  //   timeProcessing++
  //   const lipsyncStatus = await getLipSync(lipSyncId)

  //   videoUrl = lipsyncStatus.videoUrl
  //   console.log(lipsyncStatus, videoUrl)

  //   if (lipsyncStatus.status === "FAILED") {
  //     throw lipsyncStatus.errorMessage
  //     break
  //   }

  //   if (timeProcessing > 300) {
  //     throw "Timeout creating"
  //     break
  //   }
  // }

  // console.log("video made!", videoUrl)

  // const resumeBotDataResponse = await fetch(process.env.BOTPRESS_WEBHOOK_URL, {
  //   method: "POST",
  //   headers: {
  //     "x-bp-secret": process.env.BOTPRESS_WEBHOOK_SECRET,
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({ conversationId, videoUrl })
  // })
  // // const b = await resumeBotDataResponse.json()

  // console.log("b", resumeBotDataResponse)
  return
}

export async function POST(request) {
  console.log("post request")
  //   const formData = await request.formData()
  //   const name = formData.get("name")
  //   const description = formData.get("description")

  const data = await request.json()

  const { conversationId, userId, botId, name, achievement, department } = data
  const { first, last } = name

  // console.log(name, nodeId, userId, botId)

  const description = "a boy who likes cake"

  console.log("data", data)

  // Go back to the bot straight away, we'll webhook back when video ready
  after(async () => {
    await generateVideo(conversationId, first, achievement, department)
  })

  return Response.json({})

  // return Response.json(JSON.stringify(videoUrl))

  // return Response.json({})
}
