
import type { MetaFunction } from "@remix-run/node";
import JokeEngine from "~/components/JokeEngine";



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