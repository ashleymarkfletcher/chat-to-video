"use client"

import Image from "next/image"
import styles from "./page.module.css"
import { useState } from "react"

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(null)

  const getVideo = async (formData) => {
    const response = await fetch("/api", {
      method: "POST",
      body: formData
    })

    if (response.status !== 200) {
      throw new Error(`prediction failed: ${response.status}`)
    }

    const prediction = await response.json()
    let videoResponse = JSON.parse(prediction)

    return videoResponse
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = await getVideo(formData)

    console.log("final video data", data)
    const { videoUrl } = data

    setVideoUrl(videoUrl)
  }

  return (
    <main className={styles.main}>
      <video autoPlay muted loop className={styles.videoBg}>
        <source src="dimiShort.mp4" type="video/mp4" />
      </video>
      {/* <button onClick={click}> SEND </button> */}

      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h1 className={styles.header}>A Limerick from Dimi</h1>
          <form onSubmit={onSubmit} className={styles.form}>
            <label htmlFor="name">First name: </label>
            <input type="text" name="name" />
            <br />
            <br />
            <label htmlFor="description">Description: </label>
            <input type="text" name="description" />
            <br />
            <br />
            <button type="submit">Submit</button>
          </form>

          {videoUrl && (
            <video className={styles.video} width="1024" controls>
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </main>
  )
}
