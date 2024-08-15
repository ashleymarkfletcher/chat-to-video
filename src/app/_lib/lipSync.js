export const makeLipSync = async (audio, video) => {
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
    model: "sync-1.6.0",
    synergize: true,
    pads: [0, 5, 0, 0],
    synergizerStrength: 1
    // webhookUrl: "<string>"
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
