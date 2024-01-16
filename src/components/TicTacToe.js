import React, { useState, useEffect } from "react";
import { requestBotMove } from "../utils/api";

const initialBoard = Array(9).fill(null);

const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoard);
  const [winner, setWinner] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startGame = () => {
    setIsGameStarted(true);
    setBoard(initialBoard);
    setWinner(null);
    setIsPlayerTurn(true);
  };

  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
  };

  const choiceButtonClass = (choice) => {
    return `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${
      playerChoice === choice ? "bg-red-500 hover:bg-red-700" : ""
    }`;
  };

  const handleClick = async (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = playerChoice;
    setBoard(newBoard);
    checkWinner(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    const makeBotMove = async () => {
      if (!isPlayerTurn) {
        const newBoard = [...board];
        const botIndex = await requestBotMove(newBoard);
        if (botIndex !== null) {
          newBoard[botIndex] = playerChoice === "X" ? "O" : "X";
          setBoard(newBoard);
          checkWinner(newBoard);
        }
        setIsPlayerTurn(true);
      }
    };

    if (winner == null) {
      makeBotMove();
    }
  }, [isPlayerTurn]);

  const [winningSequence, setWinningSequence] = useState(null);

  const checkWinner = (currentBoard) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        setWinner(currentBoard[a] === playerChoice ? "User" : "Computer");
        setWinningSequence(combination);
        return;
      }
    }

    if (!currentBoard.includes(null) && !winner) {
      setWinner("Tie");
      setWinningSequence(null);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setIsPlayerTurn(true);
    setIsGameStarted(false);
    setWinningSequence(null);
  };

  const isWinningCell = (index) => {
    return winningSequence && winningSequence.includes(index);
  };

  const TicTacToeCell = ({ value, onClick, isWinningCell }) => {
    const cellStyle = `w-1/3 h-16 border border-gray-300 flex items-center justify-center text-2xl font-bold cursor-pointer ${
      isWinningCell ? "bg-green-500" : ""
    }`;

    return (
      <div className={cellStyle} onClick={onClick}>
        {value}
      </div>
    );
  };

  return (
    <div className="text-center mt-8">
      {!isGameStarted ? (
        <div>
          <div className="mb-4">
            <button
              className={choiceButtonClass("X")}
              onClick={() => handlePlayerChoice("X")}
            >
              Choose X
            </button>
            <button
              className={choiceButtonClass("O")}
              onClick={() => handlePlayerChoice("O")}
            >
              Choose O
            </button>
          </div>
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
              !playerChoice && "cursor-not-allowed opacity-50"
            }`}
            onClick={startGame}
            disabled={!playerChoice}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap w-64">
            {board.map((cell, index) => (
              <TicTacToeCell
                key={index}
                value={cell}
                onClick={() => isPlayerTurn && handleClick(index)}
                isWinningCell={isWinningCell(index)}
              />
            ))}
          </div>

          {winner == null ? (
            isPlayerTurn ? (
              <div>Your Turn</div>
            ) : (
              <div>Waiting for Response...</div>
            )
          ) : (
            <></>
          )}
          {winner && (
            <div className="mt-4">
              {winner === "Tie"
                ? "It's a tie!"
                : `Game completed. The winner is ${
                    winner === "User" ? "you" : "the computer"
                  }.`}
            </div>
          )}
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
