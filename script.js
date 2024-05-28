document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.querySelector('.todo-input');
    const todoTime = document.querySelector('.todo-time');
    const todoList = document.querySelector('.todo-list');
    const toggleBtn = document.getElementById('toggle-btn');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Load saved todos from local storage
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => addTodoItem(todo.text, todo.time, false));

    // Load theme preference from local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (currentTheme === null && prefersDarkScheme.matches)) {
        document.body.classList.toggle('dark-mode');
        toggleBtn.textContent = "Light Mode";
    }

    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        toggleBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
        localStorage.setItem('theme', theme);
    });

    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const todoText = todoInput.value.trim();
            const todoTimeValue = todoTime.value;
            if (todoText !== '') {
                addTodoItem(todoText, todoTimeValue, true);
                todoInput.value = '';
                todoTime.value = '';
            }
        }
    });

    function addTodoItem(todoText, todoTimeValue, save) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = `
            <span>${todoText}</span>
            <span>${todoTimeValue}</span>
            <span class="delete-btn">&#10006;</span>
        `;
        todoList.appendChild(todoItem);

        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            todoItem.remove();
            removeTodoItem(todoText);
        });

        if (save) {
            saveTodoItem(todoText, todoTimeValue);
        }

        if (todoTimeValue) {
            scheduleNotification(todoText, todoTimeValue);
        }
    }

    function saveTodoItem(todoText, todoTimeValue) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push({ text: todoText, time: todoTimeValue });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function removeTodoItem(todoText) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const updatedTodos = todos.filter(todo => todo.text !== todoText);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }

    function scheduleNotification(todoText, todoTimeValue) {
        const time = new Date(todoTimeValue).getTime() - new Date().getTime();
        if (time > 0) {
            setTimeout(() => {
                if (Notification.permission === 'granted') {
                    new Notification('Todo Reminder', {
                        body: todoText,
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Todo Reminder', {
                                body: todoText,
                            });
                        }
                    });
                }
            }, time);
        }
    }
});
