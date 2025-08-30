"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { PlayerCard } from "./_components/PlayerCard";

const GamePage = () => {
    const [playerNames, setPlayerNames] = useState(["Player1", "Player2"]);
    const [scores, setScores] = useState([0, 0]);
    const [turn, serTurn] = useState(0);
    const [allWords, setAllWords] = useState<AllWords[]>([]);

    useEffect(() => { });

    return (
        <div className="">
            <div>
                <div>
                    <User size={26}/>
                    <h1>{playerNames[0]}</h1>
                </div>
                <PlayerCard/>
            </div>

        </div>
    );
}