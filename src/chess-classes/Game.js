import { Chess } from "chess.js";
import ChessPiece from "./Piece";
import Square from "./Square";
// when indexing, remember: [y][x].
/**
 * If the player color is black, make sure to invert the board.
 */

class Game {
  constructor(thisPlayersColorIsWhite) {
    this.thisPlayersColorIsWhite = thisPlayersColorIsWhite; // once initialized, this value should never change.
    // console.log("this player's color is white: " + this.thisPlayersColorIsWhite)
    this.chessBoard = this.makeStartingBoard(); // the actual chessBoard
    this.chess = new Chess();

    //Converts our 0 - 7 coords to chess 1 - 8 vertical coords
    this.toCoord = thisPlayersColorIsWhite
      ? {
          0: 1,
          1: 2,
          2: 3,
          3: 4,
          4: 5,
          5: 6,
          6: 7,
          7: 8,
        }
      : {
          0: 8,
          1: 7,
          2: 6,
          3: 5,
          4: 4,
          5: 3,
          6: 2,
          7: 1,
        };

    //Converts our 0 - 7 coords to chess horizontal a - h coords
    this.toAlphabet = thisPlayersColorIsWhite
      ? {
          0: "a",
          1: "b",
          2: "c",
          3: "d",
          4: "e",
          5: "f",
          6: "g",
          7: "h",
        }
      : {
          0: "h",
          1: "g",
          2: "f",
          3: "e",
          4: "d",
          5: "c",
          6: "b",
          7: "a",
        };

    //Opposite of toCoord
    this.toCoord2 = thisPlayersColorIsWhite
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

    //Opposite of toAlphabet
    this.toAlphabet2 = thisPlayersColorIsWhite
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

    this.nQueens = 1;
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
    console.log("move is");

    console.log(moveAttempt);
    // console.log(isPromotion)

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
            "assets/images/queen_b.png"
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
    console.log(this.chess.turn() + checkMate);
    if (checkMate === " has been checkmated") {
      return this.chess.turn() + checkMate;
    }
    // changes the fill color of the opponent's king that is in check
    const check = this.chess.inCheck() ? " is in check" : " is not in check";
    console.log(this.chess.turn() + check);
    if (check === " is in check") {
      return this.chess.turn() + check;
    }

    console.log(currentBoard);
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

  makeStartingBoard() {
    const backRank = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];
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
    const whiteBackRankId = [
      "wr1",
      "wn1",
      "wb1",
      "wq1",
      "wk1",
      "wb2",
      "wn2",
      "wr2",
    ];
    const blackBackRankId = [
      "br1",
      "bn1",
      "bb1",
      "bq1",
      "bk1",
      "bb2",
      "bn2",
      "br2",
    ];
    let team = this.thisPlayersColorIsWhite ? "white" : "black";
    for (var y = 0; y < 8; y += 7) {
      for (var x = 0; x < 8; x++) {
        //Initialize Our Pieces
        if (y === 0) {
          // top
          // console.log(backRank[i])
          let horizontalChessCoord = this.thisPlayersColorIsWhite ? x : 7 - x; // For the white player. They're left most square is 0 but for the black player it is 7.
          let pieceID = this.thisPlayersColorIsWhite
            ? whiteBackRankId[x]
            : blackBackRankId[x];
          startingChessBoard[y][horizontalChessCoord].setPiece(
            new ChessPiece(
              backRank[x],
              false,
              team,
              pieceID,
              `assets/images/${backRank[x]}_${team[0]}.png`
            )
          );
          startingChessBoard[y + 1][horizontalChessCoord].setPiece(
            new ChessPiece(
              "pawn",
              false,
              team,
              this.thisPlayersColorIsWhite ? "wp" + x : "bp" + x,
              `assets/images/pawn_${team[0]}.png`
            )
          );
        } else {
          //Initialize Our Pieces
          // bottom
          let enemyTeam = team === "white" ? "black" : "white";
          let horizontalChessCoord = this.thisPlayersColorIsWhite ? x : 7 - x; // For the white player. They're left most square is 0 but for the black player it is 7.
          let pieceID = this.thisPlayersColorIsWhite
            ? blackBackRankId[x]
            : whiteBackRankId[x];
          startingChessBoard[y - 1][horizontalChessCoord].setPiece(
            new ChessPiece(
              "pawn",
              false,
              enemyTeam,
              this.thisPlayersColorIsWhite ? "bp" + x : "wp" + x,
              `assets/images/pawn_${enemyTeam[0]}.png`
            )
          );

          startingChessBoard[y][horizontalChessCoord].setPiece(
            new ChessPiece(
              backRank[x],
              false,
              enemyTeam,
              pieceID,
              `assets/images/${backRank[x]}_${enemyTeam[0]}.png`
            )
          );
        }
      }
    }
    return startingChessBoard;
  }
}

export default Game;
