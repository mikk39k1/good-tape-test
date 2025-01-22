import { useEffect, useState, useRef } from 'react'

type RecorderState = {
  isRecording: boolean
  audioBlob: Blob | null
  error: Error | null
  loading: boolean
}

type MediaRecorderConfig = {
  mimeType: string
  filename: string
}

export const useRecorder = (config: MediaRecorderConfig = {
  mimeType: 'audio/mp4',
  filename: 'audio.mp4'
}) => {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    audioBlob: null,
    error: null,
    loading: false
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    audioChunksRef.current = []
  };

  useEffect(() => {
    return cleanup
  }, []);

  const setupMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: config.mimeType
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: config.mimeType
      })
      const file = new File([audioBlob], config.filename, {
        type: config.mimeType
      })

      setState(prev => ({
        ...prev,
        audioBlob: file,
        loading: false
      }))

      cleanup()
    };

    mediaRecorder.onerror = () => {
      setState(prev => ({
        ...prev,
        error: new Error('Recording failed'),
        isRecording: false,
        loading: false
      }))
    };

    return mediaRecorder
  };

  const startRecording = async () => {
    setState(prev => ({
      ...prev,
      error: null,
      audioBlob: null,
      loading: true
    }));
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream

      const mediaRecorder = setupMediaRecorder(stream);
      mediaRecorder.start();
      recorderRef.current = mediaRecorder

      setState(prev => ({
        ...prev,
        isRecording: true
      }));
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        loading: false
      }));
    };
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      setState(prev => ({
        ...prev,
        isRecording: false
      }));
    }
    cleanup()
  };

  const hasRecordingSupport = !!navigator.mediaDevices && !!window.MediaRecorder

  return {
    isRecording: state.isRecording,
    loading: state.loading,
    error: state.error,
    hasRecordingSupport,
    audioBlob: state.audioBlob,
    startRecording,
    stopRecording
  }
}