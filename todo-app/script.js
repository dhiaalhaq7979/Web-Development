// To-Do app: tasks are stored in the browser with localStorage
const STORAGE_KEY = "todo-app-tasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentFilter = "all";

const list = document.getElementById("taskList");
const input = document.getElementById("taskInput");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  const visible = tasks.filter((t) =>
    currentFilter === "all" ? true : currentFilter === "done" ? t.done : !t.done
  );
  if (visible.length === 0) {
    list.innerHTML = '<li class="empty">No tasks here.</li>';
  }
  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggle(task.id));

    const text = document.createElement("span");
    text.textContent = task.text; // textContent prevents HTML injection

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "\u2715";
    del.title = "Delete";
    del.addEventListener("click", () => remove(task.id));

    li.append(checkbox, text, del);
    list.appendChild(li);
  });
  const left = tasks.filter((t) => !t.done).length;
  document.getElementById("counter").textContent = left + (left === 1 ? " task left" : " tasks left");
}

function add(text) {
  tasks.push({ id: Date.now(), text, done: false });
  save();
  render();
}

function toggle(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  save();
  render();
}

function remove(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) add(text);
  input.value = "";
  input.focus();
});

document.querySelectorAll(".filters button").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  })
);

document.getElementById("clearDone").addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

render();
