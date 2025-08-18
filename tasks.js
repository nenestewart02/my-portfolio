document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    const filterBtns = document.querySelectorAll('.filters button');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => displayTask(task));
    };

    const saveTasks = () => {
        const tasks = Array.from(taskList.children).map(li => {
            return {
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const activeFilterBtn = document.querySelector('.filters button.active');
        if (activeFilterBtn) {
            const filterType = activeFilterBtn.id.split('-')[1];
            filterTasks(filterType);
        }
    };

    const filterTasks = (filterType) => {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            const isCompleted = task.classList.contains('completed');
            switch (filterType) {
                case 'all':
                    task.classList.remove('hidden');
                    break;
                case 'active':
                    if (isCompleted) {
                        task.classList.add('hidden');
                    } else {
                        task.classList.remove('hidden');
                    }
                    break;
                case 'completed':
                    if (!isCompleted) {
                        task.classList.add('hidden');
                    } else {
                        task.classList.remove('hidden');
                    }
                    break;
            }
        });
    };

    const displayTask = (task) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text" contenteditable="true">${task.text}</span>
            <button class="delete-btn">×</button>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }

        // Event listener for marking a task as completed
        li.querySelector('.task-text').addEventListener('click', () => {
            if (!li.querySelector('.task-text').isContentEditable) {
                li.classList.toggle('completed');
                saveTasks();
            }
        });

        // Event listener for editing a task
        li.querySelector('.task-text').addEventListener('blur', () => {
            saveTasks();
        });

        li.querySelector('.task-text').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                li.querySelector('.task-text').blur();
            }
        });

        // Event listener for the delete button
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        taskList.appendChild(li);
    };

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                text: taskText,
                completed: false
            };
            displayTask(newTask);
            saveTasks();
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterType = button.id.split('-')[1];
            filterTasks(filterType);
        });
    });

    // Event listener for clearing all completed tasks
    clearCompletedBtn.addEventListener('click', () => {
        const completedTasks = taskList.querySelectorAll('li.completed');
        completedTasks.forEach(task => task.remove());
        saveTasks();
    });

    loadTasks();
});