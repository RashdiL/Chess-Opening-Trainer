import { useState } from "react";

export default function SavedOpening({
  savedOpenings,
  setTestingOpening,
  setResetBoard,
}) {
  function saveOpening() {}
  return (
    <div className="table w-[10vw]">
      <div className="table-header-group ...">
        <div className="table-row">
          <div className="table-cell text-left ...">Saved Openings</div>
        </div>
        <div className="table-row-group">
          {savedOpenings &&
            savedOpenings.map((element, index) => {
              return (
                <div className="table-row">
                  <div className="table-cell ...">
                    <button
                      onClick={(e) => {
                        setTestingOpening(element[1]);
                        setResetBoard(true);
                      }}
                    >
                      {element[0]}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
