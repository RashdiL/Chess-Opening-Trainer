import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
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
  const [isBackgroundRed, setIsBackgroundRed] = useState(false);
  const [isBackgroundGreen, setIsBackgroundGreen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState();
  const [incorrectMove, setIncorrectMove] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function checkNewMove(history) {
    if (testingOpening) {
      const formattedTestingOpening = [];
      testingOpening.forEach((Element) => {
        Element.forEach((el) => {
          formattedTestingOpening.push(el);
        });
      });
      for (let i = 0; i < history.length; i++) {
        if (history[i] !== formattedTestingOpening[i]) {
          setIsBackgroundRed(true);
          setBackgroundColor("bg-red-400");
          return false;
        } else {
          if (history.length === formattedTestingOpening.length) {
            setBackgroundColor("bg-green-400");
            return true;
          }
        }
      }
    }
    return true;
  }
  function handleOpen() {
    setModalOpen(true);
  }
  function handleClose() {
    setModalOpen(false);
  }
  return (
    <div className={backgroundColor}>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <h1 className=" text-center">WRONG</h1>
      </Modal>
      <nav>Hello</nav>
      <button
        onClick={(e) => {
          handleOpen(e);
        }}
      >
        open modal
      </button>
      <div className=" grid grid-flow-col gap-2 h-[32vw] w-[60vw] mx-[20vw] my-[10vw] auto-cols-min">
        <Chessboard
          setCurrentMove={setCurrentMove}
          setHistory={setHistory}
          history={history}
          className="m-0 p-0"
          checkNewMove={checkNewMove}
          resetBoard={resetBoard}
          setResetBoard={setResetBoard}
        />
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
