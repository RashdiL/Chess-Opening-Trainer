import { useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "../../Constants";
import Tile from "../Tile/Tile";
import Game from "../../chess-classes/Game";
const Chessboard = ({
  setHistory,
  setCurrentMove,
  history,
  checkNewMove,
  resetBoard,
  setResetBoard,
}) => {
  const [activePiece, setActivePiece] = useState(null);
  const [gameState, setGameState] = useState(new Game(true));
  const chessboardRef = useRef(null);
  const [grabPosition, setGrabPosition] = useState({ x: -1, y: -1 });
  const [board, setBoard] = useState(createBoard(gameState.getBoard()));
  const [grabbedPieceID, setGrabbedPieceID] = useState();
  const [allGameFEN, setAllGameFEN] = useState([gameState.chess.fen()]);
  const [fenPointer, setFENPointer] = useState(0);

  useEffect(() => {
    if (resetBoard) {
      restartGame();
      setResetBoard(false);
    }
  }, [resetBoard]);

  function handlePieceMovement(e) {
    const element = e.target;
    const chessboard = chessboardRef.current;
    if (!element.classList.contains("chess-piece") || !chessboard) return;
    const GRID_SIZE = chessboard.offsetWidth / 8;
    if (e.type === "mousedown") {
      grabPiece(e, chessboard);
      setActivePiece(element);
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil(
          (e.clientY - chessboard.offsetTop - chessboard.offsetWidth) /
            GRID_SIZE
        )
      );
      setGrabPosition({ x: grabX, y: grabY });
      const square = gameState.getBoard()[grabY][grabX];
      const piece = square.pieceOnThisSquare;
      setGrabbedPieceID(piece.id);
    }
    if (e.type === "mousemove" && activePiece) {
      movePiece(e, chessboard, activePiece);
    }
    if (e.type === "mouseup") {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil(
          (e.clientY - chessboard.offsetTop - chessboard.offsetWidth) /
            GRID_SIZE
        )
      );
      const attemptedMove = gameState.movePiece(grabbedPieceID, [x, y], true);
      if (
        attemptedMove !== "invalid move" &&
        attemptedMove !== "moved in the same position."
      ) {
        //setNewMove(true);
        makeNewMove();
      } else {
        if (!activePiece) return;
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
      }
      setActivePiece(null);
    }
  }

  function grabPiece(e, chessboard) {
    const GRID_SIZE = chessboard.offsetWidth / 8;
    const element = e.target;
    const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
    const grabY = Math.abs(
      Math.ceil(
        (e.clientY - chessboard.offsetTop - chessboard.offsetWidth) / GRID_SIZE
      )
    );

    const x = e.clientX - GRID_SIZE / 2;
    const y = e.clientY - GRID_SIZE / 2;
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    return [{ x: grabX, y: grabY }, element];
  }

  function movePiece(e, chessboard, activePiece) {
    const GRID_SIZE = chessboard.offsetWidth / 8;
    const minX = chessboard.offsetLeft - GRID_SIZE / 4;
    const minY = chessboard.offsetTop - GRID_SIZE / 4;
    const maxX =
      chessboard.offsetLeft + chessboard.offsetWidth - (GRID_SIZE / 4) * 3;
    const maxY =
      chessboard.offsetTop + chessboard.offsetHeight - (GRID_SIZE / 4) * 3;
    const x = e.clientX - GRID_SIZE / 2;
    const y = e.clientY - GRID_SIZE / 2;
    activePiece.style.position = "absolute";

    if (x < minX) {
      activePiece.style.left = `${minX}px`;
    } else if (x > maxX) {
      activePiece.style.left = `${maxX}px`;
    } else {
      activePiece.style.left = `${x}px`;
    }

    if (y < minY) {
      activePiece.style.top = `${minY}px`;
    } else if (y > maxY) {
      activePiece.style.top = `${maxY}px`;
    } else {
      activePiece.style.top = `${y}px`;
    }
  }

  function createBoard(pieces) {
    let board = [];
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const square = pieces[j][i];
        const piece = square.pieceOnThisSquare;
        let image = piece ? piece.image : undefined;
        board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
      }
    }
    return board;
  }

  function goToPreviousBoardState(e) {
    const newfenPointer = fenPointer - 1;
    setCurrentMove(newfenPointer);
    setFENPointer(newfenPointer);
    const newGameFen = allGameFEN[newfenPointer];
    let newGameState = new Game(true, newGameFen);
    setGameState(newGameState);
    setBoard(createBoard(newGameState.getBoard()));
  }

  function goToNextBoardState(e) {
    if (fenPointer === allGameFEN.length - 1) {
      return;
    }
    const newfenPointer = fenPointer + 1;
    setCurrentMove(newfenPointer);
    setFENPointer(newfenPointer);
    const newGameFen = allGameFEN[newfenPointer];
    let newGameState = new Game(true, newGameFen);
    setGameState(newGameState);
    setBoard(createBoard(newGameState.getBoard()));
  }

  function restartGame() {
    const newGameState = new Game(true);
    setGameState(newGameState);
    setAllGameFEN(newGameState.chess.fen());
    setFENPointer(0);
    setCurrentMove(0);
    setBoard(createBoard(newGameState.getBoard()));
    setHistory([]);
  }

  function reverseIncorrectMove() {
    const newfenPointer = fenPointer - 1;
    setCurrentMove(newfenPointer);
    setFENPointer(newfenPointer);
    const newGameFen = allGameFEN[newfenPointer];
    let newGameState = new Game(true, newGameFen);
    setGameState(newGameState);
    const lengthOfHistory = history.length;
    const historyOneMoveAgo = history.slice(0, lengthOfHistory - 1);
    console.log(historyOneMoveAgo);
    setHistory(historyOneMoveAgo);
  }

  function makeNewMove() {
    const oldFENPointer = fenPointer;
    setFENPointer(fenPointer + 1);
    setCurrentMove(fenPointer + 1);
    setBoard(createBoard(gameState.getBoard()));

    const newHistory = history
      .slice(0, oldFENPointer)
      .concat(gameState.chess.history().slice(-1));
    setHistory(newHistory);
    const newAllGameFEN = [
      ...allGameFEN.slice(0, fenPointer + 1),
      gameState.chess.fen(),
    ];
    setAllGameFEN(newAllGameFEN);
    const checkingMove = checkNewMove(newHistory);
    if (!checkingMove) {
      reverseIncorrectMove();
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => handlePieceMovement(e)}
        onMouseDown={(e) => handlePieceMovement(e)}
        onMouseUp={(e) => handlePieceMovement(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
        <div className="w-[32vw] justify-center grid grid-cols-2">
          <button onClick={(e) => goToPreviousBoardState(e)}>&#x2190;</button>
          <button onClick={(e) => goToNextBoardState(e)} className=" ">
            &#x2192;
          </button>
        </div>
      </div>
    </>
  );
};

export default Chessboard;
