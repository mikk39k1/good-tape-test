import { useState, useRef } from "react";
import type { MetaFunction } from "@remix-run/node";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


export const meta: MetaFunction = () => {
  return [
    { title: "Good Tape Code Test" },
    { name: "Good Tape Code Test", content: "Welcome" },
  ];
};

const Index = () => {
  const [joke, setJoke] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      recognition.stop();
      fetchJoke(speechResult);
    };

    recognition.onerror = (event: any) => {
      setError(`Error occurred in speech recognition: ${event.error}`);
      recognition.stop();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const fetchJoke = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `/api/jokes?term=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch a joke.");
        setJoke(null);
        return;
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setJoke(data.results[0].joke);
      } else if (data.joke) {
        setJoke(data.joke);
      } else {
        setJoke("No joke found.");
      }
    } catch (err) {
      console.error("Error fetching joke:", err);
      setError("An unexpected error occurred while fetching the joke.");
      setJoke(null);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-[3rem]">Voice-Activated Dad Joke Search Engine</h1>
      <div className="w- flex items-center justify-between">
        {!isRecording ? (
          <button onClick={startRecording}>
            <CiMicrophoneOn size={36} />
          </button>
        ) : (
          <button onClick={stopRecording}>
            <CiMicrophoneOff size={36} />
          </button>
        )}
      </div>
      <div>
        {transcript && (
          <h2 className="text-[2rem]">Transcript:</h2>
        )}
        <p>{isRecording ? "Listening..." : transcript}</p>
        {error && <p>{error}</p>}
        <h2 className="text-[2rem]">Joke:</h2>
        {joke && <p>{joke}</p>}
      </div>
    </div>
  );
};

export default Index;