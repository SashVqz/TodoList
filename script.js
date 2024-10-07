var todos;

if (!localStorage.getItem('todos')) {
    fetch('https://jsonplaceholder.typicode.com/users/1/todos')
    .then(response => response.json())
    .then(data => {
        todos = data.map(item => ({ title: item.title, text: '', done: item.completed }));
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    })
    .catch(error => console.error('Error:', error));
} else {
    todos = JSON.parse(localStorage.getItem('todos'));
}

document.getElementById('addTodoButton').addEventListener('click', function() {
    var title = document.getElementById('todoTitle').value;
    var text = document.getElementById('todoText').value;
    if (title && text) {
        todos.push({ title: title, text: text, done: false });
        localStorage.setItem('todos', JSON.stringify(todos));
        document.getElementById('todoTitle').value = '';
        document.getElementById('todoText').value = '';
        renderTodos();
    }
});

document.getElementById('searchInput').addEventListener('input', function() {
    var value = document.getElementById('searchInput').value;
    if (value) {
        var filteredTodos = todos.filter(function(todo) {
            return todo.title.includes(value) || todo.text.includes(value);
        });
        renderTodos(filteredTodos);
    } else {
        renderTodos();
    }
});

document.getElementById('showIncompleteButton').addEventListener('click', function() {
    var filteredTodos = todos.filter(function(todo) {
        return !todo.done;
    });
    renderTodos(filteredTodos);
});

document.getElementById('showAllButton').addEventListener('click', function() {
    renderTodos(todos);
});

function renderTodos(todosToRender) {
    var list = document.getElementById('todoContainer');
    list.innerHTML = '';

    (todosToRender || todos).forEach(function(todo, index) {
        var item = document.createElement('div');
        item.className = 'alert alert-primary';

        var title = document.createElement('h4');
        title.innerText = todo.title;
        item.appendChild(title);

        var text = document.createElement('p');
        text.innerText = todo.text;
        item.appendChild(text);

        if (todo.done) {
            title.style.textDecoration = 'line-through';
            text.style.textDecoration = 'line-through';
        }

        var doneButton = document.createElement('button');
        doneButton.innerText = 'Completar';
        doneButton.className = 'btn btn-success';
        doneButton.addEventListener('click', function() {
            todos[index].done = true;
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        });
        item.appendChild(doneButton);

        var editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.className = 'btn btn-warning';
        editButton.addEventListener('click', function() {
            document.getElementById('todoTitle').value = todo.title;
            document.getElementById('todoText').value = todo.text;
            document.getElementById('addTodoButton').innerText = 'Actualizar tarea';
            document.getElementById('addTodoButton').addEventListener('click', function updateTodo() {
                var newTitle = document.getElementById('todoTitle').value;
                var newText = document.getElementById('todoText').value;
                if (newTitle || newText) {
                    todos[index].title = newTitle;
                    todos[index].text = newText;
                } else {
                    todos.splice(index, 1);
                }
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
                document.getElementById('addTodoButton').innerText = 'Agregar tarea';
                document.getElementById('addTodoButton').removeEventListener('click', updateTodo);
            });
        });
        
        item.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.className = 'btn btn-danger';
        deleteButton.addEventListener('click', function() {
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        });
        item.appendChild(deleteButton);

        list.appendChild(item);
    });
}

window.onload = function() {
    renderTodos();
};