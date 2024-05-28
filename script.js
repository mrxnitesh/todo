document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.querySelector('.todo-input');
    const todoList = document.querySelector('.todo-list');
    const archivedList = document.querySelector('.archived-list');

    // Request Notification permission on page load
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            }
        });
    }

    // Load saved todos from local storage
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => addTodoItem(todo.text, todo.done, false));

    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const todoText = todoInput.value.trim();
            if (todoText !== '') {
                addTodoItem(todoText, false, true);
                todoInput.value = '';
            }
        }
    });

    function addTodoItem(todoText, done, save) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = `
            <input type="checkbox" ${done ? 'checked' : ''}>
            <span>${todoText}</span>
            <span class="delete-btn">&#10006;</span>
        `;
        (done ? archivedList : todoList).appendChild(todoItem);

        const checkbox = todoItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                archiveTodoItem(todoItem);
            } else {
                unarchiveTodoItem(todoItem);
            }
        });

        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this todo?')) {
                todoItem.remove();
                removeTodoItem(todoText);
            }
        });

        if (save) {
            saveTodoItem(todoText, done);
        }
    }

    function saveTodoItem(todoText, done) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push({ text: todoText, done: done });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function removeTodoItem(todoText) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const updatedTodos = todos.filter(todo => todo.text !== todoText);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }

    function archiveTodoItem(todoItem) {
        const todoText = todoItem.querySelector('span').textContent;
        todoItem.remove();
        addTodoItem(todoText, true, true);
    }

    function unarchiveTodoItem(todoItem) {
        const todoText = todoItem.querySelector('span').textContent;
        todoItem.remove();
        addTodoItem(todoText, false, true);
    }

    // Example function to trigger a notification for demonstration purposes
    function triggerNotification(todoText) {
        if (Notification.permission === 'granted') {
            new Notification('Todo Reminder', {
                body: todoText,
            });
        }
    }

    // Example: Trigger a notification 5 seconds after adding a todo item
    function scheduleNotification(todoText) {
        setTimeout(() => {
            triggerNotification(todoText);
        }, 5000); // Change this time as needed
    }

    // Add event listener to trigger notification on adding todo item
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const todoText = todoInput.value.trim();
            if (todoText !== '') {
                scheduleNotification(todoText);
            }
        }
    });
});
