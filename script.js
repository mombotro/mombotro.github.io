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

    // Work Status and Projects Functionality
    let workStatusData = null;
    let currentFilter = 'all';

    async function loadWorkStatus() {
        try {
            const response = await fetch('work-status.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            workStatusData = await response.json();
            
            // Make data globally accessible
            window.workStatusData = workStatusData;
            
            applyGlobalFilter('all');
            setupFilterButtons();
            setupStatusToggle();
            console.log(`✅ Work status loaded: ${workStatusData.projects.length} projects available`);
        } catch (error) {
            console.error('Error loading work status:', error);
            showWorkStatusError();
        }
    }

    function showWorkStatusError() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="projects-loading">
                    <p>Error loading projects. Please check work-status.json</p>
                </div>
            `;
        }
    }

    function applyGlobalFilter(filter) {
        if (!workStatusData) return;
        
        // Get all project cards from work status data
        const projects = workStatusData.projects;
        
        // Replace content in all sections with filtered projects
        renderSectionProjects('writing', projects.filter(p => p.type === 'book' || p.type === 'novel' || p.type === 'digital publication' || p.type === "children's book" || p.type === 'game writing'), filter);
        renderSectionProjects('comics', projects.filter(p => p.type === 'comic' || p.type === 'art portfolio' || p.type === 'art series' || p.type === 'art book'), filter);
        renderSectionProjects('games', projects.filter(p => p.type === 'game'), filter);
        renderSectionProjects('music', projects.filter(p => p.type === 'music'), filter); // Will be empty for now
    }
    
    function renderSectionProjects(sectionId, sectionProjects, filter) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const contentGrid = section.querySelector('.content-grid');
        if (!contentGrid) return;
        
        // Filter projects based on current filter
        const filteredProjects = filter === 'all' ? sectionProjects : sectionProjects.filter(p => p.status === filter);
        
        if (filteredProjects.length === 0) {
            contentGrid.innerHTML = `
                <div class="content-item">
                    <h3>No ${filter === 'all' ? '' : filter + ' '}projects</h3>
                    <p>No projects found for this filter in ${sectionId}.</p>
                </div>
            `;
            return;
        }
        
        // Generate project cards
        contentGrid.innerHTML = filteredProjects.map(project => {
            const isWritingProject = sectionId === 'writing' && (project.type === 'book' || project.type === 'novel' || project.type === 'digital publication' || project.type === "children's book" || project.type === 'game writing');
            const isFlashFiction = project.id === 'flash-fiction-collection';
            
            // Determine click handler based on project type
            let clickHandler = '';
            if (isFlashFiction) {
                clickHandler = 'onclick="openFlashFiction()"';
            } else if (isWritingProject) {
                // Map work-status.json IDs to writing-projects.json IDs for modal compatibility
                const idMapping = {
                    'all-things-bright-beautiful': 'all-things-bright',
                    'my-balloons-book': 'my-balloons',
                    'desert-roads-novel': 'desert-roads',
                    'game-narrative-project': 'game-narratives'
                };
                const writingProjectId = idMapping[project.id] || project.id;
                clickHandler = `onclick="openWritingProject('${writingProjectId}')"`;
            } else if (sectionId === 'comics' && (project.type === 'comic' || project.type === 'art portfolio' || project.type === 'art series' || project.type === 'art book' || project.type === 'graphic novel')) {
                // Comics projects use their work-status ID directly
                clickHandler = `onclick="openComicsProject('${project.id}')"`;
            } else if (sectionId === 'games' && project.type === 'game') {
                // Games projects use their work-status ID directly
                clickHandler = `onclick="openGamesProject('${project.id}')"`;
            }
            
            return `
                <div class="content-item" data-status="${project.status}" ${clickHandler}>
                    <h3>${project.title}</h3>
                    <div class="project-status-badge ${project.status}">${project.status.replace('-', ' ')}</div>
                    <p>${project.description}</p>
                    <div class="project-meta-info">
                        <span class="project-author">by ${project.author}</span>
                        ${project.progress ? `<span class="project-progress">${project.progress}</span>` : ''}
                        ${project.completedDate ? `<span class="project-date">Completed ${new Date(project.completedDate).getFullYear()}</span>` : ''}
                        ${project.estimatedCompletion ? `<span class="project-date">Est. ${project.estimatedCompletion}</span>` : ''}
                        ${project.collaboration ? `<span class="project-collab">Collaboration</span>` : ''}
                    </div>
                    ${project.platform && !isFlashFiction ? `<a href="#" class="project-link">View on ${project.platform}</a>` : ''}
                    ${isFlashFiction ? `<button class="project-link" onclick="openFlashFiction()">Read Stories</button>` : ''}
                </div>
            `;
        }).join('');
    }

    function filterProjects(projects, filter) {
        if (filter === 'all') {
            return projects;
        }
        return projects.filter(project => project.status === filter);
    }

    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.global-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all filter buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');
                
                // Update current filter and apply to all sections
                currentFilter = this.getAttribute('data-filter');
                applyGlobalFilter(currentFilter);
            });
        });
    }

    function setupStatusToggle() {
        const projectsBtn = document.getElementById('projectsBtn');
        const todoBtn = document.getElementById('todoBtn');
        const projectsSection = document.getElementById('projectsSection');
        const todoSection = document.getElementById('todoSection');

        function showSection(section, button) {
            // Hide all sections
            [projectsSection, todoSection].forEach(s => s.classList.remove('active'));
            // Remove active from all buttons
            [projectsBtn, todoBtn].forEach(b => b.classList.remove('active'));
            
            // Show selected section and activate button
            section.classList.add('active');
            button.classList.add('active');
        }

        if (projectsBtn && todoBtn) {
            projectsBtn.addEventListener('click', () => showSection(projectsSection, projectsBtn));
            todoBtn.addEventListener('click', () => showSection(todoSection, todoBtn));
        }
    }

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
        const rate = scrolled * -0.3;
        
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

    // Flash Fiction Reader Functionality
    let currentStoryIndex = 0;
    let flashFictionData = null;
    let stories = [];

    async function loadFlashFiction() {
        try {
            const response = await fetch('flash-fiction.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            flashFictionData = await response.json();
            stories = flashFictionData.stories.map(story => story.id);
            
            // Make data globally accessible
            window.flashFictionData = flashFictionData;
            window.stories = stories;
            window.currentStoryIndex = currentStoryIndex;
            
            renderFlashFiction();
            console.log(`✅ Flash fiction loaded: ${stories.length} stories available`);
        } catch (error) {
            console.error('Error loading flash fiction:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                url: window.location.href
            });
            showFlashFictionError(error);
        }
    }

    function showFlashFictionError(error) {
        const reader = document.getElementById('flashReader');
        if (reader) {
            reader.innerHTML = `
                <div class="flash-error">
                    <p>Error loading stories from flash-fiction.json</p>
                    <p>Error: ${error?.message || 'Unknown error'}</p>
                    <p>Current URL: ${window.location.href}</p>
                    <p>Make sure you're accessing via http://localhost:8000</p>
                </div>
            `;
        }
    }


    function renderFlashFiction() {
        if (!flashFictionData) return;

        // Render story buttons
        const buttonContainer = document.getElementById('flashStoryButtons');
        if (buttonContainer) {
            buttonContainer.innerHTML = flashFictionData.stories.map((story, index) => 
                `<button class="flash-story-btn ${index === 0 ? 'active' : ''}" data-story="${story.id}">${story.title}</button>`
            ).join('');

            // Add click listeners to story buttons
            buttonContainer.querySelectorAll('.flash-story-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const storyId = this.getAttribute('data-story');
                    showStory(storyId);
                });
            });
        }

        // Render stories
        const reader = document.getElementById('flashReader');
        if (reader) {
            reader.innerHTML = flashFictionData.stories.map((story, index) => 
                `<div class="flash-story ${index === 0 ? 'active' : ''}" id="${story.id}">
                    <div class="flash-story-header">
                        <h3>${story.title}</h3>
                        <div class="flash-meta">
                            <span class="flash-word-count">${story.wordCount} words</span>
                            <span class="flash-read-time">${story.readTime}</span>
                        </div>
                    </div>
                    <div class="flash-content">
                        ${story.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>`
            ).join('');
        }

        // Update counter
        updateStoryCounter();
    }

    function updateStoryCounter() {
        const counter = document.getElementById('flashCounter');
        if (counter && stories.length > 0) {
            counter.textContent = `${currentStoryIndex + 1} of ${stories.length}`;
        }
    }

    function showStory(storyId, updateIndex = true) {
        // Hide all stories
        document.querySelectorAll('.flash-story').forEach(story => {
            story.classList.remove('active');
        });
        
        // Remove active from all story buttons
        document.querySelectorAll('.flash-story-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected story
        const targetStory = document.getElementById(storyId);
        const targetButton = document.querySelector(`[data-story="${storyId}"]`);
        
        if (targetStory) {
            targetStory.classList.add('active');
        }
        
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Update current index if needed
        if (updateIndex) {
            currentStoryIndex = stories.indexOf(storyId);
            updateStoryCounter();
        }
    }

    // Blog Reader Functionality
    let currentPostIndex = 0;
    let blogData = null;
    let posts = [];

    async function loadBlog() {
        try {
            const response = await fetch('blog-posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            blogData = await response.json();
            posts = blogData.posts.map(post => post.id);
            
            // Make data globally accessible
            window.blogData = blogData;
            window.posts = posts;
            window.currentPostIndex = currentPostIndex;
            
            renderBlog();
            console.log(`✅ Blog loaded: ${posts.length} posts available`);
        } catch (error) {
            console.error('Error loading blog:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                url: window.location.href
            });
            showBlogError(error);
        }
    }

    function showBlogError(error) {
        const reader = document.getElementById('blogReader');
        if (reader) {
            reader.innerHTML = `
                <div class="blog-error">
                    <p>Error loading blog posts from blog-posts.json</p>
                    <p>Error: ${error?.message || 'Unknown error'}</p>
                    <p>Current URL: ${window.location.href}</p>
                    <p>Make sure you're accessing via http://localhost:8000</p>
                </div>
            `;
        }
    }

    function renderBlog() {
        if (!blogData) return;

        // Render post buttons
        const buttonContainer = document.getElementById('blogPostButtons');
        if (buttonContainer) {
            buttonContainer.innerHTML = blogData.posts.map((post, index) => 
                `<button class="blog-post-btn ${index === 0 ? 'active' : ''}" data-post="${post.id}" title="${post.title}">${post.title}</button>`
            ).join('');

            // Add click listeners to post buttons
            buttonContainer.querySelectorAll('.blog-post-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const postId = this.getAttribute('data-post');
                    showPost(postId);
                });
            });
        }

        // Render posts
        const reader = document.getElementById('blogReader');
        if (reader) {
            reader.innerHTML = blogData.posts.map((post, index) => 
                `<div class="blog-post ${index === 0 ? 'active' : ''}" id="${post.id}">
                    <div class="blog-post-header">
                        <h3>${post.title}</h3>
                        <div class="blog-post-meta">
                            <span class="blog-author">by ${post.author}</span>
                            <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span class="blog-read-time">${post.readTime}</span>
                        </div>
                        <div class="blog-excerpt">${post.excerpt}</div>
                        <div class="blog-tags">
                            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="blog-content">
                        ${post.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>`
            ).join('');
        }

        // Update counter
        updatePostCounter();
    }

    function updatePostCounter() {
        const counter = document.getElementById('blogCounter');
        if (counter && posts.length > 0) {
            counter.textContent = `${currentPostIndex + 1} of ${posts.length}`;
        }
    }

    function showPost(postId, updateIndex = true) {
        // Hide all posts
        document.querySelectorAll('.blog-post').forEach(post => {
            post.classList.remove('active');
        });
        
        // Remove active from all post buttons
        document.querySelectorAll('.blog-post-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected post
        const targetPost = document.getElementById(postId);
        const targetButton = document.querySelector(`[data-post="${postId}"]`);
        
        if (targetPost) {
            targetPost.classList.add('active');
        }
        
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Update current index if needed
        if (updateIndex) {
            currentPostIndex = posts.indexOf(postId);
            updatePostCounter();
        }
    }

    // Writing Projects Functionality
    let writingData = null;
    
    // Comics Projects Functionality
    let comicsData = null;
    
    // Games Projects Functionality
    let gamesData = null;

    async function loadWritingProjects() {
        try {
            const response = await fetch('writing-projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            writingData = await response.json();
            
            // Make data globally accessible
            window.writingData = writingData;
            
            renderWritingProjects();
            console.log(`✅ Writing projects loaded: ${writingData.projects.length} projects available`);
        } catch (error) {
            console.error('Error loading writing projects:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                url: window.location.href
            });
        }
    }
    
    async function loadComicsProjects() {
        try {
            const response = await fetch('comics-projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            comicsData = await response.json();
            
            // Make data globally accessible
            window.comicsData = comicsData;
            
            console.log(`✅ Comics projects loaded: ${comicsData.projects.length} projects available`);
        } catch (error) {
            console.error('Error loading comics projects:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                url: window.location.href
            });
        }
    }
    
    async function loadGamesProjects() {
        try {
            const response = await fetch('games-projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gamesData = await response.json();
            
            // Make data globally accessible
            window.gamesData = gamesData;
            
            console.log(`✅ Games projects loaded: ${gamesData.projects.length} projects available`);
        } catch (error) {
            console.error('Error loading games projects:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                url: window.location.href
            });
        }
    }

    function renderWritingProjects() {
        // Writing projects are now handled by the global work status system
        // This function is kept for compatibility but does nothing
        return;
    }

    function showWritingProject(projectId) {
        const project = writingData.projects.find(p => p.id === projectId);
        if (!project) return;

        const titleElement = document.getElementById('writingProjectTitle');
        const detailElement = document.getElementById('writingDetail');

        if (titleElement) {
            titleElement.textContent = project.title;
        }

        if (detailElement) {
            detailElement.innerHTML = generateProjectDetailHTML(project);
        }
    }


    // Load all data when page loads
    loadFlashFiction();
    loadBlog();
    loadWritingProjects();
    loadComicsProjects();
    loadGamesProjects();
    loadWorkStatus();

    console.log('🌵 The Azirona Drift - Digital Southwest Experience Loaded');
});

// Global functions for flash fiction (called by onclick handlers)
function openFlashFiction() {
    const modal = document.getElementById('flashFictionModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeFlashFiction() {
    const modal = document.getElementById('flashFictionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function previousStory() {
    if (!window.flashFictionData || !window.stories) return;
    
    let currentIndex = window.currentStoryIndex || 0;
    
    // Go to previous story (wrap around if needed)
    const newIndex = currentIndex > 0 ? currentIndex - 1 : window.stories.length - 1;
    const newStoryId = window.stories[newIndex];
    
    // Update global index and show story
    window.currentStoryIndex = newIndex;
    showStory(newStoryId, false);
    
    // Update counter
    const counter = document.getElementById('flashCounter');
    if (counter) {
        counter.textContent = `${newIndex + 1} of ${window.stories.length}`;
    }
}

function nextStory() {
    if (!window.flashFictionData || !window.stories) return;
    
    let currentIndex = window.currentStoryIndex || 0;
    
    // Go to next story (wrap around if needed)
    const newIndex = currentIndex < window.stories.length - 1 ? currentIndex + 1 : 0;
    const newStoryId = window.stories[newIndex];
    
    // Update global index and show story
    window.currentStoryIndex = newIndex;
    showStory(newStoryId, false);
    
    // Update counter
    const counter = document.getElementById('flashCounter');
    if (counter) {
        counter.textContent = `${newIndex + 1} of ${window.stories.length}`;
    }
}

function showStory(storyId, updateIndex = true) {
    // Hide all stories
    document.querySelectorAll('.flash-story').forEach(story => {
        story.classList.remove('active');
    });
    
    // Remove active from all story buttons
    document.querySelectorAll('.flash-story-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected story
    const targetStory = document.getElementById(storyId);
    const targetButton = document.querySelector(`[data-story="${storyId}"]`);
    
    if (targetStory) {
        targetStory.classList.add('active');
    }
    
    if (targetButton) {
        targetButton.classList.add('active');
    }
}


// Global functions for blog (called by onclick handlers)
function openBlog() {
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeBlog() {
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function previousPost() {
    if (!window.blogData || !window.posts) return;
    
    let currentIndex = window.currentPostIndex || 0;
    
    // Go to previous post (wrap around if needed)
    const newIndex = currentIndex > 0 ? currentIndex - 1 : window.posts.length - 1;
    const newPostId = window.posts[newIndex];
    
    // Update global index and show post
    window.currentPostIndex = newIndex;
    showPost(newPostId, false);
    
    // Update counter
    const counter = document.getElementById('blogCounter');
    if (counter) {
        counter.textContent = `${newIndex + 1} of ${window.posts.length}`;
    }
}

function nextPost() {
    if (!window.blogData || !window.posts) return;
    
    let currentIndex = window.currentPostIndex || 0;
    
    // Go to next post (wrap around if needed)
    const newIndex = currentIndex < window.posts.length - 1 ? currentIndex + 1 : 0;
    const newPostId = window.posts[newIndex];
    
    // Update global index and show post
    window.currentPostIndex = newIndex;
    showPost(newPostId, false);
    
    // Update counter
    const counter = document.getElementById('blogCounter');
    if (counter) {
        counter.textContent = `${newIndex + 1} of ${window.posts.length}`;
    }
}

// Global functions for writing projects (called by onclick handlers)
function openWritingProject(projectId) {
    const modal = document.getElementById('writingModal');
    if (modal && window.writingData) {
        // Show project details
        const project = window.writingData.projects.find(p => p.id === projectId);
        if (project) {
            const titleElement = document.getElementById('writingProjectTitle');
            const detailElement = document.getElementById('writingDetail');

            if (titleElement) {
                titleElement.textContent = project.title;
            }

            if (detailElement) {
                detailElement.innerHTML = generateProjectDetailHTML(project);
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeWritingProject() {
    const modal = document.getElementById('writingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Global functions for comics projects (called by onclick handlers)
function openComicsProject(projectId) {
    const modal = document.getElementById('comicsModal');
    if (modal && window.comicsData) {
        // Show project details
        const project = window.comicsData.projects.find(p => p.id === projectId);
        if (project) {
            const titleElement = document.getElementById('comicsProjectTitle');
            const detailElement = document.getElementById('comicsDetail');

            if (titleElement) {
                titleElement.textContent = project.title;
            }

            if (detailElement) {
                detailElement.innerHTML = generateComicsDetailHTML(project);
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeComicsProject() {
    const modal = document.getElementById('comicsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Global functions for games projects (called by onclick handlers)
function openGamesProject(projectId) {
    const modal = document.getElementById('gamesModal');
    if (modal && window.gamesData) {
        // Show project details
        const project = window.gamesData.projects.find(p => p.id === projectId);
        if (project) {
            const titleElement = document.getElementById('gamesProjectTitle');
            const detailElement = document.getElementById('gamesDetail');

            if (titleElement) {
                titleElement.textContent = project.title;
            }

            if (detailElement) {
                detailElement.innerHTML = generateGamesDetailHTML(project);
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeGamesProject() {
    const modal = document.getElementById('gamesModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Global functions for game player (called by onclick handlers)
function playGame(projectId) {
    if (!window.gamesData) return;
    
    const project = window.gamesData.projects.find(p => p.id === projectId);
    if (project && project.hasWebVersion && project.webGamePath) {
        const modal = document.getElementById('gamePlayerModal');
        const titleElement = document.getElementById('gamePlayerTitle');
        const iframe = document.getElementById('gameIframe');
        
        if (modal && titleElement && iframe) {
            titleElement.textContent = project.title;
            iframe.src = project.webGamePath;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeGamePlayer() {
    const modal = document.getElementById('gamePlayerModal');
    const iframe = document.getElementById('gameIframe');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop the game by clearing the iframe src
        if (iframe) {
            iframe.src = '';
        }
    }
}

function toggleGameFullscreen() {
    const modal = document.getElementById('gamePlayerModal');
    if (!modal) return;
    
    if (!document.fullscreenElement) {
        modal.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function generateProjectDetailHTML(project) {
    return `
        <div class="writing-project-content">
            <div class="writing-project-image">
                <img src="${project.coverImage}" alt="${project.title} cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjRFNUQzIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNjAiIGZpbGw9IiNGRUZDRjgiIHN0cm9rZT0iI0M2NUQwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiBmb250LWZhbWlseT0iQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDNjVEMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7cHJvamVjdC50aXRsZX08L3RleHQ+Cjwvc3ZnPg=='">
            </div>
            <div class="writing-project-info">
                <h3>Project Details</h3>
                
                <div class="writing-meta">
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Status</span>
                        <span class="writing-meta-value">
                            <span class="writing-status ${project.status}">${project.status.replace('-', ' ')}</span>
                        </span>
                    </div>
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Type</span>
                        <span class="writing-meta-value">${project.type}</span>
                    </div>
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Genre</span>
                        <span class="writing-meta-value">${project.genre || 'N/A'}</span>
                    </div>
                    ${project.publishDate ? `
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Published</span>
                        <span class="writing-meta-value">${new Date(project.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    ` : ''}
                    ${project.pageCount ? `
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Pages</span>
                        <span class="writing-meta-value">${project.pageCount}</span>
                    </div>
                    ` : ''}
                    ${project.wordCount ? `
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Words</span>
                        <span class="writing-meta-value">${project.wordCount.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    ${project.currentProgress ? `
                    <div class="writing-meta-item">
                        <span class="writing-meta-label">Progress</span>
                        <span class="writing-meta-value">${project.currentProgress}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="writing-description">
                    <p>${project.detailedDescription}</p>
                </div>

                ${project.excerpt ? `
                <div class="writing-excerpt">
                    <p>${project.excerpt}</p>
                </div>
                ` : ''}

                ${project.themes ? `
                <div class="writing-themes">
                    <h4>Themes</h4>
                    <div class="writing-theme-tags">
                        ${project.themes.map(theme => `<span class="writing-theme-tag">${theme}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.purchaseLinks ? `
                <div class="writing-purchase-links">
                    <h4>Get This Book</h4>
                    ${project.purchaseLinks.map(link => 
                        `<a href="${link.url}" target="_blank" class="writing-purchase-link">${link.platform} - ${link.price}</a>`
                    ).join('')}
                </div>
                ` : ''}

                ${project.reviews ? `
                <div class="writing-reviews">
                    <h4>Reviews</h4>
                    ${project.reviews.map(review => `
                        <div class="writing-review">
                            <div class="writing-review-quote">"${review.quote}"</div>
                            <div class="writing-review-source">— ${review.source}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${project.projects ? `
                <div class="writing-future-projects">
                    <h4>Upcoming Projects</h4>
                    ${project.projects.map(futureProject => `
                        <div class="writing-future-project">
                            <h5>${futureProject.title}</h5>
                            <div class="genre">${futureProject.genre}</div>
                            <p>${futureProject.concept}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${project.collaborativeNote ? `
                <div class="writing-description">
                    <p><strong>Collaboration:</strong> ${project.collaborativeNote}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Close modals when clicking outside of them
window.addEventListener('click', function(event) {
    const flashModal = document.getElementById('flashFictionModal');
    const blogModal = document.getElementById('blogModal');
    const writingModal = document.getElementById('writingModal');
    const comicsModal = document.getElementById('comicsModal');
    const gamesModal = document.getElementById('gamesModal');
    const gamePlayerModal = document.getElementById('gamePlayerModal');
    
    if (event.target === flashModal) {
        closeFlashFiction();
    }
    
    if (event.target === blogModal) {
        closeBlog();
    }
    
    if (event.target === writingModal) {
        closeWritingProject();
    }
    
    if (event.target === comicsModal) {
        closeComicsProject();
    }
    
    if (event.target === gamesModal) {
        closeGamesProject();
    }
    
    if (event.target === gamePlayerModal) {
        closeGamePlayer();
    }
});

// Keyboard navigation for all modals
document.addEventListener('keydown', function(event) {
    const flashModal = document.getElementById('flashFictionModal');
    const blogModal = document.getElementById('blogModal');
    const writingModal = document.getElementById('writingModal');
    const comicsModal = document.getElementById('comicsModal');
    const gamesModal = document.getElementById('gamesModal');
    const gamePlayerModal = document.getElementById('gamePlayerModal');
    
    if (flashModal && flashModal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeFlashFiction();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                previousStory();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextStory();
                break;
        }
    }
    
    if (blogModal && blogModal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeBlog();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                previousPost();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextPost();
                break;
        }
    }
    
    if (writingModal && writingModal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeWritingProject();
                break;
        }
    }
    
    if (comicsModal && comicsModal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeComicsProject();
                break;
        }
    }
    
    if (gamesModal && gamesModal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeGamesProject();
                break;
        }
    }
    
    if (gamePlayerModal && gamePlayerModal.style.display === 'block') {
        switch(event.key) {
            case 'Escape':
                closeGamePlayer();
                break;
            case 'F11':
                event.preventDefault();
                toggleGameFullscreen();
                break;
        }
    }
});
function generateComicsDetailHTML(project) {
    return `
        <div class="comics-project-content">
            <div class="comics-project-image">
                <img src="${project.coverImage}" alt="${project.title} cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjOUNBRjg4Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNjAiIGZpbGw9IiNGRUZDRjgiIHN0cm9rZT0iI0M2NUQwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiBmb250LWZhbWlseT0iQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDNjVEMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7cHJvamVjdC50aXRsZX08L3RleHQ+Cjwvc3ZnPg=='">
            </div>
            <div class="comics-project-info">
                <h3>Project Details</h3>
                
                <div class="comics-meta">
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Status</span>
                        <span class="comics-meta-value">
                            <span class="comics-status ${project.status}">${project.status.replace('-', ' ')}</span>
                        </span>
                    </div>
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Type</span>
                        <span class="comics-meta-value">${project.type}</span>
                    </div>
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Genre</span>
                        <span class="comics-meta-value">${project.genre || 'N/A'}</span>
                    </div>
                    ${project.publishDate ? `
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Published</span>
                        <span class="comics-meta-value">${new Date(project.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    ` : ''}
                    ${project.episodeCount ? `
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Episodes</span>
                        <span class="comics-meta-value">${project.episodeCount}</span>
                    </div>
                    ` : ''}
                    ${project.estimatedLength ? `
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Length</span>
                        <span class="comics-meta-value">${project.estimatedLength}</span>
                    </div>
                    ` : ''}
                    ${project.progress ? `
                    <div class="comics-meta-item">
                        <span class="comics-meta-label">Progress</span>
                        <span class="comics-meta-value">${project.progress}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="comics-description">
                    <p>${project.detailedDescription}</p>
                </div>

                ${project.excerpt ? `
                <div class="comics-excerpt">
                    <p><em>"${project.excerpt}"</em></p>
                </div>
                ` : ''}

                ${project.themes ? `
                <div class="comics-themes">
                    <h4>Themes</h4>
                    <div class="comics-theme-tags">
                        ${project.themes.map(theme => `<span class="comics-theme-tag">${theme}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.artStyle ? `
                <div class="comics-art-style">
                    <h4>Art Style</h4>
                    <p>${project.artStyle}</p>
                </div>
                ` : ''}

                ${project.readLinks ? `
                <div class="comics-read-links">
                    <h4>Read Online</h4>
                    ${project.readLinks.map(link => 
                        `<a href="${link.url}" target="_blank" class="comics-read-link">${link.platform} - ${link.description}</a>`
                    ).join('')}
                </div>
                ` : ''}

                ${project.awards ? `
                <div class="comics-awards">
                    <h4>Awards</h4>
                    ${project.awards.map(award => `
                        <div class="comics-award">
                            <div class="comics-award-name">${award}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${project.includesProjects ? `
                <div class="comics-includes">
                    <h4>Includes Work From</h4>
                    <div class="comics-project-list">
                        ${project.includesProjects.map(proj => `<span class="comics-project-item">${proj}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.collaborativeNote || project.collaboration ? `
                <div class="comics-collaboration">
                    <h4>Collaboration</h4>
                    <p>${project.collaborativeNote || project.collaboration}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}function generateGamesDetailHTML(project) {
    return `
        <div class="games-project-content">
            <div class="games-project-image">
                <img src="${project.coverImage}" alt="${project.title} cover" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjQjg3MzMzIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIzNjAiIGZpbGw9IiNGRUZDRjgiIHN0cm9rZT0iI0M2NUQwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiBmb250LWZhbWlseT0iQ291cmllciBOZXciIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNDNjVEMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiR7cHJvamVjdC50aXRsZX08L3RleHQ+Cjwvc3ZnPg=='">
            </div>
            <div class="games-project-info">
                <h3>Game Details</h3>
                
                <div class="games-meta">
                    <div class="games-meta-item">
                        <span class="games-meta-label">Status</span>
                        <span class="games-meta-value">
                            <span class="games-status ${project.status}">${project.status.replace('-', ' ')}</span>
                        </span>
                    </div>
                    <div class="games-meta-item">
                        <span class="games-meta-label">Type</span>
                        <span class="games-meta-value">${project.type}</span>
                    </div>
                    <div class="games-meta-item">
                        <span class="games-meta-label">Genre</span>
                        <span class="games-meta-value">${project.genre || 'N/A'}</span>
                    </div>
                    ${project.publishDate ? `
                    <div class="games-meta-item">
                        <span class="games-meta-label">Published</span>
                        <span class="games-meta-value">${new Date(project.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    ` : ''}
                    ${project.playerCount ? `
                    <div class="games-meta-item">
                        <span class="games-meta-label">Players</span>
                        <span class="games-meta-value">${project.playerCount}</span>
                    </div>
                    ` : ''}
                    ${project.playTime || project.estimatedPlayTime ? `
                    <div class="games-meta-item">
                        <span class="games-meta-label">Play Time</span>
                        <span class="games-meta-value">${project.playTime || project.estimatedPlayTime}</span>
                    </div>
                    ` : ''}
                    ${project.progress ? `
                    <div class="games-meta-item">
                        <span class="games-meta-label">Progress</span>
                        <span class="games-meta-value">${project.progress}</span>
                    </div>
                    ` : ''}
                </div>

                ${project.hasWebVersion || project.playLinks ? `
                <div class="games-action-buttons">
                    ${project.hasWebVersion ? `
                        <button class="games-play-btn" onclick="playGame('${project.id}')">Play Game</button>
                    ` : ''}
                    ${project.playLinks ? project.playLinks.map(link => 
                        `<a href="${link.url}" target="_blank" class="games-download-btn">View on ${link.platform}</a>`
                    ).join('') : ''}
                </div>
                ` : ''}

                <div class="games-description">
                    <p>${project.detailedDescription}</p>
                </div>

                ${project.excerpt ? `
                <div class="games-excerpt">
                    <p><em>"${project.excerpt}"</em></p>
                </div>
                ` : ''}

                ${project.themes ? `
                <div class="games-themes">
                    <h4>Themes</h4>
                    <div class="games-theme-tags">
                        ${project.themes.map(theme => `<span class="games-theme-tag">${theme}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.mechanics || project.plannedMechanics ? `
                <div class="games-mechanics">
                    <h4>Game Mechanics</h4>
                    <div class="games-mechanic-list">
                        ${(project.mechanics || project.plannedMechanics).map(mechanic => `<span class="games-mechanic-item">${mechanic}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.tools ? `
                <div class="games-tools">
                    <h4>Development Tools</h4>
                    <div class="games-tool-list">
                        ${project.tools.map(tool => `<span class="games-tool-item">${tool}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.awards ? `
                <div class="games-awards">
                    <h4>Awards & Recognition</h4>
                    ${project.awards.map(award => `
                        <div class="games-award">
                            <div class="games-award-name">${award}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${project.currentProjects ? `
                <div class="games-current-projects">
                    <h4>Current Projects</h4>
                    <div class="games-project-list">
                        ${project.currentProjects.map(proj => `<span class="games-project-item">${proj}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${project.games ? `
                <div class="games-collection">
                    <h4>Included Games</h4>
                    ${project.games.map(game => `
                        <div class="games-collection-item">
                            <h5>${game.title}</h5>
                            <span class="games-collection-status ${game.status}">${game.status.replace('-', ' ')}</span>
                            <p>${game.description}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${project.collaboration || project.collaborativeNote ? `
                <div class="games-collaboration">
                    <h4>Collaboration</h4>
                    <p>${project.collaboration || project.collaborativeNote}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}