export default async function transcribeText(audioBlob: Blob, transcriptionId: string): Promise<any> {
    const url = "/api/transcribe"; 
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    
    // Replace with your public callback URL
    // If running locally, consider using ngrok to expose your local server
    formData.append("callbackUrl", "https://your-public-domain.com/api/transcription-callback");
    formData.append("languageCode", "en");
    formData.append("transcriptionId", transcriptionId);
  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Transcription Data:", data);
      return data;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw error;
    }
  }