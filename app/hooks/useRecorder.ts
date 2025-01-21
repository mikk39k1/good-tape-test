import { useEffect, useState, useRef } from 'react'

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      streamRef.current = stream
      
      const options = {
        mimeType: 'audio/webm'
      }
      const rec = new MediaRecorder(stream, options)
      recorderRef.current = rec

      const chunks: Blob[] = []
      rec.ondataavailable = e => chunks.push(e.data)
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: rec.mimeType })
        setAudioBlob(blob)
        // Stop all tracks after recording
        stream.getTracks().forEach(track => track.stop())
      }

      rec.onerror = () => {
        setError(true)
        setIsRecording(false)
      }

      rec.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError(true)
    }
  }

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop()
      setIsRecording(false)
    }
    
    // Ensure we stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  return {
    isRecording,
    error,
    hasRecordingSupport: !!navigator.mediaDevices && !!window.MediaRecorder,
    audioBlob,
    setAudioBlob,
    startRecording,
    stopRecording
  }
}