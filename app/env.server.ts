import { ENV } from "./types/env";

declare global {
    var ENV: ENV;
}

export function getEnv() {
    return {
        GOOD_TAPE_API_KEY: process.env.GOOD_TAPE_API_KEY
    };
}