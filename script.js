// javaScript for to-do webpage
console.log("Hello from JavaScript !!");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTask = null;

const taskinput = document.getElementById("taskinput");
const addbtn = document.getElementById("addbtn");
const taskArea = document.getElementById("taskArea");
const error = document.getElementById("error");

const mode = document.getElementById("mode-toggle");
const themes = document.querySelectorAll(".theme");

const levelGap = 210;

const leftX = 10;
const rightX = 1140;

const centreX = window.innerWidth / 2 - 120;

function getAnchor(index) {
    const y = index * levelGap;
    let x;

    if (index % 2 === 0) {
        x = leftX;
    } 
    else {
        x = rightX;
    }
    return {
        x: x, y: y
    };
}

function moveCard(card, x, y) {
    card.style.transform = `translate(${x}px, ${y}px)`;
}

function updateCardPositions() {
    const cards = document.querySelectorAll(".task-card");

    cards.forEach(function(card) {
        const index = Number(card.dataset.index);
        const pos = getAnchor(index);

        if (index !== activeLevel) {
            moveCard(card, pos.x, pos.y);
        }
    });

    setTimeout(function() {
        cards.forEach(function(card) {
            const index = Number(card.dataset.index);

            if (index === activeLevel) {
                const pos = getAnchor(index);
                moveCard(card, centreX, pos.y);
            }
        });
    }, 200);
}

let activeLevel = 0;

function createTask(task, index) {

    const card = document.createElement("div");
    card.classList.add("task-card");
    card.dataset.id = task.id;
    card.dataset.index = index;

    const text = document.createElement("p");
    text.textContent = task.text;
    card.appendChild(text);

    const pos = getAnchor(index);
    moveCard(card, pos.x, pos.y);

    if (task.completed) {
        card.classList.add("completed");
    }

    card.addEventListener("click", function() {
        task.completed = !task.completed;
        card.classList.toggle("completed");

        localStorage.setItem("tasks",JSON.stringify(tasks));
    });

    const delbtn = document.createElement("button");
    delbtn.classList.add("delbtn");

    const icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.textContent = "delete";

    delbtn.appendChild(icon);
    card.appendChild(delbtn);

    delbtn.addEventListener("click", function(event) {
        event.stopPropagation();

        tasks = tasks.filter(function(t) {
            return t.id !== task.id;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    });

    const editbtn = document.createElement("button");
    editbtn.classList.add("editbtn");

    const icon2 = document.createElement("span");
    icon2.classList.add("material-symbols-outlined");
    icon2.textContent = "edit";

    editbtn.appendChild(icon2);
    card.appendChild(editbtn);

    editbtn.addEventListener("click", function(event) {
        event.stopPropagation();
        editingTask = task.id;
        taskinput.value = task.text;
        addbtn.textContent = "Save";
    });

    taskArea.appendChild(card);
}

function renderTasks() {
    taskArea.innerHTML = "";

    tasks.forEach(function(task, index) {
        createTask(task, index);
    });

    updateTaskAreaHeight();
    updateCardPositions();
}

addbtn.addEventListener("click", function() {
    const tasktext = taskinput.value.trim();

    if (tasktext === "") {
        error.textContent = "Please enter a task!";
        return;
    }

    error.textContent = "";

    if (editingTask !== null) {
        const taskToEdit = tasks.find(function(task) {
            return task.id === editingTask;
        });

        taskToEdit.text = tasktext;
        editingTask = null;
        addbtn.textContent = "Add";
    }

    else {
        const task = {
            id: Date.now(),
            text: tasktext,
            completed: false
        };
        tasks.push(task);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskinput.value = "";
    renderTasks();
});

taskinput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addbtn.click();
    }
});

function updateTaskAreaHeight() {
    const numberOfTasks = tasks.length;
    if (numberOfTasks === 0) {
        taskArea.style.height = "0px";
        return;
    }
    taskArea.style.height = `${numberOfTasks * levelGap + 120}px`;
}

document.addEventListener("mousemove", function(event) {
    if (tasks.length === 0) {
        return;
    }
    const taskAreaTop = taskArea.getBoundingClientRect().top + window.scrollY;
    const mouseY = event.clientY + window.scrollY;
    const relativeY = mouseY - taskAreaTop;

    let level = Math.floor(relativeY / levelGap);

    if (level < 0) {
        level = 0;
    }
    if (level >= tasks.length) {
        level = tasks.length - 1;
    }
    if (level === activeLevel) {
        return;
    }
    activeLevel = level;
    updateCardPositions();
});

themes.forEach(function(theme) {
    theme.addEventListener("click", function() {
        document.body.dataset.theme = this.dataset.theme;
        localStorage.setItem("themes", this.dataset.theme);
    });
});

mode.addEventListener("click", function() {
    if (document.body.dataset.mode === "light") {
        document.body.dataset.mode = "dark";
        mode.textContent = "🌃";
    } 
    else {
        document.body.dataset.mode = "light";
        mode.textContent = "🏙️";
    }
    localStorage.setItem("mode", document.body.dataset.mode);
});

const savedMode = localStorage.getItem("mode");


if (savedMode) {
    document.body.dataset.mode = savedMode;

    if (savedMode === "dark") {
        mode.textContent = "🌃";
    } 
    else {
        mode.textContent = "🏙️";
    }
}

const savedTheme = localStorage.getItem("themes");

if (savedTheme) {
    document.body.dataset.theme = savedTheme;
}

renderTasks();
