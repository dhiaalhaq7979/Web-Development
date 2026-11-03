// Live form validation with plain JavaScript
const form = document.getElementById("signupForm");
const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirm: document.getElementById("confirm"),
};

function setState(input, message) {
  const field = input.parentElement;
  field.querySelector("small").textContent = message || "";
  field.classList.toggle("error", Boolean(message));
  field.classList.toggle("ok", !message);
  return !message;
}

function passwordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0 - 4
}

const rules = {
  name: (v) => (v.trim().length < 3 ? "Name must be at least 3 characters." : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
  password: (v) => (passwordScore(v) < 3 ? "Use 8+ characters with an uppercase letter, a number or a symbol." : ""),
  confirm: (v) => (v !== fields.password.value || !v ? "Passwords do not match." : ""),
};

function validate(key) {
  return setState(fields[key], rules[key](fields[key].value));
}

fields.password.addEventListener("input", () => {
  const score = passwordScore(fields.password.value);
  const bar = document.getElementById("strengthBar");
  const colors = ["#f85149", "#f85149", "#d29922", "#3fb950", "#3fb950"];
  bar.style.width = (score / 4) * 100 + "%";
  bar.style.background = colors[score];
});

Object.keys(fields).forEach((key) => fields[key].addEventListener("blur", () => validate(key)));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const results = Object.keys(fields).map(validate);
  const allValid = results.every(Boolean);
  document.getElementById("successMsg").hidden = !allValid;
  if (allValid) form.reset();
});
