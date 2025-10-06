// Azirona Drift - Unified Project Editor

let projects = [];
let currentFilter = 'all';
let editingProjectId = null;

// Initialize the editor
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupEventListeners();
});

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderProjects();
        });
    });

    // Form submission
    document.getElementById('project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProject();
    });

    // Modal close on background click
    document.getElementById('project-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeProjectModal();
        }
    });

    // File input change listener
    document.getElementById('json-import-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const importBtn = document.getElementById('import-btn');
        const statusDiv = document.getElementById('import-status');

        if (file) {
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                statusDiv.textContent = `Selected: ${file.name}`;
                statusDiv.style.color = '#155724';
                importBtn.disabled = false;
            } else {
                statusDiv.textContent = 'Please select a valid JSON file';
                statusDiv.style.color = '#721c24';
                importBtn.disabled = true;
            }
        } else {
            statusDiv.textContent = '';
            importBtn.disabled = true;
        }
    });
}

function loadProjects() {
    // Try to load from localStorage first, fallback to empty array
    const savedProjects = localStorage.getItem('azirona-projects');
    if (savedProjects) {
        try {
            const data = JSON.parse(savedProjects);
            projects = data.projects || [];
        } catch (e) {
            console.error('Error parsing saved projects:', e);
            projects = [];
        }
    }

    renderProjects();
    updateJSONOutput();
}

function saveProjects() {
    const workStatusData = {
        lastUpdated: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects
    };

    localStorage.setItem('azirona-projects', JSON.stringify(workStatusData));
    updateJSONOutput();
}

function renderProjects() {
    const container = document.getElementById('projects-list');

    // Filter projects (maintain original order from projects array)
    const filteredProjects = currentFilter === 'all'
        ? projects
        : projects.filter(p => p.status === currentFilter);

    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6c757d;">
                <p>No ${currentFilter === 'all' ? '' : currentFilter + ' '}projects found.</p>
                <p><small>Click "Add New Project" to get started.</small></p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProjects.map((project, index) => {
        const externalLinksHtml = project.externalLinks && project.externalLinks.length > 0
            ? project.externalLinks.map(link => `<span>🔗 <a href="${link.url}" target="_blank" style="color: #c65d00; text-decoration: none;">${link.label}</a></span>`).join(' ')
            : '';

        const projectIndex = projects.findIndex(p => p.id === project.id);
        const canMoveUp = projectIndex > 0;
        const canMoveDown = projectIndex < projects.length - 1;

        return `
        <div class="project-item">
            <div class="project-position">
                <span class="position-number">#${projectIndex + 1}</span>
            </div>
            <div class="project-reorder">
                <button class="reorder-btn" onclick="moveProject('${project.id}', -1)" ${!canMoveUp ? 'disabled' : ''} title="Move Up">↑</button>
                <button class="reorder-btn" onclick="moveProject('${project.id}', 1)" ${!canMoveDown ? 'disabled' : ''} title="Move Down">↓</button>
            </div>
            <div class="project-info">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">
                    <span class="status-badge status-${project.status}">${project.status.replace('-', ' ')}</span>
                    <span>📄 ${project.type}</span>
                    <span>👤 ${project.author}</span>
                    ${project.platform ? `<span>🌐 ${project.platform}</span>` : ''}
                    ${project.webFile ? `<span>💻 ${project.webFile}</span>` : ''}
                    ${project.gameType ? `<span>🎮 ${project.gameType}</span>` : ''}
                    ${project.progress ? `<span>📊 ${project.progress}</span>` : ''}
                    ${project.completedDate ? `<span>📅 Completed ${new Date(project.completedDate).toLocaleDateString()}</span>` : ''}
                    ${externalLinksHtml}
                </div>
            </div>
            <div class="project-actions">
                <button class="btn btn-secondary" onclick="editProject('${project.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
        `;
    }).join('');
}

function generateProjectId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function openProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const title = document.getElementById('modal-title');

    editingProjectId = projectId;

    if (projectId) {
        // Editing existing project
        const project = projects.find(p => p.id === projectId);
        if (project) {
            title.textContent = 'Edit Project';
            populateForm(project);
        }
    } else {
        // Adding new project
        title.textContent = 'Add New Project';
        form.reset();
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    editingProjectId = null;
}

function populateForm(project) {
    document.getElementById('project-title').value = project.title || '';
    document.getElementById('project-author').value = project.author || '';
    document.getElementById('project-status').value = project.status || '';
    document.getElementById('project-type').value = project.type || '';
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-extra-notes').value = project.extraNotes || '';
    document.getElementById('project-platform').value = project.platform || '';
    document.getElementById('project-progress').value = project.progress || '';
    document.getElementById('project-completed-date').value = project.completedDate || '';
    document.getElementById('project-estimated-completion').value = project.estimatedCompletion || '';
    document.getElementById('project-background-image').value = project.backgroundImage || '';
    document.getElementById('project-web-file').value = project.webFile || '';
    document.getElementById('project-game-type').value = project.gameType || '';
    document.getElementById('project-collaboration').checked = project.collaboration || false;

    // Populate external links
    document.getElementById('project-link1-label').value = (project.externalLinks && project.externalLinks[0]) ? project.externalLinks[0].label : '';
    document.getElementById('project-link1-url').value = (project.externalLinks && project.externalLinks[0]) ? project.externalLinks[0].url : '';
    document.getElementById('project-link2-label').value = (project.externalLinks && project.externalLinks[1]) ? project.externalLinks[1].label : '';
    document.getElementById('project-link2-url').value = (project.externalLinks && project.externalLinks[1]) ? project.externalLinks[1].url : '';
    document.getElementById('project-link3-label').value = (project.externalLinks && project.externalLinks[2]) ? project.externalLinks[2].label : '';
    document.getElementById('project-link3-url').value = (project.externalLinks && project.externalLinks[2]) ? project.externalLinks[2].url : '';

    // Show/hide conditional fields
    toggleWebFileField();
}

function saveProject() {
    const formData = {
        title: document.getElementById('project-title').value.trim(),
        author: document.getElementById('project-author').value,
        status: document.getElementById('project-status').value,
        type: document.getElementById('project-type').value,
        description: document.getElementById('project-description').value.trim(),
        extraNotes: document.getElementById('project-extra-notes').value.trim(),
        platform: document.getElementById('project-platform').value.trim(),
        progress: document.getElementById('project-progress').value.trim(),
        completedDate: document.getElementById('project-completed-date').value,
        estimatedCompletion: document.getElementById('project-estimated-completion').value.trim(),
        backgroundImage: document.getElementById('project-background-image').value.trim(),
        webFile: document.getElementById('project-web-file').value.trim(),
        gameType: document.getElementById('project-game-type').value.trim(),
        collaboration: document.getElementById('project-collaboration').checked
    };

    // Process external links
    const externalLinks = [];

    const link1Label = document.getElementById('project-link1-label').value.trim();
    const link1Url = document.getElementById('project-link1-url').value.trim();
    if (link1Label && link1Url) {
        externalLinks.push({ label: link1Label, url: link1Url });
    }

    const link2Label = document.getElementById('project-link2-label').value.trim();
    const link2Url = document.getElementById('project-link2-url').value.trim();
    if (link2Label && link2Url) {
        externalLinks.push({ label: link2Label, url: link2Url });
    }

    const link3Label = document.getElementById('project-link3-label').value.trim();
    const link3Url = document.getElementById('project-link3-url').value.trim();
    if (link3Label && link3Url) {
        externalLinks.push({ label: link3Label, url: link3Url });
    }

    if (externalLinks.length > 0) {
        formData.externalLinks = externalLinks;
    }

    // Validation
    if (!formData.title || !formData.author || !formData.status || !formData.type || !formData.description) {
        alert('Please fill in all required fields.');
        return;
    }

    // Additional validation for web content
    if ((formData.type === 'web publication' || formData.type === 'web game') && !formData.webFile) {
        alert('Web File Path is required for web publications and web games.');
        return;
    }

    // Validate web file path format
    if (formData.webFile) {
        if (formData.type === 'web publication' && !formData.webFile.startsWith('publications/')) {
            alert('Web publications should have file path starting with "publications/"');
            return;
        }
        if (formData.type === 'web game' && !formData.webFile.startsWith('games/')) {
            alert('Web games should have file path starting with "games/"');
            return;
        }
    }

    // Validate background image path format
    if (formData.backgroundImage) {
        const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasValidExtension = validImageExtensions.some(ext =>
            formData.backgroundImage.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension) {
            alert('Background image should be a valid image file (.jpg, .png, .gif, .webp, .svg)');
            return;
        }

        // Suggest using assets/ folder
        if (!formData.backgroundImage.startsWith('assets/') && !formData.backgroundImage.startsWith('images/')) {
            if (confirm('Images are typically stored in "assets/" or "images/" folder. Continue anyway?')) {
                // User chose to continue
            } else {
                return;
            }
        }
    }

    if (editingProjectId) {
        // Update existing project
        const index = projects.findIndex(p => p.id === editingProjectId);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...formData };
        }
    } else {
        // Add new project
        const newProject = {
            id: generateProjectId(),
            ...formData
        };
        projects.push(newProject);
    }

    saveProjects();
    renderProjects();
    closeProjectModal();
}

function editProject(projectId) {
    openProjectModal(projectId);
}

function deleteProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project && confirm(`Are you sure you want to delete "${project.title}"?`)) {
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        renderProjects();
    }
}

function moveProject(projectId, direction) {
    const currentIndex = projects.findIndex(p => p.id === projectId);
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;

    // Check bounds
    if (newIndex < 0 || newIndex >= projects.length) return;

    // Swap projects
    const temp = projects[currentIndex];
    projects[currentIndex] = projects[newIndex];
    projects[newIndex] = temp;

    saveProjects();
    renderProjects();
}

function sortByNewest() {
    // Sort projects by completion date (most recent first), then by creation order
    projects.sort((a, b) => {
        // If both have completion dates, sort by date (newest first)
        if (a.completedDate && b.completedDate) {
            return new Date(b.completedDate) - new Date(a.completedDate);
        }
        // If only one has a completion date, completed projects go first
        if (a.completedDate && !b.completedDate) return -1;
        if (!a.completedDate && b.completedDate) return 1;

        // If neither has completion date, maintain current relative order
        return 0;
    });

    saveProjects();
    renderProjects();

    // Show feedback to user
    alert('Projects have been sorted by newest completion date!');
}

function updateJSONOutput() {
    const workStatusData = {
        lastUpdated: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects
    };

    const jsonOutput = document.getElementById('json-output');
    jsonOutput.textContent = JSON.stringify(workStatusData, null, 2);
}

function copyToClipboard() {
    const jsonOutput = document.getElementById('json-output');

    // Create a temporary textarea to copy from
    const textArea = document.createElement('textarea');
    textArea.value = jsonOutput.textContent;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard. Please copy manually.');
    }

    document.body.removeChild(textArea);
}

function downloadJSON() {
    const workStatusData = {
        lastUpdated: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects
    };

    const dataStr = JSON.stringify(workStatusData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'work-status.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load sample data if no projects exist
function loadSampleData() {
    if (projects.length === 0) {
        projects = [
            {
                id: 'sample-1',
                title: 'My Balloons',
                author: 'Alek & Juleah Miller',
                status: 'completed',
                type: "children's book",
                description: 'A whimsical story about letting go and finding joy, beautifully illustrated.',
                platform: 'Lulu',
                collaboration: true,
                backgroundImage: 'assets/pink_chicken.png'
            },
            {
                id: 'sample-2',
                title: 'Flash Fiction Collection',
                author: 'Alek Miller',
                status: 'completed',
                type: 'web publication',
                description: 'Short story collection exploring moments of wonder and connection.',
                webFile: 'publications/flash-fiction-collection.txt',
                completedDate: '2025-01-15'
            },
            {
                id: 'sample-3',
                title: 'Desert Memory',
                author: 'Alek Miller',
                status: 'completed',
                type: 'web game',
                description: 'Memory matching game with desert-themed symbols.',
                webFile: 'games/memory-game.html',
                gameType: 'Puzzle',
                completedDate: '2025-01-15'
            },
            {
                id: 'sample-4',
                title: 'Liminal',
                author: 'Juleah Miller',
                status: 'work-in-progress',
                type: 'comic',
                description: 'An ongoing webcomic exploring the spaces between worlds.',
                platform: 'Webtoon',
                progress: 'Episode 12 of 20',
                externalLinks: [
                    { label: 'Read on Webtoon', url: 'https://webtoon.com/liminal' },
                    { label: 'Artist Gallery', url: 'https://example.com/gallery' }
                ]
            }
        ];
        saveProjects();
        renderProjects();
    }
}

// Toggle visibility of conditional fields based on project type
function toggleWebFileField() {
    const projectType = document.getElementById('project-type').value;
    const webFileGroup = document.getElementById('web-file-group');
    const gameTypeGroup = document.getElementById('game-type-group');

    // Show web file field for web publications and web games
    if (projectType === 'web publication' || projectType === 'web game') {
        webFileGroup.style.display = 'block';
    } else {
        webFileGroup.style.display = 'none';
    }

    // Show game type field for web games
    if (projectType === 'web game') {
        gameTypeGroup.style.display = 'block';
    } else {
        gameTypeGroup.style.display = 'none';
    }
}

// Import JSON functionality
function importJSON() {
    const fileInput = document.getElementById('json-import-input');
    const statusDiv = document.getElementById('import-status');
    const importBtn = document.getElementById('import-btn');

    if (!fileInput.files[0]) {
        statusDiv.textContent = 'Please select a JSON file first';
        statusDiv.style.color = '#721c24';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);

            // Validate JSON structure
            if (!validateImportJSON(jsonData)) {
                statusDiv.textContent = 'Invalid JSON format. Please check the file structure.';
                statusDiv.style.color = '#721c24';
                return;
            }

            // Confirm with user before replacing projects
            const confirmMessage = `This will replace all current projects with ${jsonData.projects.length} projects from the file. Continue?`;
            if (!confirm(confirmMessage)) {
                statusDiv.textContent = 'Import cancelled';
                statusDiv.style.color = '#6c757d';
                return;
            }

            // Import the projects
            projects = jsonData.projects;
            saveProjects();
            renderProjects();

            // Update UI
            statusDiv.textContent = `Successfully imported ${projects.length} projects!`;
            statusDiv.style.color = '#155724';

            // Reset file input
            fileInput.value = '';
            importBtn.disabled = true;

            // Show success for a few seconds then clear
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 5000);

        } catch (error) {
            statusDiv.textContent = 'Error parsing JSON file: ' + error.message;
            statusDiv.style.color = '#721c24';
        }
    };

    reader.onerror = function() {
        statusDiv.textContent = 'Error reading file';
        statusDiv.style.color = '#721c24';
    };

    reader.readAsText(file);
}

// Validate imported JSON structure
function validateImportJSON(jsonData) {
    // Check if it has the expected structure
    if (!jsonData || typeof jsonData !== 'object') {
        return false;
    }

    // Must have projects array
    if (!Array.isArray(jsonData.projects)) {
        return false;
    }

    // Validate each project has required fields
    for (const project of jsonData.projects) {
        if (!project.id || !project.title || !project.author || !project.status || !project.type) {
            return false;
        }
    }

    return true;
}

// Make functions global for onclick handlers
window.importJSON = importJSON;
window.toggleWebFileField = toggleWebFileField;

// Initialize with sample data if needed
setTimeout(loadSampleData, 100);

// =============================================================================
// BLOG FUNCTIONALITY & TAB SWITCHING
// =============================================================================

// Global blog variables
let blogPosts = [];
let editingBlogIndex = -1;
let blogInitialized = false;

// Tab switching functionality
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(tabName + '-section').classList.add('active');

    // Initialize blog functionality if switching to blog tab
    if (tabName === 'blog') {
        initializeBlogFunctionality();
    }
}

// Initialize blog functionality
function initializeBlogFunctionality() {
    if (!blogInitialized) {
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const blogDateInput = document.getElementById('blog-date');
        if (blogDateInput) {
            blogDateInput.value = today;
        }

        // Auto-generate post ID from title
        const blogTitleInput = document.getElementById('blog-title');
        if (blogTitleInput) {
            blogTitleInput.addEventListener('input', function() {
                const title = this.value;
                const postId = generatePostId(title);
                const blogIdInput = document.getElementById('blog-id');
                if (blogIdInput) {
                    blogIdInput.value = postId;
                }
            });
        }

        // Character counters
        const blogExcerptInput = document.getElementById('blog-excerpt');
        const blogContentInput = document.getElementById('blog-content');

        if (blogExcerptInput) {
            blogExcerptInput.addEventListener('input', updateBlogExcerptCount);
        }
        if (blogContentInput) {
            blogContentInput.addEventListener('input', updateBlogContentCount);
        }

        // Initialize counters and toggle
        updateBlogExcerptCount();
        updateBlogContentCount();
        toggleBlogContentFields();
        renderBlogPosts();

        blogInitialized = true;
    }
}

function generatePostId(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function updateBlogExcerptCount() {
    const excerptInput = document.getElementById('blog-excerpt');
    const countElement = document.getElementById('blog-excerpt-count');
    if (excerptInput && countElement) {
        countElement.textContent = `${excerptInput.value.length} characters`;
    }
}

function updateBlogContentCount() {
    const contentInput = document.getElementById('blog-content');
    const countElement = document.getElementById('blog-content-count');
    if (contentInput && countElement) {
        countElement.textContent = `${contentInput.value.length} characters`;
    }
}

function toggleBlogContentFields() {
    const contentType = document.getElementById('blog-content-type');
    const blogFields = document.getElementById('blog-specific-fields');
    const excerptField = document.getElementById('blog-excerpt-field');
    const contentLabel = document.getElementById('blog-content-label');

    if (!contentType) return;

    if (contentType.value === 'blog') {
        if (blogFields) blogFields.style.display = 'block';
        if (excerptField) excerptField.style.display = 'block';
        if (contentLabel) contentLabel.textContent = 'Blog Content * (Markdown supported)';

        const excerptInput = document.getElementById('blog-excerpt');
        const idInput = document.getElementById('blog-id');
        if (excerptInput) excerptInput.required = true;
        if (idInput) idInput.required = true;
    } else {
        if (blogFields) blogFields.style.display = 'none';
        if (excerptField) excerptField.style.display = 'none';
        if (contentLabel) contentLabel.textContent = 'Publication Content * (Markdown supported)';

        const excerptInput = document.getElementById('blog-excerpt');
        const idInput = document.getElementById('blog-id');
        if (excerptInput) excerptInput.required = false;
        if (idInput) idInput.required = false;
    }
}

function renderBlogPosts() {
    const listContainer = document.getElementById('blog-posts-list');
    const postCount = document.getElementById('blog-post-count');

    if (!listContainer || !postCount) return;

    postCount.textContent = `${blogPosts.length} post${blogPosts.length !== 1 ? 's' : ''}`;

    if (blogPosts.length === 0) {
        listContainer.innerHTML = `
            <div class="no-posts" style="text-align: center; padding: 40px; color: #6c757d; background: #f8f9fa; border-radius: 6px;">
                <p>No blog posts loaded. Import your blog/index.json file or create a new post to get started.</p>
            </div>
        `;
        return;
    }

    let listHTML = '<div class="posts-list">';

    blogPosts.forEach((post, index) => {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        listHTML += `
            <div class="post-item">
                <div class="move-controls">
                    <button type="button" class="move-btn" onclick="moveBlogPost(${index}, -1)"
                            ${index === 0 ? 'disabled' : ''} title="Move up">↑</button>
                    <button type="button" class="move-btn" onclick="moveBlogPost(${index}, 1)"
                            ${index === blogPosts.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
                </div>
                <div class="post-info">
                    <div class="post-title" onclick="editBlogPost(${index})">${post.title}</div>
                    <div class="post-meta">${date} - by ${post.author}</div>
                    <div class="post-excerpt">${post.excerpt || 'No excerpt'}</div>
                </div>
                <div class="post-actions">
                    <button type="button" class="btn btn-secondary" onclick="editBlogPost(${index})">Edit</button>
                    <button type="button" class="btn btn-danger" onclick="deleteBlogPost(${index})">Delete</button>
                </div>
            </div>
        `;
    });

    listHTML += '</div>';
    listContainer.innerHTML = listHTML;
}

function newBlogPost() {
    editingBlogIndex = -1;
    ['blog-title', 'blog-author', 'blog-id', 'blog-excerpt', 'blog-content'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });

    const today = new Date().toISOString().split('T')[0];
    const blogDateInput = document.getElementById('blog-date');
    if (blogDateInput) blogDateInput.value = today;

    const contentTypeInput = document.getElementById('blog-content-type');
    if (contentTypeInput) contentTypeInput.value = 'blog';

    updateBlogExcerptCount();
    updateBlogContentCount();
    toggleBlogContentFields();

    const formTitle = document.getElementById('blog-form-title');
    const formSection = document.getElementById('blog-form-section');
    const previewSection = document.getElementById('blog-preview-section');

    if (formTitle) formTitle.textContent = 'New Blog Post';
    if (formSection) formSection.style.display = 'block';
    if (previewSection) previewSection.style.display = 'none';

    const titleInput = document.getElementById('blog-title');
    if (titleInput) titleInput.focus();

    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function editBlogPost(index) {
    if (index < 0 || index >= blogPosts.length) return;

    editingBlogIndex = index;
    const post = blogPosts[index];

    const fieldMapping = {
        'blog-title': post.title,
        'blog-author': post.author,
        'blog-date': post.date,
        'blog-id': post.id,
        'blog-excerpt': post.excerpt || '',
        'blog-content': post.content || ''
    };

    Object.entries(fieldMapping).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });

    const contentTypeInput = document.getElementById('blog-content-type');
    if (contentTypeInput) contentTypeInput.value = 'blog';

    updateBlogExcerptCount();
    updateBlogContentCount();
    toggleBlogContentFields();

    const formTitle = document.getElementById('blog-form-title');
    const formSection = document.getElementById('blog-form-section');
    const previewSection = document.getElementById('blog-preview-section');

    if (formTitle) formTitle.textContent = `Edit: ${post.title}`;
    if (formSection) formSection.style.display = 'block';
    if (previewSection) previewSection.style.display = 'none';

    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function cancelBlogEdit() {
    editingBlogIndex = -1;
    const formSection = document.getElementById('blog-form-section');
    const previewSection = document.getElementById('blog-preview-section');
    if (formSection) formSection.style.display = 'none';
    if (previewSection) previewSection.style.display = 'none';
}

function saveBlogPost() {
    const contentType = document.getElementById('blog-content-type')?.value;
    const title = document.getElementById('blog-title')?.value?.trim();
    const author = document.getElementById('blog-author')?.value;
    const date = document.getElementById('blog-date')?.value;
    const postId = document.getElementById('blog-id')?.value?.trim();
    const excerpt = document.getElementById('blog-excerpt')?.value?.trim();
    const content = document.getElementById('blog-content')?.value?.trim();

    // Basic validation for all content types
    if (!title || !author || !date || !content) {
        alert('Please fill in all required fields.');
        return;
    }

    // Additional validation for blog posts
    if (contentType === 'blog' && (!postId || !excerpt)) {
        alert('Please fill in all required fields (Post ID and Excerpt are required for blog posts).');
        return;
    }

    // For web publications, generate an ID from the title if not provided
    const finalPostId = postId || generatePostId(title);
    const finalExcerpt = excerpt || '';

    const duplicateIndex = blogPosts.findIndex((post, index) =>
        post.id === finalPostId && index !== editingBlogIndex
    );
    if (duplicateIndex !== -1) {
        alert(`A post with ID "${finalPostId}" already exists. Please use a different ID.`);
        return;
    }

    const postData = {
        id: finalPostId,
        title: title,
        date: date,
        author: author,
        excerpt: finalExcerpt,
        filename: `${finalPostId}.txt`,
        content: content
    };

    if (editingBlogIndex === -1) {
        blogPosts.unshift(postData);
        alert('Blog post created successfully!');
    } else {
        blogPosts[editingBlogIndex] = postData;
        alert('Blog post updated successfully!');
    }

    renderBlogPosts();
    cancelBlogEdit();
}

function deleteBlogPost(index) {
    if (index < 0 || index >= blogPosts.length) return;

    const post = blogPosts[index];
    const confirmDelete = confirm(`Are you sure you want to delete "${post.title}"?`);

    if (confirmDelete) {
        blogPosts.splice(index, 1);
        renderBlogPosts();

        if (editingBlogIndex === index) {
            cancelBlogEdit();
        } else if (editingBlogIndex > index) {
            editingBlogIndex--;
        }

        alert(`"${post.title}" has been deleted.`);
    }
}

function moveBlogPost(index, direction) {
    if (index < 0 || index >= blogPosts.length) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blogPosts.length) return;

    const temp = blogPosts[index];
    blogPosts[index] = blogPosts[newIndex];
    blogPosts[newIndex] = temp;

    if (editingBlogIndex === index) {
        editingBlogIndex = newIndex;
    } else if (editingBlogIndex === newIndex) {
        editingBlogIndex = index;
    }

    renderBlogPosts();
}

function importBlogJSON() {
    const fileInput = document.getElementById('blog-json-import');
    const file = fileInput?.files[0];

    if (!file) {
        alert('Please select a JSON file to import.');
        return;
    }

    if (!file.name.endsWith('.json')) {
        alert('Please select a valid JSON file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonContent = JSON.parse(e.target.result);

            if (!jsonContent.posts || !Array.isArray(jsonContent.posts)) {
                throw new Error('Invalid JSON structure: missing posts array');
            }

            for (const post of jsonContent.posts) {
                if (!post.id || !post.title || !post.date || !post.author || !post.excerpt || !post.filename) {
                    throw new Error('Invalid post structure: missing required fields');
                }
            }

            blogPosts = jsonContent.posts.map(post => ({
                ...post,
                content: ''
            }));

            renderBlogPosts();
            alert(`✅ Successfully imported ${blogPosts.length} blog posts!`);
            fileInput.value = '';

        } catch (error) {
            alert('❌ Error importing JSON file:\n\n' + error.message + '\n\nPlease check that you selected a valid blog/index.json file.');
            console.error('JSON Import Error:', error);
        }
    };

    reader.onerror = function() {
        alert('❌ Error reading file. Please try again.');
    };

    reader.readAsText(file);
}

function exportBlogJSON() {
    if (blogPosts.length === 0) {
        alert('No blog posts to export. Create some posts first.');
        return;
    }

    const exportData = {
        posts: blogPosts.map(post => ({
            id: post.id,
            title: post.title,
            date: post.date,
            author: post.author,
            excerpt: post.excerpt,
            filename: post.filename
        }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'index.json';
    downloadLink.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    alert(`✅ Exported ${blogPosts.length} blog posts to index.json`);
}

function generateBlogPreview() {
    const title = document.getElementById('blog-title')?.value;
    const author = document.getElementById('blog-author')?.value;
    const date = document.getElementById('blog-date')?.value;
    const content = document.getElementById('blog-content')?.value;

    if (!title || !author || !date || !content) {
        alert('Please fill in all required fields before generating preview.');
        return;
    }

    const dateObj = new Date(date);
    const readableDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let htmlContent = content
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^---$/gm, '<hr>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|l|p])(.+)$/gm, '<p>$1</p>')
        .replace(/<p><\/p>/g, '');

    const previewContent = `
        <h1>${title}</h1>
        <p style="font-style: italic; color: #666; margin-bottom: 2rem;">
            ${readableDate} - by ${author}
        </p>
        ${htmlContent}
    `;

    const previewContentElement = document.getElementById('blog-preview-content');
    const previewSection = document.getElementById('blog-preview-section');

    if (previewContentElement) previewContentElement.innerHTML = previewContent;
    if (previewSection) previewSection.style.display = 'block';

    if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Make blog functions global for onclick handlers
window.switchTab = switchTab;
window.newBlogPost = newBlogPost;
window.editBlogPost = editBlogPost;
window.cancelBlogEdit = cancelBlogEdit;
window.saveBlogPost = saveBlogPost;
window.deleteBlogPost = deleteBlogPost;
window.moveBlogPost = moveBlogPost;
window.importBlogJSON = importBlogJSON;
window.exportBlogJSON = exportBlogJSON;
window.generateBlogPreview = generateBlogPreview;
window.toggleBlogContentFields = toggleBlogContentFields;