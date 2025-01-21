import { Joke } from "~/types/Joke";
import SingleJoke from "../SingleJoke";


type JokesProps = {
    jokes: Joke[];
}

const Jokes = ({ jokes }: JokesProps) => {

    return (
        <>
            {jokes.map(joke => (
                <SingleJoke joke={joke} />
            ))}
        </>
    );
}


export default Jokes;