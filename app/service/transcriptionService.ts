import axios from 'axios'

export const transcriptionService = async (audioBlob: Blob) => {
  if (!audioBlob) return

  const GOOD_TAPE_API_URL = '/api/transcribe/sync'
    const GOOD_TAPE_API_KEY = process.env.REACT_APP_GOOD_TA

  const headers = {
    Authorization: GOOD_TAPE_API_KEY,
    'Content-Type': 'multipart/form-data'
  }

  const formData = new FormData()

  formData.append('audio', audioBlob)
  formData.append('languageCode', 'en')

  try {
    const response = await axios.post(GOOD_TAPE_API_URL, formData, { headers })
    return response.data
  } catch (err) {
    console.error('Error uploading audio:', err)
  }
}