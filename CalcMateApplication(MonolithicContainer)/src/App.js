import React, { useState, useRef } from "react";
import ProblemInput from "./components/ProblemInput";
import SolutionDisplay from "./components/SolutionDisplay";
import History from "./components/History";
import ExportButtons from "./components/ExportButtons";
import "./App.css";

export default function App() {
  // State hooks for solution output, error messages, and calculation history
  const [currentEntry, setCurrentEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const solutionRef = useRef();

  // Handler when problem is solved
  // PUBLIC_INTERFACE
  function handleSolve(entry) {
    setCurrentEntry(entry);
    setErrorMsg("");
    if (entry && entry.input) {
      setHistory((prev) => [entry, ...prev]);
    }
  }

  // Handler to clear error message
  function handleError(error) {
    setCurrentEntry(null);
    setErrorMsg(error);
  }

  // Handler to clear all session-based history
  // PUBLIC_INTERFACE
  function handleClearHistory() {
    setHistory([]);
    setCurrentEntry(null);
    setErrorMsg("");
  }

  // Handler: load a history entry as current
  // PUBLIC_INTERFACE
  function handleUseHistoryEntry(entry) {
    setCurrentEntry(entry);
    setErrorMsg("");
  }

  return (
    <div className="app-container">
      <h1>CalcMate</h1>
      <p style={{marginTop: "-1em", marginBottom: "1.5em", fontWeight: 400}}>
        <em>
          Your Calculus Learning Companion.<br />
          Input limits, derivatives, or integrals—see symbolic, numeric, and step-by-step solutions.
        </em>
      </p>
      <ProblemInput
        onSolve={handleSolve}
        onError={handleError}
      />
      <div ref={solutionRef}>
        <SolutionDisplay
          entry={currentEntry}
          errorMsg={errorMsg}
        />
      </div>
      {currentEntry && (
        <ExportButtons
          exportRef={solutionRef}
          entry={currentEntry}
        />
      )}
      <History
        history={history}
        onClear={handleClearHistory}
        onUse={handleUseHistoryEntry}
      />
      <footer style={{ textAlign: "center", marginTop: "1.4em", fontSize: "0.97em", color: "#888"}}>
        CalcMate &copy; 2024 | All calculations performed in your browser. No data is saved.<br/>
        <a href="https://katex.org/" target="_blank" rel="noopener noreferrer">Powered by KaTeX</a>
      </footer>
    </div>
  );
}
