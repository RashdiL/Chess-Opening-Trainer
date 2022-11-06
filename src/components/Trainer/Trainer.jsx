import { useState } from "react";
import Chessboard from "../Chessboard/Chessboard";
import Movehistory from "../MoveHistory/Movehistory";
import "./Trainer.css";
export default function Trainer() {
  const [history, setGameHistory] = useState();
  return (
    <>
      <div className=" grid grid-cols-2 gap-4">
        <Chessboard setGameHistory={setGameHistory} />
        <Movehistory history={history} />
      </div>
    </>
  );
}
