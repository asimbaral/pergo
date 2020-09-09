//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const APIURL = 'http://localhost:5000/mews';

var type = "Custom Goals";

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener('click', filterTodo);
//Functions
function addTodo(event){
    //PREVENT FORM FROM SUBMITTING
    event.preventDefault();
    
    //Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    newTodo.id = (type.replace(/\s+/g, '-'));
    todoDiv.appendChild(newTodo);
    //ADD TODO TO LOCALSTORAGE
    saveLocalTodos(todoInput.value);
    //CHECK MARK BUTTON 
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //CHECK trash BUTTON 
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //APPEND TO LIST
    
    todoList.appendChild(todoDiv);
    //CLEAR TODO INPUT VALUE
    sendGoals("Asim", "Just started: " + todoInput.value);

    todoInput.value = "";
}
function sendGoals(nm, ct){
    name = nm; 
    content = ct;
    const goal = {
        name,
        content,
        type
    };
    
    fetch(APIURL, {
        method: 'POST',
        body: JSON.stringify(goal),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdGoal => {
          //console.log(createdGoal);
          listAllMews();
      });
      
}
function deleteCheck(e){
    const item = e.target;
    //DELETE
    if(item.classList[0] === 'trash-btn'){
        const todo = item.parentElement;
        //ANIMATION
        todo.classList.add('fall');
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }
    //CHECK MARK
    if(item.classList[0] === 'complete-btn'){
        const todo = item.parentElement;
        const check =  todo.querySelector(".todo-item");
        todo.classList.toggle("completed");

        const content = "Just successfully completed: " + check.innerHTML + "!";
        type = check.id.replace(/-/g, ' ');;
        sendGoals("Asim", content);
        /*new edition*/
        todo.classList.add('fall');
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }
}

function filterTodo(e){
    switch(e.target.value){
        case "none":
            type = "Custom Goals";
            break;
        case "day":
            type = "Daily Goals";
            break;
        case "week":
            type = "Weekly Goals";
            break;
        case "month":
            type = "Monthly Goals";
            break;
        case "year":
            type = "Yearly Goals";
            break;
        case "life":
            type = "Life Goals";
            break;  
    }
}

function saveLocalTodos(todo){
    //CHECK--HEY IS THE LIST ALREADY THERE?
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }
    else{
        todos  = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

}

function getTodos(){
    //CHECK--HEY IS THE LIST ALREADY THERE?
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }
    else{
        todos  = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todo){
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        //Create LI
        const newTodo = document.createElement("li");
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        //ADD TODO TO LOCALSTORAGE
        //CHECK MARK BUTTON 
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        //CHECK trash BUTTON 
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        //APPEND TO LIST
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo){
    //CHECK--HEY IS THE LIST ALREADY THERE?
    let todos;
    if(localStorage.getItem('todos')===null){
        todos = [];
    }
    else{
        todos  = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}