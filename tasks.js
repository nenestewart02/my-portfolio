document.addEventListener('DOMContentLoaded', () => {
    // Select all the necessary HTML elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Function to load tasks from local storage
    const loadTasks = () => {
        // Get the tasks string from local storage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Loop through the tasks and display each one
        tasks.forEach(task => displayTask(task));
    };

    // Function to save tasks to local storage
    const saveTasks = () => {
        // Get all the list items
        const tasks = Array.from(taskList.children).map(li => {
            return {
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            };
        });
        // Save the array of task objects to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to display a single task on the page
    const displayTask = (task) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">×</button>
        `;
        // Add the 'completed' class if the task is completed
        if (task.completed) {
            li.classList.add('completed');
        }

        // Event listener for marking a task as completed
        li.querySelector('.task-text').addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        // Event listener for the delete button
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        taskList.appendChild(li);
    };

    // Event listener for the "Add Task" button
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                text: taskText,
                completed: false
            };
            displayTask(newTask);
            saveTasks();
            taskInput.value = ''; // Clear the input field
        }
    });

    // Event listener for pressing "Enter" on the input field
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Load tasks when the page first loads
    loadTasks();
});