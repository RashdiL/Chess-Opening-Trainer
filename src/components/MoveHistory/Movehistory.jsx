import { uuid } from "uuidv4";
import { useEffect, useState } from "react";
export default function Movehistory({
  history,
  currentMove,
  setSavedOpenings,
  savedOpenings,
  setResetBoard,
}) {
  const [formattedHistory, setFormattedHistory] = useState();
  function formatHistory(history) {
    if (!history) return;
    let newHistory = [];
    let newRow = -1;
    for (let i = 0; i < history.length; i++) {
      if (i % 2 === 0) {
        newHistory.push([]);
        newRow++;
      }
      newHistory[newRow].push(history[i]);
    }
    return newHistory;
  }
  useEffect(() => {
    setFormattedHistory(formatHistory(history));
  }, [history]);
  function saveOpening(e) {
    const openingName = prompt("Please enter the name of your opening.");
    if (savedOpenings) {
      setSavedOpenings([...savedOpenings, [openingName, formattedHistory]]);
    } else {
      setSavedOpenings([[openingName, formattedHistory]]);
    }
  }
  return (
    <div className="grid grid-flow-row">
      <div className="overflow-auto h-[32vw] w-[10vw]">
        <div className="table w-full">
          <div className="table-header-group ...">
            <div className="table-row">
              <div className="table-cell text-left ...">WHITE</div>
              <div className="table-cell text-left ...">BLACK</div>
            </div>
          </div>
          <div className="table-row-group">
            {formattedHistory &&
              formattedHistory.map((element, index) => {
                console.log("running");
                if (Math.floor((currentMove - 1) / 2) === index) {
                  if ((currentMove - 1) % 2 === 0) {
                    return (
                      <div className="table-row">
                        <div className="table-cell bg-cyan-200">
                          {element[0]}
                        </div>
                        <div className="table-cell ...">{element[1]}</div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="table-row">
                        <div className="table-cell">{element[0]}</div>
                        <div className="table-cell  bg-cyan-200">
                          {element[1]}
                        </div>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="table-row">
                      <div className="table-cell ...">{element[0]}</div>
                      <div className="table-cell ...">{element[1]}</div>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          saveOpening(e);
          setResetBoard(true);
        }}
      >
        Save Opening
      </button>
    </div>
  );
}
