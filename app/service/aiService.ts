import OpenAI from 'openai'

export const aiService = async (transcription: string) => {
  if (!transcription) return

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  try {
    const transcriptionText = typeof transcription === 'object'
      ? JSON.stringify(transcription)
      : String(transcription)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You will be given a string of text, which is a transcript of a recording voice input. Your should take the string of text, and based on the text return A SINGLE WORD, no spaces or anything, just a single word, which is the most relevant for the string of text you are given. This single word that you find most relevant should be returned, with no other symbols just that single word. It will be used for a joke api which from that single word will find a relevant joke"
        },
        {
          role: "user",
          content: transcriptionText
        }
      ]
    })

    return completion.choices[0].message.content
  } catch (error: any) {
    if (error.response) {
      console.error('Error details:', error.response.data)
    }
    throw error
  }
}