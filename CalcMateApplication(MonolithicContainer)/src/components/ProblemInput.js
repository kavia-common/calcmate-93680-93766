import React, { useState } from "react";
import { solveCalculusProblem } from "../utils/solver";

// PUBLIC_INTERFACE
export default function ProblemInput({ onSolve, onError }) {
  const [problemType, setProblemType] = useState("derivative");
  const [input, setInput] = useState("");
  const [variable, setVariable] = useState("x");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  // Validate user input
  function validate() {
    if (!input.trim()) {
      return "Please enter a mathematical expression.";
    }
    if (problemType === "derivative" && (!order || isNaN(order) || order < 1 || order > 7)) {
      return "Derivative order should be between 1 and 7.";
    }
    if (!/^[a-zA-Z]$/.test(variable)) {
      return "Variable must be a single letter (e.g., x).";
    }
    return null;
  }

  // Handle submission
  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      onError(err);
      return;
    }
    setLoading(true);
    try {
      // Solve problem using local logic
      const entry = await solveCalculusProblem({
        problemType,
        input,
        variable,
        order
      });
      onSolve(entry);
    } catch (err) {
      onError("Failed to solve: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.1em" }}>
      <label>
        Problem Type:
        <select
          value={problemType}
          onChange={e => setProblemType(e.target.value)}
          style={{marginLeft:8, width:"auto", display:"inline-block"}}
        >
          <option value="derivative">Derivative</option>
          <option value="integral">Integral</option>
          <option value="limit">Limit</option>
        </select>
      </label>
      <label style={{marginLeft: "1em"}}>
        Variable:
        <input
          type="text"
          maxLength={1}
          style={{width: 30, display:"inline-block", marginLeft:8}}
          value={variable}
          onChange={e => setVariable(e.target.value.replace(/[^a-zA-Z]/g, ""))}
        />
      </label>
      <span style={{marginLeft:"1.1em"}}>
        {problemType === "derivative" && (
          <>
            <label>
              Order:
              <input
                type="number"
                min={1}
                max={7}
                style={{width:45, display:"inline-block", marginLeft:8}}
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
              />
            </label>
          </>
        )}
        {problemType === "limit" && (
          <>
            <label style={{marginLeft:8, fontStyle:'italic'}}>
              (format: limit_expr, e.g., <b>sin(x)/x as x->0</b>)
            </label>
          </>
        )}
      </span>
      <div style={{marginTop:"1em"}}>
        <label>
          Expression:
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={2}
            style={{resize:"vertical"}}
            placeholder={
              problemType === "derivative"
                ? "e.g. x^3 + 2x - sin(x)"
                : problemType === "integral"
                ? "e.g. exp(-x^2)"
                : "e.g. sin(x)/x as x->0"
            }
            autoFocus
          />
        </label>
      </div>
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Solving..." : "Solve"}
      </button>
    </form>
  );
}
