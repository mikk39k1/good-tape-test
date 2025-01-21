export default async function fetchJoke(searchTerm: string): Promise<{ error?: string; data?: string }> {

    const response = await fetch(`https://icanhazdadjoke.com/search?term=${searchTerm}`, {
        headers: {
            Accept: "application/json",
            "User-Agent":
                "Voice-Activated-Dad-Joke-Search-Engine (localhost:5173; lausen-m@hotmail.com)",
        },
    });

    if (!response.ok) {
        return { error: "Failed to fetch joke from the dad joke API." };
    }

    const data = await response.json();

    if (!data.results.length) {
        return { error: "No jokes found." };
    }

    return data;
};