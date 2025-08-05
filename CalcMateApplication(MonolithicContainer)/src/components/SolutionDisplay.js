import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// PUBLIC_INTERFACE
export default function SolutionDisplay({ entry, errorMsg }) {
  if (errorMsg) {
    return <div className="error-msg">{errorMsg}</div>;
  }
  if (!entry) {
    return null;
  }
  return (
    <div className="solution-box">
      <div style={{ fontWeight: 550, marginBottom: "0.4em" }}>
        <span>Problem Type: {capitalize(entry.problemType)}</span>
      </div>
      <div>
        <span style={{ fontSize: "1.02em", color: "#344" }}>
          <b>Input:</b> <BlockMath>{entry.inputLatex || entry.input}</BlockMath>
        </span>
      </div>
      <div className="solution-latex">
        <b>Symbolic Solution:</b>
        <BlockMath>{entry.solutionLatex}</BlockMath>
      </div>
      <div>
        {entry.numericResult !== undefined && (
          <div>
            <b>Numeric Value: </b>
            <span style={{ color: "#095" }}>{entry.numericResult}</span>
          </div>
        )}
      </div>
      {entry.steps && entry.steps.length > 0 && (
        <div style={{ marginTop: "0.9em" }}>
          <b>Step-by-step:</b>
          <ol>
            {entry.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// Helper
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
