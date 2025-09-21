// The Azirona Drift - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });

    // Highlight active navigation link
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // To-Do List Functionality
    let todos = JSON.parse(localStorage.getItem('azironaTodos')) || [];
    let todoId = 0;

    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');

    function saveTodos() {
        localStorage.setItem('azironaTodos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.dataset.id = todo.id;
            
            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="todo-btn complete-btn" onclick="toggleTodo(${todo.id})">
                        ${todo.completed ? 'undo' : 'done'}
                    </button>
                    <button class="todo-btn delete-btn" onclick="deleteTodo(${todo.id})">
                        delete
                    </button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
        });
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') return;

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            created: new Date().toISOString()
        };

        todos.unshift(newTodo);
        todoInput.value = '';
        saveTodos();
        renderTodos();
        
        // Add subtle animation
        const newItem = todoList.firstChild;
        newItem.style.transform = 'translateX(-20px)';
        newItem.style.opacity = '0';
        setTimeout(() => {
            newItem.style.transition = 'all 0.3s ease';
            newItem.style.transform = 'translateX(0)';
            newItem.style.opacity = '1';
        }, 10);
    }

    function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        }
    }

    function deleteTodo(id) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        todoItem.style.transition = 'all 0.3s ease';
        todoItem.style.transform = 'translateX(100px)';
        todoItem.style.opacity = '0';
        
        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            renderTodos();
        }, 300);
    }

    // Make functions global for onclick handlers
    window.toggleTodo = toggleTodo;
    window.deleteTodo = deleteTodo;

    // Event listeners for todo functionality
    addTodoBtn.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Initialize todos
    renderTodos();

    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all content items for animations
    const contentItems = document.querySelectorAll('.content-item');
    contentItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });

    // Add some interactivity to content items
    contentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });

    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero h2');
    const heroText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < heroText.length) {
            heroTitle.textContent += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add click ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Apply ripple effect to all buttons
    const buttons = document.querySelectorAll('button, .nav-link');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    console.log('🌵 The Azirona Drift - Digital Southwest Experience Loaded');
});