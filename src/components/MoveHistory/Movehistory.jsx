import { useEffect, useState } from "react";
export default function Movehistory({ history }) {
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
    console.log(formatHistory(history));
    setFormattedHistory(formatHistory(history));
  }, [history]);
  return (
    <div className="overflow-auto h-60">
      <table>
        <tbody>
          <tr>
            <th>White</th>
            <th>Black</th>
          </tr>
          {formattedHistory &&
            formattedHistory.map((element) => {
              console.log(`printing ${element[0]}`);
              return (
                <tr>
                  <td>{element[0]}</td>
                  <td>{element[1]}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
