import { Joke } from "~/types/Joke";
import SingleJoke from "../SingleJoke";


type JokesProps = {
    jokes: Joke[];
}

const Jokes = ({jokes}: JokesProps) => {

    console.log("Jokes: ", jokes);
    return (
        <div>
            {jokes.map(joke => (
                <SingleJoke joke={joke} />
            ))}
        </div>
    );
}


export default Jokes;