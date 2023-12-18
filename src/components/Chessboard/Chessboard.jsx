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
  setWrongToggled,
  setRightToggled,
  testingOpening,
}) => {
  const [selectedPieceCoordinates, setSelectedPieceCoordinates] = useState([
    null,
    null,
  ]);
  const [activePiece, setActivePiece] = useState(null);
  const [game, setGame] = useState(new Game(true));
  const chessboardRef = useRef(null);
  const [board, setBoard] = useState(createBoard(game.getBoard()));
  const [grabbedPieceID, setGrabbedPieceID] = useState();
  const [gameFENs, setGameFENs] = useState([game.chess.fen()]);
  const [fenPointer, setFENPointer] = useState(0);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (resetBoard) {
      restartGame();
      setResetBoard(false);
    }
  }, [resetBoard]);

  async function handlePieceMovement(e) {
    const element = e.target;
    const chessboard = chessboardRef.current;
    if (!element.classList.contains("chess-piece") || !chessboard) return;
    const GRID_SIZE = chessboard.offsetWidth / 8;
    if (e.type === "mousedown") {
      grabPiece(e, chessboard);
      setActivePiece(element);
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const grabX = Math.floor(
        (e.clientX + scrollX - chessboard.offsetLeft) / GRID_SIZE
      );
      const grabY = Math.abs(
        Math.ceil(
          (e.clientY +
            scrollY -
            chessboard.offsetTop -
            chessboard.offsetWidth) /
            GRID_SIZE
        )
      );
      const square = game.getBoard()[grabY][grabX];
      const piece = square.pieceOnThisSquare;
      setGrabbedPieceID(piece.id);
    }
    if (e.type === "mousemove" && activePiece) {
      movePiece(e, chessboard, activePiece);
    }
    if (e.type === "mouseup") {
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const x = Math.floor(
        (e.clientX + scrollX - chessboard.offsetLeft) / GRID_SIZE
      );
      const y = Math.abs(
        Math.ceil(
          (e.clientY +
            scrollY -
            chessboard.offsetTop -
            chessboard.offsetWidth) /
            GRID_SIZE
        )
      );
      const attemptedMove = game.movePiece(grabbedPieceID, [x, y], true);

      if (
        attemptedMove !== "invalid move" &&
        attemptedMove !== "moved in the same position."
      ) {
        if (testingOpening) {
          const checkingMove = checkNewMove(game.chess.history());
          if (!checkingMove) {
            activePiece.style.position = "relative";
            activePiece.style.removeProperty("top");
            activePiece.style.removeProperty("left");
            console.log(`curr history: ${history}`);
            console.log(`curr game history: ${game.chess.history()}`);
            game.chess.undo();
            console.log(`undo history: ${game.chess.history()}`);
            setHistory(game.chess.history());
            setWrongToggled(true);
            await delay(1000);
            setWrongToggled(false);
            console.log(`history after wrong move made: ${history}`);
          } else {
            if (checkingMove === "complete") {
              makeNewMove();
              setRightToggled(true);
              await delay(1000);
              setRightToggled(false);
            } else {
              makeNewMove();
              const formattedTestingOpening = [];
              testingOpening.forEach((Element) => {
                Element.forEach((el) => {
                  formattedTestingOpening.push(el);
                });
              });
            }
          }
        } else {
          makeNewMove();
        }
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

    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const x = e.clientX + scrollX - GRID_SIZE / 2;
    const y = e.clientY + scrollY - GRID_SIZE / 2;

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

    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const x = e.clientX + scrollX - GRID_SIZE / 2;
    const y = e.clientY + scrollY - GRID_SIZE / 2;
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
        board.push(
          <Tile
            key={`${j},${i}`}
            image={image}
            number={number}
            setSelectedPieceCoordinates={setSelectedPieceCoordinates}
            YCoord={j}
            XCoord={i}
          />
        );
      }
    }
    return board;
  }

  function goToPreviousBoardState(e) {
    if (fenPointer === 0) {
      return;
    }
    const newfenPointer = fenPointer - 1;
    setCurrentMove(newfenPointer);
    setFENPointer(newfenPointer);
    const newGameFen = gameFENs[newfenPointer];
    let newGame = new Game(true, newGameFen);
    setGame(newGame);
    setBoard(createBoard(newGame.getBoard()));
  }

  function goToNextBoardState(e) {
    if (fenPointer === gameFENs.length - 1) {
      return;
    }
    const newfenPointer = fenPointer + 1;
    setCurrentMove(newfenPointer);
    setFENPointer(newfenPointer);
    const newGameFen = gameFENs[newfenPointer];
    let newGame = new Game(true, newGameFen);
    setGame(newGame);
    setBoard(createBoard(newGame.getBoard()));
  }

  function restartGame() {
    const newGame = new Game(true);
    setGame(newGame);
    setGameFENs(newGame.chess.fen());
    setFENPointer(0);
    setCurrentMove(0);
    setBoard(createBoard(newGame.getBoard()));
    console.log("restarting game");
    setHistory([]);
  }

  function makeNewMove() {
    const oldFENPointer = fenPointer;
    setFENPointer(fenPointer + 1);
    setCurrentMove(fenPointer + 1);
    setBoard(createBoard(game.getBoard()));

    const newHistory = history
      .slice(0, oldFENPointer)
      .concat(game.chess.history().slice(-1));
    console.log(`last history: ${history}`);
    console.log(`last history slice: ${history.slice(0, oldFENPointer)}`);
    console.log(`added history: ${game.chess.history().slice(-1)}`);
    setHistory(newHistory);
    const newAllGameFEN = [
      ...gameFENs.slice(0, fenPointer + 1),
      game.chess.fen(),
    ];
    setGameFENs(newAllGameFEN);
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
        <div className="w-[32vw] h-[1vw] justify-center grid grid-cols-2">
          <button
            onClick={(e) => goToPreviousBoardState(e)}
            className=" border-2 border-black text-[1vw]"
          >
            &#x2190;
          </button>
          <button
            onClick={(e) => goToNextBoardState(e)}
            className="border-2 border-black text-[1vw]"
          >
            &#x2192;
          </button>
        </div>
      </div>
    </>
  );
};

export default Chessboard;
