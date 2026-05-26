const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const notesContainer = document.getElementById("notesContainer");
const clearNotes = document.getElementById("clearNotes");
const searchInput = document.getElementById("searchInput");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

const notesCount = document.getElementById("notesCount");
const doneCount = document.getElementById("doneCount");

const menuLinks = document.querySelectorAll("nav a");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderNotes(filter = "") {
  notesContainer.innerHTML = "";

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(filter.toLowerCase()) ||
    note.text.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = `<p style="color:#cbd5e1;">Nenhuma anotação encontrada.</p>`;
  }

  filteredNotes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-card";

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.text}</p>
      <button onclick="deleteNote(${index})" class="delete-note">Apagar</button>
    `;

    notesContainer.appendChild(div);
  });

  notesCount.textContent = `${notes.length} salvas`;
}

function deleteNote(index) {
  if (!confirm("Deseja apagar esta anotação?")) return;

  notes.splice(index, 1);
  saveData();
  renderNotes(searchInput.value);
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.done ? "task done" : "task";

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✓</button>
        <button onclick="deleteTask(${index})">x</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  const doneTasks = tasks.filter(task => task.done).length;

  taskCounter.textContent = `${tasks.length} tarefas`;
  doneCount.textContent = `${doneTasks} finalizadas`;
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    alert("Preencha o título e a anotação.");
    return;
  }

  notes.unshift({
    title: noteTitle.value.trim(),
    text: noteText.value.trim()
  });

  noteForm.reset();
  saveData();
  renderNotes();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!taskInput.value.trim()) return;

  tasks.push({
    text: taskInput.value.trim(),
    done: false
  });

  taskInput.value = "";
  saveData();
  renderTasks();
});

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveData();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveData();
  renderTasks();
}

clearNotes.addEventListener("click", () => {
  if (!confirm("Deseja apagar todas as anotações?")) return;

  notes = [];
  saveData();
  renderNotes();
});

searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value);
});

function focusNote() {
  noteTitle.focus();
}

menuLinks.forEach(link => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    menuLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");

    const sectionId = link.dataset.section;
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

renderNotes();
renderTasks();