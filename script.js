let tasks = [
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
const errorMessage = document.querySelector("#error-message")
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

// Rendering tasks
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

function loadTheme() {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
        document.body.classList.add("dark")
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
        tasks = JSON.parse(savedTasks)
    }
}

let currentFilter = "all"
loadTheme()
loadTasks()
renderTasks()

// Theme button
toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark")
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light")
})

// Filter button
filters.forEach(filter => {
    filter.addEventListener("click", (event) => {
        filters.forEach(filter => {
            filter.classList.remove("active")
        })
        event.currentTarget.classList.add("active")
        currentFilter = event.currentTarget.dataset.filter
        renderTasks()
    })
})

// Task creation
taskForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const taskText = taskInput.value.trim()
    if (!taskText) {
        errorMessage.textContent = "Task cannot be empty"
        taskInput.classList.add("input-error")
        return
    }
    errorMessage.textContent = ""
    taskInput.classList.remove("input-error")
    const now = Date.now()
    const newTask = {
        // id: crypto.randomUUID(),
        id: now,
        text: taskText,
        completed: false,
        dateCreated: now
    }

    tasks.push(newTask)
    saveTasks()
    renderTasks()
    taskInput.value = ""
})

// Task completion
taskList.addEventListener("change", (event) => {
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
    saveTasks()
    renderTasks()
})

// Edit/delete task
taskList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-task")
    const editButton = event.target.closest(".edit-task")
    const cancelButton = event.target.closest(".cancel-edit")
    const saveButton = event.target.closest(".save-edit")

    // Delete task
    if (deleteButton) {
        const taskItem = deleteButton.closest(".task-item");
        const taskId = taskItem.dataset.id;
        const index = tasks.findIndex(task => String(task.id) === taskId)
        tasks.splice(index, 1)
        saveTasks()
        renderTasks()
    }
    // Edit task
    if (editButton) {
        const taskItem = editButton.closest(".task-item");
        const taskId = taskItem.dataset.id;
        const task = tasks.find(task => String(task.id) === taskId)
        const taskText = taskItem.querySelector(".task-text")

        const editInput = document.createElement("input")
        editInput.setAttribute("type" ,"text")
        editInput.classList.add("edit-input")
        editInput.setAttribute("value" ,task.text)

        taskText.replaceWith(editInput)
        editInput.focus()
        editInput.select()
        
        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault()
                const saveButton = taskItem.querySelector(".save-edit")
                saveButton.click()
            }
        })

        const deleteTaskButton = taskItem.querySelector(".delete-task")
        editButton.outerHTML = `
            <button class="cancel-edit" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
        `
        deleteTaskButton.outerHTML = `
            <button class="save-edit" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>
        `
    }
    // Cancel edit
    if (cancelButton) {
        renderTasks()
    }
    // Save edit
    if (saveButton) {
        const taskItem = saveButton.closest(".task-item");
        const taskId = taskItem.dataset.id;
        const task = tasks.find(task => String(task.id) === taskId)
        const editInput = taskItem.querySelector(".edit-input")

        const newText = editInput.value.trim()
        if (newText === "") {
            console.log("Cannot leave the task empty");
        } else {
            task.text = newText
            saveTasks()
            renderTasks()
        }
    }

})

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed)
    saveTasks()
    renderTasks()
})