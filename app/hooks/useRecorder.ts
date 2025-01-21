import { useEffect, useState, useRef } from 'react'

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      stopRecording()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    setError(false)
    setAudioBlob(null)
    audioChunksRef.current = [] // Reset chunks

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/mp4'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/mp4'
        })
        const file = new File([audioBlob], "audio.mp4", {
          type: 'audio/mp4'
        })

        setAudioBlob(file)
        setLoading(false)

        // Clean up
        stream.getTracks().forEach(track => track.stop())
        audioChunksRef.current = []
      }

      mediaRecorder.onerror = () => {
        setError(true)
        setIsRecording(false)
        setLoading(false)
      }

      mediaRecorder.start()
      recorderRef.current = mediaRecorder
      setIsRecording(true)
      setLoading(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError(true)
      setLoading(false)
    }
  }

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop()
      setIsRecording(false)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  return {
    isRecording,
    loading,
    error,
    hasRecordingSupport: !!navigator.mediaDevices && !!window.MediaRecorder,
    audioBlob,
    setAudioBlob,
    startRecording,
    stopRecording
  }
}