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
import AnimatedText from "../AnimatedText"
import { Transcription } from "~/types/Transcription"



const JokeEngine = () => {
  const [searchValue, setSearchValue] = useState('')
  const [jokes, setJokes] = useState<Joke[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [transcription, setTranscription] = useState<Transcription>()
  const [aiShortenedText, setAiShortenedText] = useState('')


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
    setIsLoading(true)
    const transcription = await transcriptionService(audioBlob)
    console.log("Transcription: ", transcription)
    setTranscription(transcription)
    aiService(transcription).then((data) => {
      if (data) {
        getSearchedJoke(data)
      }
      setAiShortenedText(data ?? '')
    })
    setAudioBlob(null)
    setIsLoading(false)
  }

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search for dad jokes..."
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

      {
        jokes && jokes.length > 0 && (
          <div className="my-4">
            <h2 className="text-color-3">Search Results:</h2>
            <Jokes jokes={jokes} />
          </div>
        )
      }


      {audioBlob && !isLoading && (
        <div className='w-full sm:max-w-32'>
          <button onClick={handleUpload} className="btn-general">Upload</button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center">
          <AnimatedText text="Uploading..." />
        </div>
      )}

      <div className="flex w-full justify-between">
        {transcription && (
          <div className="mt-4">
            <h2 className="text-color-3">Transcription:</h2>
            <p className="text-color-4">{transcription.text}</p>
          </div>
        )}

        {aiShortenedText && (
          <div className="mt-4">
            <h2 className="text-color-3">AI Suggested Search value:</h2>
            <p className="text-color-4">{aiShortenedText}</p>
          </div>
        )}

      </div>


    </div>
  )
}

export default JokeEngine;