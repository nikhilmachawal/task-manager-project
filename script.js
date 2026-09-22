const tasks = [
    {
        id: 1,
        text: "Get Started",
        completed: true,
        // "dateCreated": new Date("1 Sep 2026").getTime()
        "dateCreated": Date.now()
    }
]
const toggleTheme = document.querySelector("#theme-toggle")
const taskForm = document.getElementById("task-form")
const taskInput = document.getElementById("task-input")
const addTask = document.getElementById("add-task")
const filters = document.querySelectorAll(".filter-btn")
const filterAll = document.querySelector('[data-filter="all"]')
const filterActive = document.querySelector('[data-filter="active"]')
const filterCompleted = document.querySelector('[data-filter="completed"]')
const taskList = document.querySelector(".task-list")
const tasksRemaining = document.querySelector(".tasks-remaining")
const totalTasks = document.querySelector(".total-count")
const activeTasks = document.querySelector(".active-count")
const completedTasks = document.querySelector(".completed-count")
const clearCompletedBtn = document.querySelector("#clear-completed-tasks")

function renderTasks() {
    taskList.textContent = ""

    let visibleTasks;

    if (currentFilter === "all") {
        visibleTasks = tasks;
    }
    else if (currentFilter === "active") {
        visibleTasks = tasks.filter(task => !task.completed)
    }
    else if (currentFilter === "completed") {
        visibleTasks = tasks.filter(task => task.completed)
    }

    visibleTasks.forEach(task => {
        const date = new Date(task.dateCreated);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        taskList.insertAdjacentHTML("afterbegin", `
            <li class="task-item" data-id="${task.id}">
                <label>
                    <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
                    <span class="task-text">${task.text}</span>
                </label>
                <div class="options">
                    <span class="task-date">${formattedDate}</span>
                    <button class="edit-task" type="button" aria-label="Edit task">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    </button>
                    <button class="delete-task" type="button" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </div>
            </li>
        `)
    })

    const total = tasks.length
    const active = tasks.filter(task => !task.completed).length
    const completed = total - active

    filterAll.textContent = `All (${total})`
    filterActive.textContent = `Active (${active})`
    filterCompleted.textContent = `Completed (${completed})`

    tasksRemaining.textContent = `${active} tasks remaining`
    totalTasks.textContent = `${total} total •`
    activeTasks.textContent = `${active} active •`
    completedTasks.textContent = `${completed} completed`
}

let currentFilter = "all"
renderTasks()

taskForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const now = Date.now();
    const newTask = {
        // id: crypto.randomUUID(),
        id: now,
        text: taskInput.value.trim(),
        completed: false,
        dateCreated: now
    }

    tasks.push(newTask)
    renderTasks()
    taskInput.value = ""
})

taskList.addEventListener("change", (event) => {
    console.log(event.target);
    if (!event.target.matches(".task-checkbox")) return
    const taskItem = event.target.closest(".task-item")
    const taskId = taskItem.dataset.id
    // tasks.forEach(task => {
    //     if (String(task.id) === taskId) {
    //         task.completed = !task.completed
    //     }
    // })
    const task = tasks.find(task => String(task.id) === taskId)
    if (task) {
        task.completed = !task.completed
    }
    renderTasks()
})

function deleteTask() {
    // Code
}




















// const checkbox = document.querySelector(".task-checkbox")
// checkbox.toggleAttribute("checked")
// checkbox.checked = checkbox.hasAttribute("checked")