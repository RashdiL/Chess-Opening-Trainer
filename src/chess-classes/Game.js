import { Chess } from "chess.js";
import ChessPiece from "./Piece";
import Square from "./Square";
// when indexing, remember: [y][x].
/**
 * If the player color is black, make sure to invert the board.
 */

class Game {
  constructor(thisPlayersColorIsWhite, FEN) {
    this.thisPlayersColorIsWhite = thisPlayersColorIsWhite;
    this.chessBoard = this.makeBoard(FEN);
    this.nQueens = 1;
    this.chess = new Chess(FEN);
    this.initializeCoordMappings(thisPlayersColorIsWhite);
  }
  initializeCoordMappings(isWhite) {
    const baseMappings = {
      coord: Array.from({ length: 8 }, (_, i) => i + 1),
      alphabet: ["a", "b", "c", "d", "e", "f", "g", "h"],
    };

    if (isWhite) {
      this.toCoord = this.createMapping(baseMappings.coord, true);
      this.toAlphabet = this.createMapping(baseMappings.alphabet, true);
      this.toCoord2 = this.createMapping(baseMappings.coord, false);
      this.toAlphabet2 = this.createMapping(baseMappings.alphabet, false);
    } else {
      this.toCoord = this.createMapping(baseMappings.coord, false);
      this.toAlphabet = this.createMapping(baseMappings.alphabet, false);
      this.toCoord2 = this.createMapping(baseMappings.coord, true);
      this.toAlphabet2 = this.createMapping(baseMappings.alphabet, true);
    }
  }

  createMapping(array, isDirect) {
    return array.reduce((acc, val, index) => {
      acc[isDirect ? index : array.length - index - 1] = val;
      return acc;
    }, {});
  }

  getBoard() {
    return this.chessBoard;
  }

  // nextPlayersTurn() {
  //     this.isWhitesTurn = !this.isWhitesTurn
  // }

  setBoard(newBoard) {
    this.chessBoard = newBoard;
  }

  movePiece(pieceId, to, isMyMove) {
    //The dictionary below presumably converts canvas coords to in game coords.

    var currentBoard = this.getBoard();
    const pieceCoordinates = this.findPiece(currentBoard, pieceId);

    // can't find piece coordinates (piece doesn't exist on the board)
    if (!pieceCoordinates) {
      return;
    }

    const y = pieceCoordinates[1];
    const x = pieceCoordinates[0];

    // new coordinates
    const to_y = to[1];
    const to_x = to[0];

    const originalPiece = currentBoard[y][x].getPiece();
    if (y === to_y && x === to_x) {
      return "moved in the same position.";
    }

    /**
     * In order for this method to do anything meaningful,
     * the 'reassign const' line of code must run. Therefore,
     * for it to run, we must check first that the given move is valid.
     */

    const isPromotion = this.isPawnPromotion(to, pieceId[1]);
    //toChessMove converts canvas coords into chess notation e.g. e4
    const moveAttempt = !isPromotion
      ? this.chess.move({
          from: this.toChessMove([x, y], to),
          to: this.toChessMove(to, to),
          piece: pieceId[1],
        })
      : this.chess.move({
          from: this.toChessMove([x, y], to),
          to: this.toChessMove(to, to),
          piece: pieceId[1],
          promotion: "q",
        });

    if (moveAttempt === null) {
      return "invalid move";
    }

    //Checks for enpasent.
    if (moveAttempt.flags === "e") {
      const move = moveAttempt.to;
      const x = this.toAlphabet2[move[0]];
      let y;
      if (moveAttempt.color === "w") {
        y = parseInt(move[1], 10) - 1;
      } else {
        y = parseInt(move[1], 10) + 1;
      }
      currentBoard[this.toCoord2[y]][x].setPiece(null);
    }

    // Check castling
    const castle = this.isCastle(moveAttempt);
    if (castle.didCastle) {
      /**
       *  The main thing we are doing here is moving the right rook
       *  to the right position.
       *
       * - Get original piece by calling getPiece() on the original [x, y]
       * - Set the new [to_x, to_y] to the original piece
       * - Set the original [x, y] to null
       */

      const originalRook = currentBoard[castle.y][castle.x].getPiece();
      currentBoard[castle.to_y][castle.to_x].setPiece(originalRook);
      currentBoard[castle.y][castle.x].setPiece(null);
    }

    // ___actually changing the board model___

    const reassign = isPromotion
      ? currentBoard[to_y][to_x].setPiece(
          new ChessPiece(
            "queen",
            false,
            pieceId[0] === "w" ? "white" : "black",
            pieceId[0] === "w" ? "wq" + this.nQueens : "bq" + this.nQueens,
            `assets/images/queen_${pieceId[0]}.png`
          )
        )
      : currentBoard[to_y][to_x].setPiece(originalPiece);

    if (reassign !== "user tried to capture their own piece") {
      currentBoard[y][x].setPiece(null);
    } else {
      return reassign;
    }

    // ___actually changing the board model___

    const checkMate = this.chess.isCheckmate()
      ? " has been checkmated"
      : " has not been checkmated";

    if (checkMate === " has been checkmated") {
      return this.chess.turn() + checkMate;
    }
    // changes the fill color of the opponent's king that is in check
    const check = this.chess.inCheck() ? " is in check" : " is not in check";

    if (check === " is in check") {
      return this.chess.turn() + check;
    }

    // update board
    this.setBoard(currentBoard);
  }

  isCastle(moveAttempt) {
    /**
     * Assume moveAttempt is legal.
     *
     * {moveAttempt} -> {boolean x, y to_x, to_y}
     *
     * returns if a player has castled, the final position of
     * the rook (to_x, to_y), and the original position of the rook (x, y)
     *
     */

    const piece = moveAttempt.piece;
    const move = { from: moveAttempt.from, to: moveAttempt.to };

    const isBlackCastle =
      (move.from === "e1" && move.to === "g1") ||
      (move.from === "e1" && move.to === "c1");
    const isWhiteCastle =
      (move.from === "e8" && move.to === "g8") ||
      (move.from === "e8" && move.to === "c8");

    if (!(isWhiteCastle || isBlackCastle) || piece !== "k") {
      return {
        didCastle: false,
      };
    }

    let originalPositionOfRook;
    let newPositionOfRook;

    if (move.from === "e1" && move.to === "g1") {
      originalPositionOfRook = "h1";
      newPositionOfRook = "f1";
    } else if (move.from === "e1" && move.to === "c1") {
      originalPositionOfRook = "a1";
      newPositionOfRook = "d1";
    } else if (move.from === "e8" && move.to === "g8") {
      originalPositionOfRook = "h8";
      newPositionOfRook = "f8";
    } else {
      // e8 to c8
      originalPositionOfRook = "a8";
      newPositionOfRook = "d8";
    }

    return {
      didCastle: true,
      x: this.toAlphabet2[originalPositionOfRook[0]],
      y: this.toCoord2[originalPositionOfRook[1]],
      to_x: this.toAlphabet2[newPositionOfRook[0]],
      to_y: this.toCoord2[newPositionOfRook[1]],
    };
  }

  isPawnPromotion(to, piece) {
    const res = piece === "p" && (to[1] === 0 || to[1] === 7);
    if (res) {
      this.nQueens += 1;
    }
    return res;
  }

  undoMove() {
    this.chess.undo();
    const newFEN = this.chess.fen();
    this.makeBoard(newFEN);
  }

  toChessMove(finalPosition, to2D) {
    let move;

    if (finalPosition[0] > 100) {
      move =
        this.toAlphabet[to2D[finalPosition[0]]] +
        this.toCoord[to2D[finalPosition[1]]];
    } else {
      move = this.toAlphabet[finalPosition[0]] + this.toCoord[finalPosition[1]];
    }

    //  console.log("proposed move: " + move)
    return move;
  }

  findPiece(board, pieceId) {
    // ChessBoard, String -> [Int, Int]
    //  console.log("piecetofind: " + pieceId)
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (board[i][j].getPieceIdOnThisSquare() === pieceId) {
          return [j, i];
        }
      }
    }
  }

  makeBoard(FEN) {
    const toAlphabet2 = this.thisPlayersColorIsWhite
      ? {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
          f: 5,
          g: 6,
          h: 7,
        }
      : {
          h: 0,
          g: 1,
          f: 2,
          e: 3,
          d: 4,
          c: 5,
          b: 6,
          a: 7,
        };

    const toCoord2 = this.thisPlayersColorIsWhite
      ? {
          1: 0,
          2: 1,
          3: 2,
          4: 3,
          5: 4,
          6: 5,
          7: 6,
          8: 7,
        }
      : {
          8: 0,
          7: 1,
          6: 2,
          5: 3,
          4: 4,
          3: 5,
          2: 6,
          1: 7,
        };

    const backRank = {
      r: "rook",
      n: "knight",
      b: "bishop",
      q: "queen",
      k: "king",
      p: "pawn",
    };
    var startingChessBoard = [];
    //Initialize all the squares.
    for (var y = 0; y < 8; y++) {
      startingChessBoard.push([]);
      for (var x = 0; x < 8; x++) {
        // j is horizontal
        // i is vertical
        const coordinatesOnCanvas = [(x + 1) * 90 + 15, (y + 1) * 90 + 15];
        const emptySquare = new Square(x, y, null, coordinatesOnCanvas);

        startingChessBoard[y].push(emptySquare);
      }
    }
    this.chess = new Chess(FEN);
    //const chess = new Chess();
    let chessjsBoard = this.chess.board();
    for (let i = 0; i < chessjsBoard.length; i++) {
      for (let j = 0; j < chessjsBoard[0].length; j++) {
        if (!chessjsBoard[i][j]) {
          continue;
        }
        let square = chessjsBoard[i][j]["square"];
        let x = toAlphabet2[square.at(0)];
        let y = toCoord2[square.at(1)];
        let pieceType = chessjsBoard[i][j]["type"];
        let pieceColor = chessjsBoard[i][j]["color"];
        startingChessBoard[y][x].setPiece(
          new ChessPiece(
            backRank[pieceType],
            false,
            pieceColor === "b" ? "black" : "white",
            square.at(0) + square.at(1),
            `assets/images/${backRank[pieceType]}_${pieceColor}.png`
          )
        );
      }
    }
    return startingChessBoard;
  }
}

export default Game;
