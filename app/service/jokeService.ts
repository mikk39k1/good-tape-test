import axios from 'axios'

export const jokeService = async (searchTerm: string) => {
  if (!searchTerm) return

  const DAD_JOKE_API_URL = `https://icanhazdadjoke.com/search?term=${searchTerm}`

  try {
    const response = await axios.get(DAD_JOKE_API_URL, {
      headers: { Accept: 'application/json' }
    })

    return response.data
  } catch (error) {
    console.error('Error occurred when fetching dad joke data:', error)
  }
}