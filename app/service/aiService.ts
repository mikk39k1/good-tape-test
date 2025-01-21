import OpenAI from 'openai'

export const aiService = async (transcription: string) => {
  if (!transcription) return

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
});

const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-thinking-exp:free",
    messages: [
        { role: "system", content: "You will be given a string of text, which is a transcript of a recording voice input. Your should take the string of text, and based on the text return A SINGLE WORD, no spaces or anything, just a single word, which is the most relevant for the string of text you are given. This single word that you find most relevant should be returned, with no other symbols just that single word. It will be used for a joke api which from that single word will find a relevant joke" },
      {
        "role": "user",
        "content": `${transcription}`
      }
    ]
  })

  return completion.choices[0].message.content;
}