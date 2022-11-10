import { useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "../../Constants";
import Tile from "../Tile/Tile";
import Game from "../../chess-classes/Game";
const Chessboard = ({ setGameHistory }) => {
  const [activePiece, setActivePiece] = useState(null);
  const [gameState, setGameState] = useState(new Game(true));
  const chessboardRef = useRef(null);
  const [grabPosition, setGrabPosition] = useState({ x: -1, y: -1 });
  const [board, setBoard] = useState(createBoard(gameState.getBoard()));
  const [grabbedPieceID, setGrabbedPieceID] = useState();
  const [newMove, setNewMove] = useState(true);
  const [allGameFEN, setAllGameFEN] = useState([]);
  const [fenPointer, setFENPointer] = useState(-1);
  const [undoMove, setUndoMove] = useState(false);
  //this can now be replaced by new Chess()
  useEffect(() => {
    if (newMove) {
      setFENPointer(fenPointer + 1);
      setBoard(createBoard(gameState.getBoard()));
      console.log("creating new board");
      setNewMove(false);
      setGameHistory(gameState.chess.history());
      setAllGameFEN([...allGameFEN, gameState.chess.fen()]);
      console.log(allGameFEN);
    }
  }, [newMove]);

  useEffect(() => {
    setBoard(createBoard(gameState.getBoard()));
  }, [gameState]);

  //adjust this to move pieces only is it is legal.
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
      console.log(piece.id);
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
        setNewMove(true);
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

    //If x is smaller than minimum amount
    if (x < minX) {
      activePiece.style.left = `${minX}px`;
    }
    //If x is bigger than maximum amount
    else if (x > maxX) {
      activePiece.style.left = `${maxX}px`;
    }
    //If x is in the constraints
    else {
      activePiece.style.left = `${x}px`;
    }

    //If y is smaller than minimum amount
    if (y < minY) {
      activePiece.style.top = `${minY}px`;
    }
    //If y is bigger than maximum amount
    else if (y > maxY) {
      activePiece.style.top = `${maxY}px`;
    }
    //If y is in the constraints
    else {
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
    console.log(gameState.chess.board());
    const newfenPointer = fenPointer - 1;
    setFENPointer(newfenPointer);
    let newGameState = new Game(true);
    console.log(newGameState.chess.load(allGameFEN[newfenPointer]));
    setGameState(newGameState);
  }

  return (
    <>
      <div className="chessboard-container">
        <div
          onMouseMove={(e) => handlePieceMovement(e)}
          onMouseDown={(e) => handlePieceMovement(e)}
          onMouseUp={(e) => handlePieceMovement(e)}
          id="chessboard"
          ref={chessboardRef}
        >
          {board}
          <button onClick={(e) => goToPreviousBoardState(e)}>Undo</button>
        </div>
      </div>
    </>
  );
};

export default Chessboard;
