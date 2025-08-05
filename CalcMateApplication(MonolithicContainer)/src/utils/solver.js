/**
 * CalcMate solver logic—for derivatives, integrals, and limits
 * Uses mathjs for evaluation; provides LaTeX rendering and simple step explanations.
 * All logic runs client-side with no external dependencies other than mathjs/katex.
 */
import { create, all } from "mathjs";
const math = create(all, {});

// Convert mathjs AST to LaTeX, fallback to input if fails
function toLatexSafe(expr) {
  try {
    return math.parse(expr).toTex();
  } catch {
    return expr;
  }
}

// Derivative step explanation generator
function derivativeSteps(expr, variable, order) {
  if (order === 1) {
    return [`Compute the first derivative of ${expr} with respect to ${variable}.`];
  }
  let steps = [
    `Start with the function: ${expr}.`
  ];
  for (let i = 1; i <= order; ++i) {
    steps.push(`Compute the ${ordinal(i)} derivative with respect to ${variable}.`);
  }
  return steps;
}

function ordinal(n) {
  if (n === 1) return 'first';
  if (n === 2) return 'second';
  if (n === 3) return 'third';
  return n + 'th';
}

// Integral step explanation generator
function integralSteps(expr, variable) {
  return [
    `Integrate the function ${expr} with respect to ${variable}.`
  ];
}

// Limit parsing "expr as x->a"
function parseLimitInput(input) {
  // e.g., "sin(x)/x as x->0"
  const match = input.match(/(.+)\s+as\s+([a-zA-Z])\s*->\s*([-\w.]+)/i);
  if (!match) return null;
  const [_, expr, variable, atValue] = match;
  return { expr: expr.trim(), variable: variable.trim(), atValue: atValue.trim() };
}

// Limit step explanation
function limitSteps(expr, variable, atValue) {
  let steps = [
    `Substitute ${variable} = ${atValue} into ${expr}.`,
    `If direct substitution produces 0/0 or ∞/∞, consider L'Hôpital's Rule or algebraic manipulation.`
  ];
  return steps;
}

// PUBLIC_INTERFACE
export async function solveCalculusProblem({ problemType, input, variable, order = 1 }) {
  let solutionLatex, steps, numericResult, inputLatex;

  if (problemType === "derivative") {
    // Try mathjs differentiation
    let node;
    try {
      node = math.parse(input);
    } catch (e) {
      throw new Error("Invalid mathematical expression for derivative.");
    }
    inputLatex = node.toTex({ parenthesis: "keep" });
    let derivative = node;
    for (let i = 0; i < order; ++i) {
      derivative = math.derivative(derivative, variable);
      steps = derivativeSteps(input, variable, order);
    }
    solutionLatex = derivative.toTex();
    try {
      let scope = {};
      numericResult = math.evaluate(derivative.toString(), scope);
      // If numericResult is an object, drop numeric display
      if (typeof numericResult !== "number" && typeof numericResult !== "bigint") numericResult = undefined;
    } catch {
      numericResult = undefined;
    }
    return {
      problemType,
      input,
      inputLatex,
      solutionLatex,
      steps,
      numericResult
    };
  } else if (problemType === "integral") {
    // Use mathjs for integration (symbolic limited), fallback to numeric where possible
    let node;
    try {
      node = math.parse(input);
    } catch (e) {
      throw new Error("Invalid mathematical expression for integral.");
    }
    inputLatex = node.toTex({ parenthesis: "keep" });
    // Symbolic integration is only limited in mathjs, so let's display the definite integral for x=0..1 if possible.
    // Otherwise, state we attempted a numerical approximation.
    solutionLatex = "\\int " + inputLatex + " \\, d" + variable;
    let approx;
    try {
      approx = math.integrate
        ? math.integrate(node, variable).toTex()
        : null;
      if (approx) solutionLatex = approx;
    } catch {}
    // Numeric: definite from 0 to 1
    try {
      const numeric = math.evaluate(
        `integrate(${input}, ${variable}, 0, 1)`
      );
      numericResult = Math.round(numeric * 1e8) / 1e8;
      steps = [
        ...integralSteps(input, variable),
        "Numeric value computed as a definite integral from 0 to 1."
      ];
    } catch {
      steps = [
        ...integralSteps(input, variable),
        "Unable to numerically evaluate; integral kept as symbolic."
      ];
      numericResult = undefined;
    }
    return {
      problemType,
      input,
      inputLatex,
      solutionLatex,
      steps,
      numericResult
    };
  } else if (problemType === "limit") {
    // Parse limit input and parse expression
    const parsed = parseLimitInput(input);
    if (!parsed)
      throw new Error(
        "Invalid format for limit. Please format as: expr as x->a, e.g. sin(x)/x as x->0"
      );
    const { expr, variable, atValue } = parsed;
    let node;
    try {
      node = math.parse(expr);
    } catch (e) {
      throw new Error("Invalid expression in limit.");
    }
    inputLatex = node.toTex({ parenthesis: "keep" }) + `\\text{ as } ${variable} \\to ${atValue}`;
    let val;
    try {
      // Try direct substitution first, otherwise try around atValue numerically.
      let isInfinity = atValue === "inf" || atValue === "+inf" || atValue === "-inf";
      let substValue = isInfinity
        ? (atValue[0] === "-" ? -1e6 : 1e6)
        : parseFloat(atValue);
      val = math.evaluate(expr, { [variable]: substValue });
      numericResult = Math.round(val * 1e8) / 1e8;
    } catch (e) {
      numericResult = undefined;
    }
    // Symbolic
    solutionLatex = `\\lim_{${variable} \\to ${atValue}} \\left[${node.toTex()}\\right]`;
    steps = limitSteps(expr, variable, atValue);
    return {
      problemType,
      input,
      inputLatex,
      solutionLatex,
      steps,
      numericResult
    };
  }
  throw new Error("Unrecognized problem type: " + problemType);
}
