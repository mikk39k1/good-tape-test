import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("term");

    // Determine the API endpoint based on whether a search term is provided
    let apiUrl = "https://icanhazdadjoke.com/";
    if (term) {
        apiUrl = `https://icanhazdadjoke.com/search?term=${encodeURIComponent(term)}`;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/json", // Specify JSON response
                "User-Agent":
                    "Voice-Activated-Dad-Joke-Search-Engine (https://yourwebsite.com; contact@youremail.com)",
            },
        });

        if (!response.ok) {
            return { error: "Failed to fetch joke from the dad joke API." };
        }

        const data = await response.json();

        // Return the data as JSON
        return data;

    } catch (error) {
        console.error("Error fetching joke:", error);
        return { error: "An error occurred while fetching the joke." };
    }
}