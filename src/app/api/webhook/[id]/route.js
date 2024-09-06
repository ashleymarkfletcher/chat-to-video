export const maxDuration = 300 // This function can run for a maximum of 5 seconds

export async function POST(request, params) {
  console.log("post request")
  //   const formData = await request.formData()
  //   const name = formData.get("name")
  //   const description = formData.get("description")

  const conversationId = params.id
  const data = await request.json()

  const { result } = data
  //   const { first, last } = name

  console.log("webhook result: ", data, result)

  let { videoUrl } = result

  console.log("video made!", videoUrl)

  const resumeBotDataResponse = await fetch(process.env.BOTPRESS_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "x-bp-secret": process.env.BOTPRESS_WEBHOOK_SECRET,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ conversationId, videoUrl })
  })
  // const b = await resumeBotDataResponse.json()

  console.log("b", resumeBotDataResponse)

  return Response.json({})
}
