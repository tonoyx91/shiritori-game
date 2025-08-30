"use client";
import * as React from "react";
// import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { axios } from "axios";

export function PlayerCard({
    scores,
    setScores,
    playerNum,
    turn,
    setTurn,
    thesarus,
    setThesarus,
}:
    {
        scores: number[];
        setScores: any;
        playerNum: number;
        turn: number;
        setTurn: any;
        thesarus: Allwords[];
        setThesarus: any;
    }) {
    const [progress, setProgress] = React.useState(15);

    const [word, setWord] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (playerNum === turn) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer as NodeJS.Timeout);
                        setTurn(1 - turn);
                        toast.error(
                            "Time is Up!"
                        );
                        return 15;
                    }
                    return prev-1;
                });
        }, 1000);
        }

        return() => {
            if (timer) clearInterval(timer);
        };
    
    }, [playerNum, turn, setTurn]);

    const checkShirtoriRules = (
        previous: string, 
        currentWord: string
    ): { valid: boolean; message: string } => 
    {
        if(!previous){
            return {
                valid: true, message: "Congrats! Your First word is valid"
            };
        }

        if(currentWord[0].toLowerCase() !== previous[previous.length - 1].toLowerCase()) {
            return {
                valid: false, message: "Your word must start with the last alphabet!"
            };
        }

        return {
            valid: true, message:"Your word is valid!"
        };

        const checkWordValidation = async (checkingWord: string) => {
            try{
                const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${checkingWord}`);

                const data = response.data;
                if(data.title) {
                    toast.error("word is not valid!");
                    return false;
                }
                return true;
            } catch(error: any){
                toast.error(error.message);
            }
        };


        const handleSubmit = async () => {
            const trimmedWord = word.trim().toLowerCase();
            const exists = thesarus.some((item) => item.word === word);

            if(exists) {
                toast.warning(
                    "This word is already taken!"
                );
                setError(
                    "This word is already taken!"
                );

                setTurn(1-turn);
                setProgress(15);
                setWord("");
                setError(null);
                return;
            }
        }

        const previousWord = thesarus.length >0 ? thesarus[thesarus.length-1].word : "";
        const result = checkShirtoriRules(previousWord, trimmedWord);

        if(!result.valid){
            
        }

    }
}