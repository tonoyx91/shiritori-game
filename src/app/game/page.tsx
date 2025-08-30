"use client";
import React, { useEffect, useState } from "react";
import { PlayerCard } from "./_components/PlayerCard";
import { User } from "lucide-react";
import type { AllWords } from "../../../models/type";

const GamePage = () => {
  const [playerNames, setPlayerNames] = useState(["Player1", "Player2"]);
  const [scores, setScores] = useState([0, 0]);
  const [turn, setTurn] = useState(0);
  const [allWords, setAllWords] = useState<AllWords[]>([]);

  useEffect(() => {});

  return (
    <div
      className="flex flex-1 flex-col md:flex-row gap-5 items-center md:items-center 
	justify-between px-2 md:px-40 py-5 md:py-0"
    >
      {/* player 1 div  */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <User size={24} />
          <h1>{playerNames[0]}</h1>
        </div>
        <PlayerCard
          scores={scores}
          setScores={setScores}
          playerNum={0}
          turn={turn}
          setTurn={setTurn}
          thesarus={allWords}
          setThesarus={setAllWords}
        />
      </div>
      <hr className="bg-foreground text-foreground h-2 md:h-[90dvh] w-[90vw] md:w-[0.5]" />

      {/* player 2 div  */}
      <div>
        <div className="flex gap-2">
          <User size={24} />
          <h1>{playerNames[0]}</h1>
        </div>
        <PlayerCard
          scores={scores}
          setScores={setScores}
          playerNum={1}
          turn={turn}
          setTurn={setTurn}
          thesarus={allWords}
          setThesarus={setAllWords}
        />
      </div>
    </div>
  );
};

export default GamePage;