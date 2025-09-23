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

    // Filter projects
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

    container.innerHTML = filteredProjects.map(project => `
        <div class="project-item">
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
                </div>
            </div>
            <div class="project-actions">
                <button class="btn btn-secondary" onclick="editProject('${project.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');
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
    document.getElementById('project-platform').value = project.platform || '';
    document.getElementById('project-progress').value = project.progress || '';
    document.getElementById('project-completed-date').value = project.completedDate || '';
    document.getElementById('project-estimated-completion').value = project.estimatedCompletion || '';
    document.getElementById('project-background-image').value = project.backgroundImage || '';
    document.getElementById('project-web-file').value = project.webFile || '';
    document.getElementById('project-game-type').value = project.gameType || '';
    document.getElementById('project-collaboration').checked = project.collaboration || false;

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
        platform: document.getElementById('project-platform').value.trim(),
        progress: document.getElementById('project-progress').value.trim(),
        completedDate: document.getElementById('project-completed-date').value,
        estimatedCompletion: document.getElementById('project-estimated-completion').value.trim(),
        backgroundImage: document.getElementById('project-background-image').value.trim(),
        webFile: document.getElementById('project-web-file').value.trim(),
        gameType: document.getElementById('project-game-type').value.trim(),
        collaboration: document.getElementById('project-collaboration').checked
    };

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
                progress: 'Episode 12 of 20'
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

// Make function global for onchange handler
window.toggleWebFileField = toggleWebFileField;

// Initialize with sample data if needed
setTimeout(loadSampleData, 100);