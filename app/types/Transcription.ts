export type Transcription = {
    info: {
        duration: number;
        language: string;
    };
    text: string;
    segments: {
        text: string;
        start: number;
        end: number;
    }[];
};