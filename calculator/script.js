// Calculator without eval(): the expression is parsed with the shunting-yard algorithm
const screen = document.getElementById("screen");
const history = document.getElementById("history");
let expression = "";

function show() {
  screen.textContent = expression === "" ? "0" : expression.replace(/\*/g, "\u00d7").replace(/\//g, "\u00f7");
}

function tokenize(expr) {
  const tokens = expr.match(/\d*\.?\d+|[+\-*/%]/g) || [];
  // handle a leading minus or a minus right after another operator ("-5", "3*-2")
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const prev = out[out.length - 1];
    if (t === "-" && (prev === undefined || "+-*/".includes(prev)) && i + 1 < tokens.length) {
      out.push(String(-parseFloat(tokens[++i])));
    } else {
      out.push(t);
    }
  }
  return out;
}

function evaluate(expr) {
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };
  const nums = [];
  const ops = [];
  const apply = () => {
    const b = nums.pop(), a = nums.pop(), op = ops.pop();
    if (a === undefined || b === undefined) throw new Error("Syntax error");
    if (op === "/" && b === 0) throw new Error("Cannot divide by 0");
    nums.push(op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b);
  };
  for (const t of tokenize(expr)) {
    if (t === "%") { nums.push(nums.pop() / 100); continue; }
    if (t in prec) {
      while (ops.length && prec[ops[ops.length - 1]] >= prec[t]) apply();
      ops.push(t);
    } else {
      nums.push(parseFloat(t));
    }
  }
  while (ops.length) apply();
  if (nums.length !== 1 || Number.isNaN(nums[0])) throw new Error("Syntax error");
  return Math.round(nums[0] * 1e10) / 1e10;
}

function press(value) {
  const last = expression.slice(-1);
  if ("+*/%".includes(value) && (expression === "" || "+-*/".includes(last))) return;
  if (value === ".") {
    const lastNumber = expression.split(/[+\-*/]/).pop();
    if (lastNumber.includes(".")) return;
  }
  expression += value;
  show();
}

function equals() {
  if (!expression) return;
  try {
    const result = evaluate(expression);
    history.textContent = screen.textContent + " =";
    expression = String(result);
  } catch (err) {
    history.textContent = err.message;
    expression = "";
  }
  show();
}

document.querySelectorAll(".keys button").forEach((btn) =>
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "clear") { expression = ""; history.textContent = ""; show(); }
    else if (action === "back") { expression = expression.slice(0, -1); show(); }
    else if (action === "equals") equals();
    else press(btn.dataset.value);
  })
);

document.addEventListener("keydown", (e) => {
  if (/^[0-9+\-*/.%]$/.test(e.key)) press(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
  else if (e.key === "Backspace") { expression = expression.slice(0, -1); show(); }
  else if (e.key === "Escape") { expression = ""; history.textContent = ""; show(); }
});
