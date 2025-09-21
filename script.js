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

    // Work Status Toggle Functionality
    const alekBtn = document.getElementById('alekBtn');
    const juleahBtn = document.getElementById('juleahBtn');
    const todoBtn = document.getElementById('todoBtn');
    const alekStatus = document.getElementById('alekStatus');
    const juleahStatus = document.getElementById('juleahStatus');
    const todoSection = document.getElementById('todoSection');

    function showStatus(section, button) {
        // Hide all sections
        [alekStatus, juleahStatus, todoSection].forEach(s => s.classList.remove('active'));
        // Remove active from all buttons
        [alekBtn, juleahBtn, todoBtn].forEach(b => b.classList.remove('active'));
        
        // Show selected section and activate button
        section.classList.add('active');
        button.classList.add('active');
    }

    alekBtn.addEventListener('click', () => showStatus(alekStatus, alekBtn));
    juleahBtn.addEventListener('click', () => showStatus(juleahStatus, juleahBtn));
    todoBtn.addEventListener('click', () => showStatus(todoSection, todoBtn));

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

    function renderWritingProjects() {
        if (!writingData) return;

        // Update the writing section with dynamic content
        const writingSection = document.querySelector('#writing .content-grid');
        if (writingSection) {
            writingSection.innerHTML = writingData.projects.map(project => 
                `<div class="content-item" onclick="openWritingProject('${project.id}')" style="cursor: pointer;">
                    <h3>${project.title}</h3>
                    <p>${project.shortDescription}</p>
                    ${project.status === 'published' || project.status === 'published-digital' ? 
                        `<div class="writing-status ${project.status}" style="margin-top: 0.5rem;">${project.status.replace('-', ' ')}</div>` : 
                        project.purchaseLinks ? 
                            `<a href="${project.purchaseLinks[0].url}" class="project-link" onclick="event.stopPropagation()">View on ${project.purchaseLinks[0].platform}</a>` :
                            `<div class="writing-status ${project.status}" style="margin-top: 0.5rem;">${project.status.replace('-', ' ')}</div>`
                    }
                </div>`
            ).join('');
        }
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
    
    if (event.target === flashModal) {
        closeFlashFiction();
    }
    
    if (event.target === blogModal) {
        closeBlog();
    }
    
    if (event.target === writingModal) {
        closeWritingProject();
    }
});

// Keyboard navigation for all modals
document.addEventListener('keydown', function(event) {
    const flashModal = document.getElementById('flashFictionModal');
    const blogModal = document.getElementById('blogModal');
    const writingModal = document.getElementById('writingModal');
    
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
});