import { useState } from "react";
import Chessboard from "../Chessboard/Chessboard";
import Movehistory from "../MoveHistory/Movehistory";
import "./Trainer.css";
export default function Trainer() {
  const [history, setGameHistory] = useState();
  const [currentMove, setCurrentMove] = useState();
  return (
    <>
      <nav>Hello</nav>
      <div className=" grid grid-cols-2 gap-y-0 h-[32vw] w-[70vw] mx-[20vw] my-[10vw]">
        <Chessboard
          setCurrentMove={setCurrentMove}
          setGameHistory={setGameHistory}
          history={history}
          className="m-0 p-0"
        />
        <Movehistory
          currentMove={currentMove}
          history={history}
          className="m-0 p-0"
        />
      </div>
    </>
  );
}
