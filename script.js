//javaScript for to-do webpage
console.log("Hello from JavaScript !!");

let tasks = JSON.parse(localStorage.getItem("tasks"))||[];

const taskinput = document.getElementById("taskinput");
const addbtn = document.getElementById("addbtn");
const tasklist = document.getElementById("tasklist");
const error = document.getElementById("error");

console.log(taskinput);
console.log(addbtn);
console.log(tasklist);
console.log(error);

function createTask(task){
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

        delbtn.addEventListener("click", function(){
        li.remove();
        const index = tasks.indexOf(task);
        tasks.splice(index,1);

        localStorage.setItem("tasks", JSON.stringify(tasks));
});
}

addbtn.addEventListener("click", function(){
    console.log(taskinput.value);
    const tasktext = taskinput.value.trim();
    
    if(tasktext !== ""){
        const task = {
            text : tasktext,
            completed :false
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        error.textContent ="";
        createTask(task);
        li.textContent = task.text;
        
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
for (const task of tasks){
    console.log(task);
    createTask(task);
}
