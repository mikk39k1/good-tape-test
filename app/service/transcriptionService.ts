import axios from 'axios'

export const transcriptionService = async (audioBlob: Blob) => {
  if (!audioBlob) return

  const url = '/api/transcribe/sync'
  const GOOD_TAPE_API_KEY = import.meta.env.VITE_GOOD_TAPE_API_KEY;

  const headers = {
    Authorization: GOOD_TAPE_API_KEY,
    'Content-Type': 'multipart/form-data'
  };

  const formData = new FormData()

  formData.append('audio', audioBlob)
  formData.append('languageCode', 'en')

  try {
    const response = await axios.post(url, formData, { headers })
    return response.data
  } catch (err) {
    console.error('Error uploading audio:', err)
  }
};