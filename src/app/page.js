"use client"

import Image from "next/image"
import styles from "./page.module.css"
import { useState } from "react"

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getVideo = async (formData) => {
    const response = await fetch("/api", {
      method: "POST",
      body: formData
    })

    if (response.status !== 200) {
      setError(response.status)
      setIsLoading(false)
      throw new Error(`prediction failed: ${response.status}`)
    }

    const prediction = await response.json()
    let videoResponse = JSON.parse(prediction)

    return videoResponse
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    setIsLoading(true)
    setVideoUrl(null)

    const formData = new FormData(event.target)
    const data = await getVideo(formData)

    console.log("final video data", data)
    const { videoUrl } = data

    setIsLoading(false)
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

            {!isLoading && <button type="submit">Submit</button>}
          </form>

          {isLoading && <div className={styles.loader}></div>}
          {error && <div className={styles.error}>error</div>}
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
