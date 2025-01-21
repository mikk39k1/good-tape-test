import { Joke } from "~/types/Joke";
import { BsSpeakerFill, BsSpeaker } from "react-icons/bs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type SingleJokeProps = {
    joke: Joke
}

const SingleJoke = ({ joke }: SingleJokeProps) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const speakText = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(joke.joke);

        const englishVoice = voices.find(voice =>
            voice.lang.startsWith('en-')
        );
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            console.error('Speech synthesis error');
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

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