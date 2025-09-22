// Project Editor JavaScript

let projects = {
    writing: [],
    comics: [],
    games: [],
    music: []
};

let currentTab = 'writing';
let editingProject = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadSampleData();
    renderProjects();
});

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    currentTab = tabName;
    renderProjects();
}

// Load sample data or existing projects
function loadSampleData() {
    // Try to load from localStorage first
    const saved = localStorage.getItem('azirona-projects');
    if (saved) {
        projects = JSON.parse(saved);
    } else {
        // Initialize with some sample data
        projects = {
            writing: [
                {
                    id: 'sample-book',
                    title: 'Sample Book Project',
                    author: 'Alek Miller',
                    status: 'work-in-progress',
                    type: 'novel',
                    shortDescription: 'A sample book project to demonstrate the editor.',
                    detailedDescription: 'This is a longer description of the project with more details.',
                    genre: 'Literary Fiction'
                }
            ],
            comics: [],
            games: [],
            music: []
        };
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('azirona-projects', JSON.stringify(projects));
}

// Render projects for current tab
function renderProjects() {
    const container = document.getElementById(`${currentTab}-projects`);
    const projectList = projects[currentTab];

    if (projectList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">No projects yet. Click "Add New Project" to get started!</p>';
        updateJSON();
        return;
    }

    container.innerHTML = projectList.map(project => `
        <div class="project-item">
            <div class="project-info">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">
                    ${project.author} • ${project.type} • 
                    <span class="status-badge status-${project.status}">${project.status.replace('-', ' ')}</span>
                </div>
                <p style="margin-top: 8px; color: #6c757d;">${project.shortDescription}</p>
            </div>
            <div class="project-actions">
                <button class="btn btn-secondary" onclick="editProject('${project.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');

    updateJSON();
}

// Update JSON output
function updateJSON() {
    const jsonContainer = document.getElementById(`${currentTab}-json`);
    const collectionInfo = {
        writing: {
            title: "Writing Projects Collection",
            description: "Stories, books, and narrative works from The Azirona Drift",
            author: "Alek Miller"
        },
        comics: {
            title: "Comic Projects Collection", 
            description: "Comics, visual narratives, and collaborative works from The Azirona Drift",
            author: "Juleah Miller"
        },
        games: {
            title: "Game Projects Collection",
            description: "Games, interactive experiences, and playable projects from The Azirona Drift", 
            author: "Alek Miller"
        },
        music: {
            title: "Music Collections",
            description: "Musical works, soundscapes, and collaborative compositions from Alek & Juleah Miller",
            authors: "Alek & Juleah Miller"
        }
    };

    const output = {
        collection: collectionInfo[currentTab],
        projects: projects[currentTab],
        metadata: {
            totalProjects: projects[currentTab].length,
            lastUpdated: new Date().toISOString().split('T')[0]
        }
    };

    jsonContainer.textContent = JSON.stringify(output, null, 2);
}

// Modal functions
function openProjectModal(tab = null, projectId = null) {
    if (tab && tab !== currentTab) {
        switchTab(tab);
    }

    const modal = document.getElementById('project-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('project-form');

    if (projectId) {
        editingProject = projects[currentTab].find(p => p.id === projectId);
        title.textContent = 'Edit Project';
        populateForm(editingProject);
    } else {
        editingProject = null;
        title.textContent = 'Add New Project';
        form.reset();
        updateDynamicFields();
    }

    modal.classList.add('active');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    editingProject = null;
}

function populateForm(project) {
    document.getElementById('project-title').value = project.title || '';
    document.getElementById('project-author').value = project.author || 'Alek Miller';
    document.getElementById('project-status').value = project.status || 'planning';
    document.getElementById('project-type').value = project.type || '';
    document.getElementById('project-short-desc').value = project.shortDescription || '';
    document.getElementById('project-detailed-desc').value = project.detailedDescription || '';
    document.getElementById('project-genre').value = project.genre || '';
    
    if (project.publishDate || project.releaseDate) {
        document.getElementById('project-date').value = project.publishDate || project.releaseDate || '';
    }

    updateDynamicFields();
    
    // Populate dynamic fields after they're created
    setTimeout(() => {
        populateDynamicFields(project);
    }, 0);
}

function populateDynamicFields(project) {
    // Populate all dynamic fields if they exist
    Object.keys(project).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            if (key === 'themes' && Array.isArray(project[key])) {
                field.value = project[key].join(', ');
            } else {
                field.value = project[key];
            }
        }
    });
}

// Update dynamic fields based on project type
function updateDynamicFields() {
    const dynamicContainer = document.getElementById('dynamic-fields');
    const projectType = document.getElementById('project-type').value.toLowerCase();

    let fields = '';

    // Add fields based on project category and type
    if (currentTab === 'writing') {
        fields += `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Page Count</label>
                    <input type="number" id="pageCount" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Word Count</label>
                    <input type="number" id="wordCount" class="form-input">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Publisher</label>
                <input type="text" id="publisher" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">🛒 Gumroad Purchase URL</label>
                <input type="url" id="gumroadUrl" class="form-input" placeholder="https://your-username.gumroad.com/l/product-name">
                <small style="color: #6c757d; font-size: 0.9em;">Enter your Gumroad product URL to enable purchase button</small>
            </div>
            <div class="form-group">
                <label class="form-label">💰 Price</label>
                <input type="text" id="price" class="form-input" placeholder="e.g., $9.99">
            </div>
        `;
    } else if (currentTab === 'comics') {
        fields += `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Episode Count</label>
                    <input type="number" id="episodeCount" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Platform</label>
                    <input type="text" id="platform" class="form-input" placeholder="e.g., Webtoon">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Art Style</label>
                <input type="text" id="artStyle" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">🛒 Gumroad Purchase URL</label>
                <input type="url" id="gumroadUrl" class="form-input" placeholder="https://your-username.gumroad.com/l/product-name">
                <small style="color: #6c757d; font-size: 0.9em;">Enter your Gumroad product URL to enable purchase button</small>
            </div>
            <div class="form-group">
                <label class="form-label">💰 Price</label>
                <input type="text" id="price" class="form-input" placeholder="e.g., $9.99">
            </div>
        `;
    } else if (currentTab === 'games') {
        fields += `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Player Count</label>
                    <input type="text" id="playerCount" class="form-input" placeholder="e.g., 2-4 players">
                </div>
                <div class="form-group">
                    <label class="form-label">Play Time</label>
                    <input type="text" id="playTime" class="form-input" placeholder="e.g., 30-45 minutes">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Platform</label>
                <input type="text" id="platform" class="form-input" placeholder="e.g., Itch.io">
            </div>
            <div class="form-group">
                <label class="form-label">Has Web Version?</label>
                <select id="hasWebVersion" class="form-input form-select">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">🛒 Gumroad Purchase URL</label>
                <input type="url" id="gumroadUrl" class="form-input" placeholder="https://your-username.gumroad.com/l/product-name">
                <small style="color: #6c757d; font-size: 0.9em;">Enter your Gumroad product URL to enable purchase button</small>
            </div>
            <div class="form-group">
                <label class="form-label">💰 Price</label>
                <input type="text" id="price" class="form-input" placeholder="e.g., $9.99">
            </div>
        `;
    } else if (currentTab === 'music') {
        fields += `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Track Count</label>
                    <input type="number" id="trackCount" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Duration</label>
                    <input type="text" id="totalDuration" class="form-input" placeholder="e.g., 45 minutes">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">YouTube Playlist URL</label>
                <input type="url" id="youtubePlaylist" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">🛒 Gumroad Purchase URL</label>
                <input type="url" id="gumroadUrl" class="form-input" placeholder="https://your-username.gumroad.com/l/product-name">
                <small style="color: #6c757d; font-size: 0.9em;">Enter your Gumroad product URL to enable purchase button</small>
            </div>
            <div class="form-group">
                <label class="form-label">💰 Price</label>
                <input type="text" id="price" class="form-input" placeholder="e.g., $9.99">
            </div>
        `;
    }

    // Common fields for all types
    fields += `
        <div class="form-group">
            <label class="form-label">Themes (comma-separated)</label>
            <input type="text" id="themes" class="form-input" placeholder="e.g., technology, nature, memory">
        </div>
        <div class="form-group">
            <label class="form-label">Collaboration Note</label>
            <input type="text" id="collaboration" class="form-input" placeholder="e.g., Art by Juleah Miller">
        </div>
    `;

    dynamicContainer.innerHTML = fields;
}

// Listen for type changes to update dynamic fields
document.addEventListener('change', function(e) {
    if (e.target.id === 'project-type') {
        updateDynamicFields();
    }
});

// Form submission
document.getElementById('project-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveProject();
});

function saveProject() {
    const formData = new FormData(document.getElementById('project-form'));
    
    const project = {
        id: editingProject ? editingProject.id : generateId(),
        title: document.getElementById('project-title').value,
        author: document.getElementById('project-author').value,
        status: document.getElementById('project-status').value,
        type: document.getElementById('project-type').value,
        shortDescription: document.getElementById('project-short-desc').value,
        detailedDescription: document.getElementById('project-detailed-desc').value,
        genre: document.getElementById('project-genre').value
    };

    // Add date if provided
    const date = document.getElementById('project-date').value;
    if (date) {
        if (currentTab === 'music') {
            project.releaseDate = date;
        } else {
            project.publishDate = date;
        }
    }

    // Add dynamic fields
    const dynamicFields = document.querySelectorAll('#dynamic-fields input, #dynamic-fields select');
    dynamicFields.forEach(field => {
        const value = field.value;
        if (value) {
            if (field.id === 'themes') {
                project[field.id] = value.split(',').map(s => s.trim()).filter(s => s);
            } else if (field.type === 'number') {
                project[field.id] = parseInt(value);
            } else if (field.id === 'hasWebVersion') {
                project[field.id] = value === 'true';
            } else {
                project[field.id] = value;
            }
        }
    });

    // Update or add project
    if (editingProject) {
        const index = projects[currentTab].findIndex(p => p.id === editingProject.id);
        projects[currentTab][index] = project;
    } else {
        projects[currentTab].push(project);
    }

    saveProjects();
    renderProjects();
    closeProjectModal();
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function editProject(projectId) {
    openProjectModal(null, projectId);
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects[currentTab] = projects[currentTab].filter(p => p.id !== projectId);
        saveProjects();
        renderProjects();
    }
}

// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('JSON copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('JSON copied to clipboard!');
    }
}

function downloadJSON(category) {
    const jsonContainer = document.getElementById(`${category}-json`);
    const jsonData = jsonContainer.textContent;
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category}-projects.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Close modal when clicking outside
document.getElementById('project-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProjectModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});