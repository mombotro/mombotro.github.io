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

    container.innerHTML = filteredProjects.map(project => {
        const externalLinksHtml = project.externalLinks && project.externalLinks.length > 0
            ? project.externalLinks.map(link => `<span>🔗 <a href="${link.url}" target="_blank" style="color: #c65d00; text-decoration: none;">${link.label}</a></span>`).join(' ')
            : '';

        return `
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