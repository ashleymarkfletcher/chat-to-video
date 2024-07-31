"use client"

import Image from "next/image"
import styles from "./page.module.css"

export default function Home() {
  const getVideo = async (inputData) => {
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify(inputData),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.status !== 200) {
      throw new Error(`prediction failed: ${response.status}`)
    }

    const _prediction = await response.json()
    let videoResponse = JSON.parse(_prediction)

    return videoResponse
  }

  const click = async () => {
    console.log("Button clicked")

    const videoResponse = await getVideo()

    console.log(videoResponse)
  }

  return (
    <main className={styles.main}>
      <button onClick={click}> SEND </button>
    </main>
  )
}
