const container = document.getElementById("container");
const tasksContainer = document.getElementById("tasks-container");
const addTaskIcon = document.getElementById("add-task-icon");
const dayMoodToggler = document.getElementById("day-mood-toggler");
const favicon = document.getElementById("favicon");

let tasksArray = JSON.parse(localStorage.getItem("tasks")) ?? [];
const historyPattern = /((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/[12]\d{3})/;

// Render tasks in the page
function renderTasks() {
  tasksContainer.innerHTML = "";
  let index = 0;

  for (let i = 0; i < tasksArray.length; i++) {
    let newTask = `
    <div class="todo-item flex ${tasksArray[i].isCompleted ? "completed" : ""}">
    <div class="task-info">
      <h3 class="${tasksArray[i].isCompleted ? "completed-task-title" : ""}">${
      tasksArray[i].title
    }</h3>
      <i class="icon-calendar history-icon"
        ><span class="history">${tasksArray[i].date}</span></i
      >
    </div>
    <div class="task-operations">
      <i onclick="editTask(${index})" class="icon-edit"></i>
      ${
        tasksArray[i].isCompleted
          ? `<i onclick="toggleTaskCompletion(${index})" class="icon-cancel-circle"></i>`
          : `<i onclick="toggleTaskCompletion(${index})" class="icon-ok-circle"></i>`
      }

      <i onclick="deleteTask(${index})" class="icon-trash"></i>
    </div>
  </div>
    `;

    tasksContainer.innerHTML += newTask;
    index++;
  }

  if (tasksArray.length > 0) {
    tasksContainer.innerHTML += `
      <div class="delete-all-container">
        <button 
          id="delete-all-tasks-btn" 
          class="delete-all-btn delete-btn">
          Delete all your ${index} tasks
        </button>
      </div>
    `;
  } else {
    tasksContainer.innerHTML = `
    <div class="before-todo flex">
      <h2>No tasks here yet.</h2>
    </div>
  `;
  }
  saveDateToLocalStorage("tasks", tasksArray);
}
renderTasks();

// Create a new task
addTaskIcon.addEventListener("click", (e) => {
  customModal(
    `Add new task!`,
    `<input
      type="text"
      id="add-task-input"
      class="input-text"
      placeholder="Add task!"
      required
      />`,
    `<input
      type="text"
      id="add-task-input-history"
      class="input-text"
      placeholder="History: 00/00/0000"
      required
      />`,
    `<p class="message ds-none-toggler">Write a title and History format: 00/00/0000</p>`,
    `adding-task-confirmation`,
    "",
    `Add Task`
  );

  // Add new task to tasksArray
  function addNewTask() {
    if (
      addTaskInput.value === "" ||
      !historyPattern.test(addTaskInputHistory.value)
    ) {
      message.classList.remove("ds-none-toggler");
    } else {
      let taskTitle = addTaskInput.value;
      let taskHistory = addTaskInputHistory.value;

      let taskObj = {
        title: taskTitle,
        date: taskHistory,
        isCompleted: false,
      };
      tasksArray.push(taskObj);
      renderTasks();

      addTaskInput.value = "";
      closeModal();
    }
  }

  const addingTaskConfirmation = document.getElementById(
    "adding-task-confirmation"
  );

  const addTaskInput = document.getElementById("add-task-input");
  const addTaskInputHistory = document.getElementById("add-task-input-history");
  const message = document.querySelector(".message");

  addingTaskConfirmation.addEventListener("click", (e) => {
    addNewTask();
  });

  // Add a new task by pressing the enter key
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addNewTask();
    }
  });

  addTaskInput.focus();

  saveDateToLocalStorage("tasks", tasksArray);
});

// Delete a task
function deleteTask(index) {
  let task = tasksArray[index];
  customModal(
    `Delete task!`,
    `<p class="delete-message">
      Are you sure you want to delete <span>"${task.title}"</span> task it's going to be deleted Permanently!
    </p>`,
    "",
    "",
    `deleting-task-confirmation`,
    "delete-btn",
    `Delete Task`
  );

  let deletingTaskConfirmation = document.getElementById(
    "deleting-task-confirmation"
  );

  deletingTaskConfirmation.addEventListener("click", (e) => {
    tasksArray.splice(index, 1);
    renderTasks();
    closeModal();
  });

  saveDateToLocalStorage("tasks", tasksArray);
}

// Edit task
function editTask(index) {
  let task = tasksArray[index];
  customModal(
    `Edit task!`,
    `<input
      type="text"
      id="edit-task-input"
      class="input-text"
      placeholder="Edit task!"
      required
      />`,
    `<input
      type="text"
      id="edit-task-input-history"
      class="input-text"
      placeholder="Edit history: 00/00/0000"
      required
      />`,
    `<p class="message ds-none-toggler">Edit title or History format: 00/00/0000</p>`,
    `editing-task-confirmation`,
    "",
    `Edit Task`
  );

  // Edit task
  function confirmingEditingTask() {
    if (
      editTaskInput.value === "" ||
      !historyPattern.test(editTaskInputHistory.value)
    ) {
      message.classList.remove("ds-none-toggler");
    } else {
      task.title = editTaskInput.value;
      task.date = editTaskInputHistory.value;
      editTaskInput.value = "";

      closeModal();
    }
  }

  let editingTaskConfirmation = document.getElementById(
    "editing-task-confirmation"
  );

  const editTaskInput = document.getElementById("edit-task-input");
  const editTaskInputHistory = document.getElementById(
    "edit-task-input-history"
  );
  const message = document.querySelector(".message");

  editTaskInput.value = task.title;
  editTaskInputHistory.value = task.date;

  editingTaskConfirmation.addEventListener("click", (e) => {
    confirmingEditingTask();
  });

  // Edit a task by pressing the enter key
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      confirmingEditingTask();
    }
  });

  editTaskInput.focus();

  saveDateToLocalStorage("tasks", tasksArray);
}

// Toggle task completion
function toggleTaskCompletion(index) {
  let task = tasksArray[index];
  task.isCompleted = !task.isCompleted;
  renderTasks();
  saveDateToLocalStorage("tasks", tasksArray);
}

// Delete all tasks
container.addEventListener("click", (e) => {
  if (e.target.id === "delete-all-tasks-btn") {
    customModal(
      `Delete All tasks!`,
      `<p class="delete-message">
        Are you sure you want to delete all of your 
        <span>"${tasksArray.length}"</span> 
        tasks it's going to be deleted Permanently!
      </p>`,
      "",
      "",
      `deleting-all-tasks-confirmation`,
      "delete-btn",
      `Delete All Tasks`
    );

    let deletingAllTasksConfirmation = document.getElementById(
      "deleting-all-tasks-confirmation"
    );

    deletingAllTasksConfirmation.addEventListener("click", (e) => {
      tasksArray = [];
      localStorage.clear();
      renderTasks();
      closeModal();
    });
  }
});

// Save date to localStorage
function saveDateToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Dark & Light Theme
dayMoodToggler.addEventListener("click", (e) => {
  if (e.target.classList.contains("icon-moon-inv")) {
    lightTheme();
  } else {
    darkTheme();
  }
});

function lightTheme() {
  localStorage.setItem("theme", "light");
  document.body.classList.add("light-theme");
  favicon.href = "favicons/light-favicon-icon.png";
  dayMoodToggler.className = "icon-sun-inv";
}

function darkTheme() {
  localStorage.setItem("theme", null);
  dayMoodToggler.className = "icon-moon-inv";
  favicon.href = "favicons/dark-favicon-icon.png";
  document.body.classList.remove("light-theme");
}

if (localStorage.getItem("theme") === "light") {
  lightTheme();
} else {
  darkTheme();
}
