export const makeLipSync = async (audio, video, webhookUrl) => {
  const options = {
    method: "POST",
    headers: {
      "x-api-key": process.env.SYNCLABS_API_KEY,
      "Content-Type": "application/json"
    }
  }

  const body = {
    audioUrl: audio,
    videoUrl: video,
    maxCredits: 123,
    model: "sync-1.7.1-beta", // check if 1.7.1 works here
    synergize: true,
    pads: [0, 5, 0, 0],
    synergizerStrength: 1,
    webhookUrl
    // webhookUrl:
    //   "https://2437f42c4912621626be4abcd4449272.loophole.site/api/webhook"
  }

  options.body = JSON.stringify(body)

  const response = await fetch("https://api.synclabs.so/lipsync", options)
  const json = await response.json()
  console.log(json)

  return json
}

export const getLipSync = async (id) => {
  const options = {
    method: "GET",
    headers: { "x-api-key": process.env.SYNCLABS_API_KEY }
  }

  const response = await fetch("https://api.synclabs.so/lipsync/" + id, options)

  const json = await response.json()
  console.log(json)

  return json
}
