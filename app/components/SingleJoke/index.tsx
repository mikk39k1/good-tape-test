import { Joke } from "~/types/Joke";

type SingleJokeProps = {
    joke: Joke
}

const SingleJoke = ({joke}: SingleJokeProps) => {
    return (
        <div>
            <span>{joke.joke}</span>
        </div>
    )
}

export default SingleJoke;