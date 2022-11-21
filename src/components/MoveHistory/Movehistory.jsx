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
      <div className="overflow-auto h-[32vw] w-[10vw] border-blue-900 border-2">
        <div className="table w-full">
          <div className="table-header-group ...">
            <div className="table-row">
              <div className="table-cell text-center text-[1vw]">WHITE</div>
              <div className="table-cell text-center text-[1vw]">BLACK</div>
            </div>
          </div>
          <div className="table-row-group">
            {formattedHistory &&
              formattedHistory.map((element, index) => {
                if (Math.floor((currentMove - 1) / 2) === index) {
                  if ((currentMove - 1) % 2 === 0) {
                    return (
                      <div className="table-row">
                        <div className="table-cell text-center bg-cyan-200">
                          {element[0]}
                        </div>
                        <div className="table-cell text-center">
                          {element[1]}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="table-row">
                        <div className="table-cell text-center">
                          {element[0]}
                        </div>
                        <div className="table-cell  bg-cyan-200 text-center">
                          {element[1]}
                        </div>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="table-row">
                      <div className="table-cell text-center">{element[0]}</div>
                      <div className="table-cell text-center">{element[1]}</div>
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
        className="text-[1vw] border-2 border-black"
      >
        Save Opening
      </button>
    </div>
  );
}
