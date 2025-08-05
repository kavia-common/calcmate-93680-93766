import React from "react";
import { BlockMath } from "react-katex";

// PUBLIC_INTERFACE
export default function History({ history, onClear, onUse }) {
  if (!history || history.length === 0) {
    return null;
  }
  return (
    <div style={{
      marginTop: "2.2em",
      borderTop: "1px solid #e6e6e6",
      paddingTop: "1.3em",
    }}>
      <div>
        <b>Session History</b>
        <button
          style={{
            float: "right",
            background: "#f5dada",
            border: "1px solid #ea9c9c",
            color: "#a31e1e",
            borderRadius: "6px",
            padding: "0.26em 0.8em",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      <div>
        {history.map((h, i) => (
          <div
            className="history-entry"
            key={i}
            style={{
              margin: "1.1em 0",
              border: "1px solid #eaeaea",
              borderRadius: "6px",
              background: "#eef8ff",
              padding: "0.7em 0.9em"
            }}
          >
            <b>{capitalize(h.problemType)}:</b> <BlockMath>{h.inputLatex || h.input}</BlockMath>
            <div>
              <b>Result:</b>{" "}
              <span style={{ color: "#1b6" }}>
                {h.numericResult !== undefined ? h.numericResult : h.solutionLatex}
              </span>
            </div>
            {h.steps && h.steps.length > 0 && (
              <details style={{marginTop:"0.2em"}}>
                <summary style={{cursor: "pointer"}}>Steps</summary>
                <ol>
                  {h.steps.map((step, j) => <li key={j}>{step}</li>)}
                </ol>
              </details>
            )}
            <button
              className="button secondary"
              style={{float: "right", fontSize:"0.95em", padding:"0.3em 0.8em"}}
              onClick={() => onUse(h)}
            >
              Show
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
