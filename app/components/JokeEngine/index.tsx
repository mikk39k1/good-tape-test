import { useState } from "react"
import { useRecorder } from "~/hooks/useRecorder"
import { Joke } from "~/types/Joke"
import { jokeService } from "~/service/jokeService"
import { transcriptionService } from "~/service/transcriptionService"
import { Input } from "../ui/input"
import Jokes from "../Jokes"
import { motion } from "framer-motion"
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci"


 const JokeEngine = () => {
  const [searchValue, setSearchValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [jokes, setJokes] = useState<Joke[]>([])

  const {
    isRecording,
    hasRecordingSupport,
    audioBlob,
    setAudioBlob,
    startRecording,
    stopRecording
  } = useRecorder()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    getSearchedJoke(searchValue)
    setKeyword(searchValue)
  }

  const getSearchedJoke = async (searchTerm: string) => {
    const data = await jokeService(searchTerm)
    setJokes(data.results)
  }

  const handleUpload = async () => {
    if (!audioBlob) return
    setIsLoading(true)

    const data = await transcriptionService(audioBlob)
    const query = data.text.replace(/[,.]/g, '')
    getSearchedJoke(query)
    setKeyword(query)
    setAudioBlob(null)
    setSearchValue('')
    setIsLoading(false)
  }

  return (
    <div className="p-4 container mx-auto">


      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        {}
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
          <button className="bg-color-3 p-4 rounded-full" onClick={startRecording} aria-label="Start Recording">
            <CiMicrophoneOn className="fill-color-1" size={36} />
          </button>
        ) : (
          <motion.button 
          className="bg-color-5 p-4 rounded-full relative" 
          onClick={stopRecording} 
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

      <Jokes jokes={jokes}/>

      

    
    </div>
  )
}

export default JokeEngine;