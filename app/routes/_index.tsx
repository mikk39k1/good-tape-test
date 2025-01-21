import { useState, useRef } from "react";
import type { MetaFunction } from "@remix-run/node";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";
import fetchJoke from "~/utils/fetchJoke";
import JokeEngine from "~/components/JokeEngine";


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


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-[3rem]">Voice-Activated Dad Joke Search Engine</h1>
      <div className="w-flex items-center justify-between">
          <JokeEngine />
      </div>
    </div>
  );
};

export default Index;