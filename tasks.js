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

        const taskTextSpan = li.querySelector('.task-text');

        // Event listener to toggle 'completed' class on click
        taskTextSpan.addEventListener('click', (e) => {
            // Check if the user is trying to edit before toggling completion
            if (e.detail === 1) { // Prevents conflict with double-click
                li.classList.toggle('completed');
                saveTasks();
            }
        });

        // Event listener to save edits when the user clicks away
        taskTextSpan.addEventListener('blur', () => {
            saveTasks();
        });

        // Event listener to save edits when the user presses Enter
        taskTextSpan.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                taskTextSpan.blur(); // Blur the element to trigger save
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

    clearCompletedBtn.addEventListener('click', () => {
        const completedTasks = taskList.querySelectorAll('li.completed');
        completedTasks.forEach(task => task.remove());
        saveTasks();
    });

    loadTasks();
});