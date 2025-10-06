// The Azirona Drift - Streamlined JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

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

    // Project data and filtering
    let workStatusData = null;
    let currentFilter = 'all';

    // Blog data
    let blogPosts = null;

    async function loadWorkStatus() {
        try {
            const response = await fetch('work-status.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            workStatusData = await response.json();

            renderProjects('all');
            setupFilterButtons();
            console.log(`✅ Work status loaded: ${workStatusData.projects.length} projects available`);
        } catch (error) {
            console.error('Error loading work status:', error);
            showProjectsError();
        }
    }

    function showProjectsError() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="projects-loading">
                    <p>Error loading projects. Please check work-status.json</p>
                </div>
            `;
        }
    }

    function renderProjects(filter) {
        if (!workStatusData) return;

        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        // Filter projects based on current filter
        const projects = workStatusData.projects;
        const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.status === filter);

        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="projects-loading">
                    <p>No ${filter === 'all' ? '' : filter + ' '}projects found.</p>
                </div>
            `;
            return;
        }

        // Generate unified project cards
        projectsGrid.innerHTML = filteredProjects.map(project => {
            return generateProjectCard(project);
        }).join('');
    }

    function generateProjectCard(project) {
        // Determine category icon/color based on type
        let categoryIcon = '📄';
        let categoryClass = 'general';

        if (project.type === 'book' || project.type === 'novel' || project.type === 'digital publication' || project.type === "children's book") {
            categoryIcon = '📚';
            categoryClass = 'writing';
        } else if (project.type === 'comic' || project.type === 'art portfolio' || project.type === 'art series' || project.type === 'art book') {
            categoryIcon = '🎨';
            categoryClass = 'comics';
        } else if (project.type === 'game') {
            categoryIcon = '🎮';
            categoryClass = 'games';
        } else if (project.type === 'music') {
            categoryIcon = '🎵';
            categoryClass = 'music';
        } else if (project.type === 'video') {
            categoryIcon = '🎬';
            categoryClass = 'video';
        }

        // Handle background image
        const hasBackground = project.backgroundImage ? 'has-background' : '';

        return `
            <div class="project-card ${categoryClass} ${hasBackground}" data-status="${project.status}" onclick="openProjectDetail('${project.id}')">
                <div class="project-header">
                    <span class="project-category">${categoryIcon} ${project.type}</span>
                    <span class="project-status ${project.status}">${project.status.replace('-', ' ')}</span>
                </div>
                ${project.backgroundImage ? `<div class="project-banner" style="background-image: url('${project.backgroundImage}')"></div>` : ''}
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-meta">
                        <span class="project-author">by ${project.author}</span>
                        ${project.progress ? `<span class="project-progress">${project.progress}</span>` : ''}
                        ${project.completedDate ? `<span class="project-date">Completed ${new Date(project.completedDate).getFullYear()}</span>` : ''}
                        ${project.estimatedCompletion ? `<span class="project-date">Est. ${project.estimatedCompletion}</span>` : ''}
                        ${project.collaboration ? `<span class="project-collab">Collaboration</span>` : ''}
                    </div>
                    ${getProjectAction(project)}
                </div>
            </div>
        `;
    }

    function getProjectAction(project) {
        let actions = [];

        // Handle different project types with appropriate actions
        if (project.type === 'web publication' && project.webFile) {
            actions.push(`<button class="project-link" onclick="event.stopPropagation(); openPublication('${project.id}')">Read Online</button>`);
        } else if (project.type === 'web game' && project.webFile) {
            actions.push(`<button class="project-link" onclick="event.stopPropagation(); openGame('${project.id}')">Play Game</button>`);
        }

        // Add external links if they exist
        if (project.externalLinks && project.externalLinks.length > 0) {
            project.externalLinks.forEach(link => {
                // Only add links that have both label and URL
                if (link.label && link.url && link.url !== '#') {
                    actions.push(`<a href="${link.url}" class="project-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${link.label}</a>`);
                }
            });
        }

        return actions.length > 0 ? `<div class="project-actions" onclick="event.stopPropagation()">${actions.join('')}</div>` : '';
    }

    function getProjectLink(project) {
        // Return actual project links based on platform
        // For now, return placeholder
        return '#';
    }

    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.global-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all filter buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');

                // Update current filter and render projects
                currentFilter = this.getAttribute('data-filter');
                renderProjects(currentFilter);
            });
        });
    }

    // Add hover effects to project cards
    function setupProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Initialize
    loadWorkStatus();
    loadBlogPosts();

    // Re-setup effects when projects are re-rendered
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                setupProjectCardEffects();
            }
        });
    });

    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        observer.observe(projectsGrid, { childList: true });
    }

    // Add typing effect to hero text
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
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
    }

    // Blog functionality
    async function loadBlogPosts() {
        try {
            const response = await fetch('blog/index.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            blogPosts = data.posts || [];

            renderBlogPosts();
            console.log(`📝 Blog loaded: ${blogPosts.length} posts available`);
        } catch (error) {
            console.error('Error loading blog posts:', error);
            showBlogError();
        }
    }

    function showBlogError() {
        const blogContainer = document.getElementById('blog-posts');
        if (blogContainer) {
            blogContainer.innerHTML = `
                <div class="blog-loading">
                    <p>Blog posts coming soon...</p>
                </div>
            `;
        }
    }

    function renderBlogPosts() {
        if (!blogPosts) return;

        const blogContainer = document.getElementById('blog-posts');
        if (!blogContainer) return;

        if (blogPosts.length === 0) {
            blogContainer.innerHTML = `
                <div class="blog-loading">
                    <p>No blog posts yet. Check back soon!</p>
                </div>
            `;
            return;
        }

        // Sort posts by date (newest first)
        const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

        blogContainer.innerHTML = sortedPosts.map(post => `
            <article class="blog-post" onclick="openBlogPost('${post.id}')">
                <div class="blog-post-header">
                    <div class="blog-post-date">${formatDate(post.date)}</div>
                    <h3 class="blog-post-title">${post.title}</h3>
                    <div class="blog-post-author">by ${post.author}</div>
                </div>
                <div class="blog-post-content">
                    <p class="blog-post-excerpt">${post.excerpt}</p>
                    <span class="blog-read-more">Read more →</span>
                </div>
            </article>
        `).join('');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async function openBlogPost(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.getElementById('blog-modal');
        const title = document.getElementById('blog-modal-title');
        const meta = document.getElementById('blog-modal-meta');
        const body = document.getElementById('blog-modal-body');

        // Set post info
        title.textContent = post.title;
        meta.innerHTML = `
            <span>${formatDate(post.date)}</span>
            <span>by ${post.author}</span>
        `;

        // Show modal with loading state
        body.innerHTML = 'Loading post...';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        try {
            // Try loading from blog folder first
            let response = await fetch(`blog/${post.filename}`);

            // If not found in blog folder, try publications folder
            if (!response.ok) {
                response = await fetch(`publications/${post.filename}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();

            // Convert markdown-style content to HTML
            body.innerHTML = convertMarkdownToHTML(content);
        } catch (error) {
            console.error('Error loading blog post:', error);
            body.innerHTML = `
                <p style="color: var(--clay);">
                    Sorry, there was an error loading this post. Please try again later.
                </p>
            `;
        }
    }

    function convertMarkdownToHTML(content) {
        // Simple markdown conversion
        return content
            // Remove front matter (lines starting with *)
            .replace(/^\*.*$/gm, '')
            // Headers
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Horizontal rules
            .replace(/^---$/gm, '<hr>')
            // Paragraphs (simple approach)
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (!paragraph) return '';
                if (paragraph.startsWith('<h') || paragraph.startsWith('<hr')) {
                    return paragraph;
                }
                return `<p>${paragraph.replace(/\n/g, ' ')}</p>`;
            })
            .join('');
    }

    function closeBlogPost() {
        const modal = document.getElementById('blog-modal');
        modal.classList.remove('active', 'fullscreen');
        document.body.style.overflow = 'auto';
    }

    function toggleBlogFullscreen() {
        const modal = document.getElementById('blog-modal');
        modal.classList.toggle('fullscreen');
    }

    // Publication functionality
    async function openPublication(projectId) {
        const project = workStatusData.projects.find(p => p.id === projectId);
        if (!project || !project.webFile) return;

        const modal = document.getElementById('publication-modal');
        const title = document.getElementById('publication-modal-title');
        const meta = document.getElementById('publication-modal-meta');
        const body = document.getElementById('publication-modal-body');

        // Set publication info
        title.textContent = project.title;
        meta.innerHTML = `
            <span>by ${project.author}</span>
            <span>Published ${formatDate(project.completedDate)}</span>
        `;

        // Show modal with loading state
        body.innerHTML = 'Loading publication...';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        try {
            // Load publication content
            const response = await fetch(project.webFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();

            // Convert markdown-style content to HTML
            body.innerHTML = convertMarkdownToHTML(content);
        } catch (error) {
            console.error('Error loading publication:', error);
            body.innerHTML = `
                <p style="color: var(--clay);">
                    Sorry, there was an error loading this publication. Please try again later.
                </p>
            `;
        }
    }

    function closePublication() {
        const modal = document.getElementById('publication-modal');
        modal.classList.remove('active', 'fullscreen');
        document.body.style.overflow = 'auto';
    }

    function togglePublicationFullscreen() {
        const modal = document.getElementById('publication-modal');
        modal.classList.toggle('fullscreen');
    }

    // Game functionality
    function openGame(projectId) {
        const project = workStatusData.projects.find(p => p.id === projectId);
        if (!project || !project.webFile) return;

        const modal = document.getElementById('game-modal');
        const title = document.getElementById('game-modal-title');
        const meta = document.getElementById('game-modal-meta');
        const iframe = document.getElementById('game-iframe');

        // Set game info
        title.textContent = project.title;
        meta.innerHTML = `
            <span>${project.gameType || 'Game'}</span>
            <span>by ${project.author}</span>
        `;

        // Load game in iframe
        iframe.src = project.webFile;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGame() {
        const modal = document.getElementById('game-modal');
        const iframe = document.getElementById('game-iframe');

        // Stop the game by clearing the iframe source
        iframe.src = '';

        modal.classList.remove('active', 'fullscreen');
        document.body.style.overflow = 'auto';
    }

    function toggleGameFullscreen() {
        const modal = document.getElementById('game-modal');
        modal.classList.toggle('fullscreen');
    }

    // Project Detail Modal functionality
    function openProjectDetail(projectId) {
        const project = workStatusData.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('project-detail-modal');
        const title = document.getElementById('project-detail-title');
        const meta = document.getElementById('project-detail-meta');
        const image = document.getElementById('project-detail-image');
        const description = document.getElementById('project-detail-description');
        const info = document.getElementById('project-detail-info');
        const actions = document.getElementById('project-detail-actions');

        // Set project info
        title.textContent = project.title;

        // Update meta info
        document.getElementById('project-detail-type').textContent = project.type;
        document.getElementById('project-detail-author').textContent = `by ${project.author}`;
        document.getElementById('project-detail-status').textContent = project.status.replace('-', ' ');

        // Handle image
        if (project.backgroundImage) {
            image.style.backgroundImage = `url('${project.backgroundImage}')`;
            image.style.display = 'block';
            image.onclick = null;
            image.title = '';
        } else {
            image.style.display = 'none';
        }

        // Set full description
        description.textContent = project.description;

        // Set additional info (simplified, no sections)
        let infoHtml = '<div class="project-detail-simple-info">';

        // Extra notes at the top if they exist
        if (project.extraNotes) {
            infoHtml += `<div class="extra-notes"><p style="white-space: pre-wrap; margin-bottom: 1rem; font-style: italic; color: var(--charcoal);">${project.extraNotes}</p></div>`;
        }

        // All details in one clean list
        if (project.platform) infoHtml += `<p><strong>Platform:</strong> ${project.platform}</p>`;
        if (project.gameType) infoHtml += `<p><strong>Game Type:</strong> ${project.gameType}</p>`;
        if (project.webFile) infoHtml += `<p><strong>Web File:</strong> ${project.webFile}</p>`;
        if (project.collaboration) infoHtml += `<p><strong>Collaboration:</strong> Yes</p>`;
        if (project.progress) infoHtml += `<p><strong>Progress:</strong> ${project.progress}</p>`;
        if (project.completedDate) infoHtml += `<p><strong>Completed:</strong> ${formatDate(project.completedDate)}</p>`;
        if (project.estimatedCompletion) infoHtml += `<p><strong>Est. Completion:</strong> ${project.estimatedCompletion}</p>`;

        infoHtml += '</div>';
        info.innerHTML = infoHtml;

        // Set actions (reuse existing logic)
        actions.innerHTML = getProjectAction(project).replace('onclick="event.stopPropagation();"', '').replace('onclick="event.stopPropagation(); ', 'onclick="');

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectDetail() {
        const modal = document.getElementById('project-detail-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Make functions global for onclick handlers
    window.openBlogPost = openBlogPost;
    window.closeBlogPost = closeBlogPost;
    window.toggleBlogFullscreen = toggleBlogFullscreen;
    window.openPublication = openPublication;
    window.closePublication = closePublication;
    window.togglePublicationFullscreen = togglePublicationFullscreen;
    window.openGame = openGame;
    window.closeGame = closeGame;
    window.toggleGameFullscreen = toggleGameFullscreen;
    window.openProjectDetail = openProjectDetail;
    window.closeProjectDetail = closeProjectDetail;

    console.log('🌵 The Azirona Drift - Streamlined Experience Loaded');
});