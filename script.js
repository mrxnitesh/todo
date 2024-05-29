// Function to handle login
function login() {
    const username = document.getElementById('username').value.trim();
    if (username !== '') {
        localStorage.setItem('username', username);
        document.getElementById('authentication').style.display = 'none';
        document.getElementById('todo-form').style.display = 'block';
        loadTasks();
    }
}

// Function to add a task
function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-btn">Delete</button>
    `;
    const targetList = completed ? document.getElementById('completed-task-list') : document.getElementById('task-list');
    targetList.appendChild(li);
    if (completed) {
        li.classList.add('completed');
    }
    li.querySelector('.delete-btn').addEventListener('click', function () {
        li.remove();
        saveTasks();
    });
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li, #completed-task-list li').forEach(function (task) {
        tasks.push({
            text: task.querySelector('span').innerText,
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(function (task) {
            addTask(task.text, task.completed);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('task-input');

    // Check if user is logged in and load tasks
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('authentication').style.display = 'none';
        document.getElementById('todo-form').style.display = 'block';
        loadTasks();
    }

    window.addEventListener('beforeunload', function () {
        // Save tasks before page refresh
        saveTasks();
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            input.value = '';
            saveTasks();
        }
    });

    // Add click event listener to each task item in task list
    document.getElementById('task-list').addEventListener('click', function (event) {
        const task = event.target.closest('li');
        if (task && task.parentElement === document.getElementById('task-list')) {
            task.classList.toggle('completed');
            document.getElementById('completed-task-list').appendChild(task);
            saveTasks();
        }
    });

    // Add click event listener to each task item in completed task list
    document.getElementById('completed-task-list').addEventListener('click', function (event) {
        const task = event.target.closest('li');
        if (task && task.parentElement === document.getElementById('completed-task-list')) {
            task.classList.toggle('completed');
            document.getElementById('task-list').appendChild(task);
            saveTasks();
        }
    });
});

