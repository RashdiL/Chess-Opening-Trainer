import "./Tile.css";
import { useEffect, useRef, useState } from "react";
export default function Tile({
  number,
  image,
  setSelectedPieceCoordinates,
  XCoord,
  YCoord,
}) {
  const [isPiece, setIsPiece] = useState(image ? true : false);
  if (number % 2 === 0) {
    return (
      <div
        className="tile black-tile"
        onMouseDown={(e) => {
          setSelectedPieceCoordinates([XCoord, YCoord]);
        }}
      >
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="chess-piece"
          ></div>
        )}
      </div>
    );
  } else {
    return (
      <div
        className="tile white-tile"
        onMouseDown={(e) => {
          setSelectedPieceCoordinates([XCoord, YCoord]);
        }}
      >
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="chess-piece"
          ></div>
        )}
      </div>
    );
  }
}
