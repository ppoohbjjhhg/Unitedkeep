const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const notesContainer = document.getElementById("notesContainer");
const clearNotes = document.getElementById("clearNotes");
const searchInput = document.getElementById("searchInput");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDeadline = document.getElementById("taskDeadline");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

const notesCount = document.getElementById("notesCount");
const doneCount = document.getElementById("doneCount");
const expiredCount = document.getElementById("expiredCount");

const menuLinks = document.querySelectorAll("nav a");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTaskIndex = null;

function saveData() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(dateString) {
  if (!dateString) return "Sem prazo";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getTaskStatus(task) {
  if (task.done) {
    return {
      text: "Concluída",
      className: "done"
    };
  }

  if (task.deadline && task.deadline < getTodayDate()) {
    return {
      text: "Prazo expirado",
      className: "expired"
    };
  }

  return {
    text: "Em aberto",
    className: "open"
  };
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

  if (tasks.length === 0) {
    taskList.innerHTML = `<p style="color:#cbd5e1;">Nenhuma tarefa cadastrada.</p>`;
  }

  tasks.forEach((task, index) => {
    const status = getTaskStatus(task);

    const li = document.createElement("li");
    li.className = task.done ? "task done" : "task";

    li.innerHTML = `
      <div class="task-main">
        <div>
          <p class="task-title">${task.text}</p>

          <div class="task-dates">
            <span>Criada em: ${formatDate(task.createdAt)}</span>
            <span>Prazo: ${formatDate(task.deadline)}</span>
          </div>
        </div>

        <span class="status ${status.className}">
          ${status.text}
        </span>
      </div>

      <div class="task-actions">
        <button class="btn-done" onclick="toggleTask(${index})">
          ${task.done ? "Reabrir" : "Concluir"}
        </button>

        <button class="btn-edit" onclick="editTask(${index})">
          Editar
        </button>

        <button class="btn-delete" onclick="deleteTask(${index})">
          Excluir
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  const doneTasks = tasks.filter(task => task.done).length;
  const expiredTasks = tasks.filter(task => {
    const status = getTaskStatus(task);
    return status.className === "expired";
  }).length;

  taskCounter.textContent = `${tasks.length} tarefas`;
  doneCount.textContent = `${doneTasks} finalizadas`;
  expiredCount.textContent = `${expiredTasks} expiradas`;
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

  if (!taskInput.value.trim()) {
    alert("Digite uma tarefa.");
    return;
  }

  if (!taskDeadline.value) {
    alert("Defina um prazo para a tarefa.");
    return;
  }

  if (editingTaskIndex !== null) {
    tasks[editingTaskIndex].text = taskInput.value.trim();
    tasks[editingTaskIndex].deadline = taskDeadline.value;

    editingTaskIndex = null;
    taskForm.querySelector("button").textContent = "+";
  } else {
    tasks.push({
      text: taskInput.value.trim(),
      createdAt: getTodayDate(),
      deadline: taskDeadline.value,
      done: false
    });
  }

  taskInput.value = "";
  taskDeadline.value = "";

  saveData();
  renderTasks();
});

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveData();
  renderTasks();
}

function editTask(index) {
  taskInput.value = tasks[index].text;
  taskDeadline.value = tasks[index].deadline;

  editingTaskIndex = index;
  taskForm.querySelector("button").textContent = "✓";

  document.getElementById("tarefas").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteTask(index) {
  if (!confirm("Deseja excluir esta tarefa?")) return;

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