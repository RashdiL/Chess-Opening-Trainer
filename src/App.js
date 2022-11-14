import logo from "./logo.svg";
import "./App.css";
import Chessboard from "./components/Chessboard/Chessboard";
import Trainer from "./components/Trainer/Trainer";
const { uuid } = require("uuidv4");

function App() {
  return (
    <div>
      <Trainer />
    </div>
  );
}

export default App;
