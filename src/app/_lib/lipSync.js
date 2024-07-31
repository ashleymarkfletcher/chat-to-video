export const makeLipSync = async (audio) => {
  const options = {
    method: "POST",
    headers: {
      "x-api-key": process.env.SYNCLABS_API_KEY,
      "Content-Type": "application/json"
    }
  }

  const body = {
    audioUrl: audio,
    // audioUrl:
    //   "https://synchlabs-public.s3.us-west-2.amazonaws.com/david_demo_shortaud-27623a4f-edab-4c6a-8383-871b18961a4a.wav",
    videoUrl:
      "https://synchlabs-public.s3.us-west-2.amazonaws.com/david_demo_shortvid-03a10044-7741-4cfc-816a-5bccd392d1ee.mp4",
    maxCredits: 123,
    model: "sync-1.6.0",
    synergize: true,
    pads: [0, 5, 0, 0],
    synergizerStrength: 1,
    webhookUrl: "<string>"
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
