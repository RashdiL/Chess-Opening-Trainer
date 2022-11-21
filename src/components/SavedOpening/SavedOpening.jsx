import { useRef, useState } from "react";

export default function SavedOpening({
  savedOpenings,
  setTestingOpening,
  setResetBoard,
  setSavedOpenings,
}) {
  const activeButtonRef = useRef(null);
  function changeButtonColor(e) {
    console.log(e);
  }
  return (
    <div className="grid grid-flow-row">
      <div className="h-[32vw]  border-blue-900 border-2">
        <div className="table w-[10vw] ">
          <div className="table-header-group ...">
            <div className="table-row">
              <div className="table-cell text-center text-[1vw] border-blue-900 border-b-2">
                Saved Openings
              </div>
            </div>
            <div className="table-row-group">
              {savedOpenings &&
                savedOpenings.map((element, index) => {
                  return (
                    <div className="table-row">
                      <div className="table-cell">
                        <div className="w-[10vw] flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              setTestingOpening(element[1]);
                              setResetBoard(true);
                            }}
                            className=" border-b-2 border-blue-900 w-[10vw] hover:bg-blue-300 focus:bg-blue-300"
                            id={index}
                          >
                            {element[0]}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
