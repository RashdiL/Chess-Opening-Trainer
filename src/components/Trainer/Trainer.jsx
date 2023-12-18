import { useRef, useState, useEffect } from "react";
import Chessboard from "../Chessboard/Chessboard";
import Movehistory from "../MoveHistory/Movehistory";
import SavedOpening from "../SavedOpening/SavedOpening";
import "./Trainer.css";
export default function Trainer() {
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [savedOpenings, setSavedOpenings] = useState();
  const [testingOpening, setTestingOpening] = useState();
  const [resetBoard, setResetBoard] = useState(false);
  const [wrongToggled, setWrongToggled] = useState(false);
  const [rightToggled, setRightToggled] = useState(false);

  useEffect(() => {
    console.log(`history change to: ${history}`);
  }, [history]);

  function checkNewMove(history) {
    console.log(`history: ${history}`);
    if (testingOpening) {
      const formattedTestingOpening = [];
      testingOpening.forEach((Element) => {
        Element.forEach((el) => {
          formattedTestingOpening.push(el);
        });
      });
      console.log(`formattedTestingOpening: ${formattedTestingOpening}`);
      let i = 0;
      while (history[i]) {
        if (history[i] !== formattedTestingOpening[i]) {
          return false;
        } else {
          if (history.length === formattedTestingOpening.length) {
            setTestingOpening(false);
            return "complete";
          }
        }
        i++;
      }
      // for (let i = 0; i < history.length; i++) {
      //   if (history[i] !== formattedTestingOpening[i]) {
      //     return false;
      //   } else {
      //     if (history.length === formattedTestingOpening.length) {
      //       setTestingOpening(false);
      //       return "complete";
      //     }
      //   }
      // }
    }
    return true;
  }

  return (
    <div>
      <nav className="py-5 mb-5 flex justify-center bg-[#1aadc0] font-bold text-white">
        <h1 className="font-burtons text-xl content-center">
          Chess Opening Trainer
        </h1>
      </nav>
      {wrongToggled && (
        <img
          className=" absolute left-[33.5vw] top-[28.5vw] h-[5vw] w-[5vw]"
          src="assets/images/incorrect.png"
          alt="incorrect"
        />
      )}
      {rightToggled && (
        <img
          className=" absolute left-[33.5vw] top-[28.5vw] h-[5vw] w-[5vw]"
          src="assets/images/checkmark.jpeg"
          alt="correct"
        />
      )}
      <div className=" grid grid-flow-col gap-2 h-[32vw] w-[60vw] mx-[20vw] my-[10vw] auto-cols-min">
        <div>
          <Chessboard
            setCurrentMove={setCurrentMove}
            setHistory={setHistory}
            history={history}
            className="m-0 p-0 relative"
            checkNewMove={checkNewMove}
            resetBoard={resetBoard}
            setResetBoard={setResetBoard}
            setWrongToggled={setWrongToggled}
            setRightToggled={setRightToggled}
            testingOpening={testingOpening}
          />
        </div>
        <Movehistory
          currentMove={currentMove}
          history={history}
          savedOpenings={savedOpenings}
          setSavedOpenings={setSavedOpenings}
          setResetBoard={setResetBoard}
          className="m-0 p-0"
        />
        <SavedOpening
          savedOpenings={savedOpenings}
          setTestingOpening={setTestingOpening}
          setResetBoard={setResetBoard}
        />
      </div>
    </div>
  );
}
