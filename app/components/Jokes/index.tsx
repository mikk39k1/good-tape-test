import { Joke } from "~/types/Joke";
import SingleJoke from "../SingleJoke";


type JokesProps = {
    jokes: Joke[];
}

const Jokes = ({ jokes }: JokesProps) => {

    return (
        <div className="w-full max-h-[500px] overflow-y-auto">
            {jokes.map(joke => (
                <SingleJoke joke={joke} />
            ))}
        </div>
    );
}


export default Jokes;