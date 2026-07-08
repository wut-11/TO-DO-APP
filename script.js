//javaScript for to-do webpage
console.log("Hello from JavaScript !!");

let tasks = JSON.parse(localStorage.getItem("tasks"))||[];
let editingTask = null;

const taskinput = document.getElementById("taskinput");
const addbtn = document.getElementById("addbtn");
const tasklist = document.getElementById("tasklist");
const error = document.getElementById("error");
const mode = document.getElementById("mode-toggle");
const themes = document.querySelectorAll(".theme");

const savedMode = localStorage.getItem("mode");
if(savedMode){
    document.body.dataset.mode = savedMode;
    if(savedMode === "dark"){
        mode.textContent = "🌃";
    }else{
        mode.textContent="🏙️";
    }
}
const savedTheme = localStorage.getItem("themes");
if(savedTheme){
    document.body.dataset.theme = savedTheme;
    if(savedTheme === "jelly"){
        themes.textContent = "🪼";
    }else if(savedTheme === "dino"){
        themes.textContent = "🦖";
    }else{
        themes.textContent = "🌸";
    }
}

console.log(taskinput);
console.log(addbtn);
console.log(tasklist);
console.log(error);

function createTask(task, index){
        const li = document.createElement("li");
        li.textContent = task.text;
        if(task.completed){
            li.classList.add("completed");
        }

        li.addEventListener("click", function(){
            task.completed = !task.completed;
            li.classList.toggle("completed"); 
            localStorage.setItem("tasks", JSON.stringify(tasks));
        });

        taskinput.value = "";
        tasklist.appendChild(li);

        const delbtn = document.createElement("button");
        delbtn.classList.add("delbtn");

        const icon = document.createElement("span");
        icon.classList.add("material-symbols-outlined");
        icon.textContent="delete";
        li.appendChild(delbtn);
        delbtn.appendChild(icon);

        delbtn.addEventListener("click", function(event){
            event.stopPropagation();
            li.remove();
            tasks.splice(index,1);

            localStorage.setItem("tasks", JSON.stringify(tasks));
        });

        const editbtn = document.createElement("button");
        editbtn.classList.add("editbtn");

        const icon2 = document.createElement("span");
        icon2.classList.add("material-symbols-outlined");
        icon2.textContent="edit";

        li.appendChild(editbtn);
        editbtn.appendChild(icon2);

        editbtn.addEventListener("click", function(event){
            event.stopPropagation();
            editingTask = index;
            taskinput.value = task.text;
            addbtn.textContent = "Save";
        });
}

addbtn.addEventListener("click", function(){
    console.log(taskinput.value);
    const tasktext = taskinput.value.trim();
    
    if(tasktext !== ""){
        if(editingTask !== null){
            tasks[editingTask].text= tasktext;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            tasklist.innerHTML = "";
            editingTask = null;
            addbtn.textContent = "Add";

            tasks.forEach(function(task, index){
            createTask(task, index);
            });
        }
        else{
        const task = {
            text : tasktext,
            completed :false
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        error.textContent ="";
        createTask(task, tasks.length-1);
        }        
    }

    else{
        error.textContent = "Please enter a task!";
    }
});

taskinput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addbtn.click();
    }

});
tasks.forEach(function(task, index){
    console.log(task);
    createTask(task, index);
});
themes.forEach(function (theme) {
  theme.addEventListener("click", function () {
    document.body.dataset.theme = this.dataset.theme;
    localStorage.setItem("themes", document.body.dataset.theme);
    console.log(document.body.dataset.theme);
  });
});

mode.addEventListener("click", function () {
  if (document.body.dataset.mode === "light") {
    document.body.dataset.mode = "dark";
    mode.textContent="🌃";
  } else {
    document.body.dataset.mode = "light";
    mode.textContent="🏙️";
  }
  localStorage.setItem("mode", document.body.dataset.mode);
  console.log(document.body.dataset.mode);
});

