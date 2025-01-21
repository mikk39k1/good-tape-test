import { motion } from "framer-motion";


type AnimatedTextProps = {
    text: string;
};

const AnimatedText = ({ text }: AnimatedTextProps) => {
    const letters = text.split("");

    return (
        <div className="flex">
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ y: 0 }}
                    animate={{ y: [-2, 0] }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: index * 0.1,
                    }}
                    className="text-color-4 inline-block"
                >
                    {letter}
                </motion.span>
            ))}
        </div>
    );
};

export default AnimatedText;
