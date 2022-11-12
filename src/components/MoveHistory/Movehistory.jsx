import { useEffect, useState } from "react";
export default function Movehistory({ history, currentMove }) {
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
  return (
    <div className="overflow-auto h-60 w-[10vw]">
      <div className="table w-full">
        <div class="table-header-group ...">
          <div class="table-row">
            <div class="table-cell text-left ...">WHITE</div>
            <div class="table-cell text-left ...">BLACK</div>
          </div>
        </div>
        <div class="table-row-group">
          {formattedHistory &&
            formattedHistory.map((element, index) => {
              if (Math.floor((currentMove - 1) / 2) === index) {
                if ((currentMove - 1) % 2 === 0) {
                  return (
                    <div class="table-row">
                      <div class="table-cell bg-cyan-200">{element[0]}</div>
                      <div class="table-cell ...">{element[1]}</div>
                    </div>
                  );
                } else {
                  return (
                    <div class="table-row">
                      <div class="table-cell">{element[0]}</div>
                      <div class="table-cell  bg-cyan-200">{element[1]}</div>
                    </div>
                  );
                }
              } else {
                return (
                  <div class="table-row">
                    <div class="table-cell ...">{element[0]}</div>
                    <div class="table-cell ...">{element[1]}</div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
}
