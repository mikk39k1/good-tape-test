import { useState } from "react"
import { useRecorder } from "~/hooks/useRecorder"
import { Joke } from "~/types/Joke"
import { jokeService } from "~/service/jokeService"
import { transcriptionService } from "~/service/transcriptionService"
import { Input } from "../ui/input"
import Jokes from "../Jokes"
import { motion } from "framer-motion"
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci"
import { aiService } from "~/service/aiService"


const JokeEngine = () => {
  const [searchValue, setSearchValue] = useState('')
  const [jokes, setJokes] = useState<Joke[]>([])
  const {
    isRecording,
    audioBlob,
    setAudioBlob,
    startRecording,
    stopRecording
  } = useRecorder()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    getSearchedJoke(searchValue)
  }

  const getSearchedJoke = async (searchTerm: string) => {
    const data = await jokeService(searchTerm)
    console.log('Data:', data)
    setJokes(data.results)
  }

  const handleUpload = async () => {
    if (!audioBlob) return

    const transcription = await transcriptionService(audioBlob)
    console.log('Transcription:', transcription)
    aiService(transcription).then((data) => {
      if (data) {
        getSearchedJoke(data)
      }
    })
    setAudioBlob(null)
  }

  return (
    <div className="p-4 container mx-auto">


      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        { }
        <Input
          type="text"
          placeholder="Search for dad jokes"
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value)
          }}
        />

        <button type="submit" className="btn-general">Search</button>
        {!isRecording ? (
          <button
            className="bg-color-3 p-4 rounded-full"
            onClick={startRecording}
            aria-label="Start Recording"
          >
            <CiMicrophoneOn className="fill-color-1" size={36} />
          </button>
        ) : (
          <motion.button
            className="bg-color-5 p-4 rounded-full relative"
            onClick={() => {
              stopRecording();
              // Add a small delay to ensure the audioBlob is set
              setTimeout(() => {
                handleUpload();
              }, 500);
            }}
            aria-label="Stop Recording"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <motion.div
              className="absolute inset-0 bg-color-5 rounded-full"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <CiMicrophoneOff className="fill-color-1 relative z-10" size={36} />
          </motion.button>
        )}

      </form>

      <Jokes jokes={jokes} />




    </div>
  )
}

export default JokeEngine;

function loadStripe(STRIPE_PUBLIC_KEY: any) {
  throw new Error("Function not implemented.")
}
