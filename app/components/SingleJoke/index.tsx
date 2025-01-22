import { Joke } from "~/types/Joke";
import { BsSpeakerFill, BsSpeaker } from "react-icons/bs";
import { motion } from "framer-motion";
import { useSpeakText } from "./hooks/useSpeakText";

type SingleJokeProps = {
    joke: Joke
}

const SingleJoke = ({ joke }: SingleJokeProps) => {

    const { isSpeaking, speakText } = useSpeakText(joke);

    return (
        <div key={joke.id} className="flex items-center gap-y-4 border border-gray-300 rounded-lg p-3 my-5 shadow-lg">
            <span className="mr-3">{joke.joke}</span>
            <motion.button
                onClick={speakText}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                
                    ${isSpeaking ? 'text-color-4' : 'text-color-4'}
                `}
                aria-label={isSpeaking ? "Stop speaking" : "Speak joke"}
            >
                {isSpeaking ? (
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <BsSpeakerFill className="w-5 h-5" />
                    </motion.div>
                ) : (
                    <BsSpeaker className="w-5 h-5" />
                )}
            </motion.button>
        </div>
    );
};

export default SingleJoke;