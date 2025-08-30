"use client";
import * as React from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import type { AllWords } from "../../../../models/type";
import { toast } from "sonner";
import axios from "axios";

export function PlayerCard({
  scores,
  setScores,
  playerNum,
  turn,
  setTurn,
  thesarus,
  setThesarus,
}: {
  scores: number[];
  setScores: any;
  playerNum: number;
  turn: number;
  setTurn: any;
  thesarus: AllWords[];
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
            toast.error("Time's up! Turn skipped.");
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playerNum, turn, setTurn]);

  const checkShiritoriRules = (
    previous: string,
    currentWord: string
  ): { valid: boolean; message: string } => {
    if (!previous) {
      return { valid: true, message: "First word is valid" };
    }

    if (
      currentWord[0].toLowerCase() !==
      previous[previous.length - 1].toLowerCase()
    ) {
      return {
        valid: false,
        message: "Word must start with previous words last letter",
      };
    }

    return { valid: true, message: "Word is valid" };
  };

  const checkWordValidation = async (checkingWord: string) => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${checkingWord}`
      );

      const data = response.data;
      if (data.title) {
        toast.error("Word is not valid");
        return false;
      }
      return true;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async () => {
    const trimmedWord = word.trim().toLowerCase();
    const exists = thesarus.some((item) => item.word === word);

    if (exists) {
      toast.warning("This word has already been used");
      setError("This word has already been used");

      setTurn(1 - turn);
      setProgress(15);
      setWord("");
      setError(null);
      return;
    }

    const previousWord =
      thesarus.length > 0 ? thesarus[thesarus.length - 1].word : "";
    const result = checkShiritoriRules(previousWord, trimmedWord);

    if (!result.valid) {
      toast.warning(result.message);
      setError(result.message);
      setTurn(1 - turn);
      setProgress(15);
      setWord("");
      return;
    }

    const validWord = await checkWordValidation(word);

    if (!validWord) {
      setError("Word is not valid");
      setTurn(1 - turn);
      setProgress(15);
      setWord("");
      return;
    }

    setThesarus([
      ...thesarus,
      {
        word: word,
        player: playerNum,
      },
    ]);

    const lengthBonus = Math.max(0, trimmedWord.length - 4);
    const newScore = scores[playerNum] + progress + lengthBonus;

    setScores((prev: number[]) =>
      prev.map((score, idx) => (idx === playerNum ? newScore : score))
    );

    toast.success(
      `+${
        progress + lengthBonus
      } points! (${progress} time + ${lengthBonus} length bonus)`
    );

    setTurn(1 - turn);
    setProgress(15);
    setWord("");
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && playerNum === turn) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getLastLetter = () => {
    if (thesarus.length === 0) return null;
    const lastWord = thesarus[thesarus.length - 1].word;
    return lastWord[lastWord.length - 1].toUpperCase();
  };

  const isMyTurn = playerNum === turn;
  const lastLetter = getLastLetter();

  return (
    <Card className="w-[350px] md:w-[500px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h1>
            Player {playerNum + 1} - {scores[playerNum]} pts
          </h1>
          {isMyTurn && <h2>Time: {progress}</h2>}
        </CardTitle>
        {isMyTurn && (
          <Progress value={(progress / 15) * 100} className="w-full" />
        )}
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor={`word-player-${playerNum}`}
                className="flex justify-between"
              >
                <span>Enter Word</span>
                {isMyTurn && lastLetter && (
                  <span className="text-sm text-muted-foreground">
                    Must start with:{" "}
                    <span className="font-bold text-primary">{lastLetter}</span>
                  </span>
                )}
              </Label>
              <Input
                id={`word-player-${playerNum}`}
                placeholder={
                  isMyTurn
                    ? lastLetter
                      ? `Word starting with ${lastLetter}...`
                      : "Enter any word to start"
                    : "Waiting for your turn..."
                }
                disabled={!isMyTurn}
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyPress}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 justify-between">
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit}
          disabled={!isMyTurn || !word.trim()}
        >
          {isMyTurn ? "Submit Word" : "Waiting..."}
        </Button>

        <div className="flex flex-col gap-1 p-1 border border-foreground/40 w-full h-40 overflow-y-auto">
          <p className="text-sm text-muted-foreground mb-1">My Words:</p>
          {thesarus.filter((item) => item.player === playerNum).length ===
            0 && (
            <p className="text-sm text-center text-muted-foreground p-4">
              No words yet
            </p>
          )}
          {thesarus
            .filter((item) => item.player === playerNum)
            .map((item) => (
              <div
                key={item.word}
                className="px-2 py-1 text-sm rounded bg-secondary/50 flex justify-between"
              >
                <span>{item.word}</span>
                <span className="text-muted-foreground">
                  +{Math.max(0, item.word.length - 4)} bonus
                </span>
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}