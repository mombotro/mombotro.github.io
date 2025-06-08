// Windows 3.x OS Core Functionality
class WindowsOS {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndex = 100;
        this.startMenuVisible = false;
        this.systemTime = new Date();
        this.visitorCount = 0;
        this.theme = 'default';
        
        // Initialize OS
        this.init();
    }

    init() {
        // Load saved state
        this.loadState();
        
        // Initialize UI elements
        this.initDesktop();
        this.initTaskbar();
        this.initStartMenu();
        this.initSystemTray();
        
        // Start system clock
        this.startClock();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    loadState() {
        // Load saved settings from localStorage
        const savedTheme = localStorage.getItem('win3x_theme');
        if (savedTheme) this.theme = savedTheme;
        
        const savedVisitorCount = localStorage.getItem('win3x_visitor_count');
        if (savedVisitorCount) this.visitorCount = parseInt(savedVisitorCount);
        else {
            this.visitorCount = Math.floor(Math.random() * 1000) + 1;
            localStorage.setItem('win3x_visitor_count', this.visitorCount.toString());
        }
    }

    initDesktop() {
        // Create desktop icons
        const desktopIcons = [
            { id: 'my-computer', name: 'My Computer', icon: 'computer.png' },
            { id: 'paint', name: 'Paint', icon: 'paint.png' },
            { id: 'wordpad', name: 'WordPad', icon: 'wordpad.png' },
            { id: 'minesweeper', name: 'Minesweeper', icon: 'minesweeper.png' },
            { id: 'messenger', name: 'Messenger', icon: 'messenger.png' },
            { id: 'browser', name: 'Web Browser', icon: 'browser.png' },
            { id: 'mp3player', name: 'MP3 Player', icon: 'mp3player.png' },
            { id: 'portfolio', name: 'Art Portfolio', icon: 'portfolio.png' },
            { id: 'store', name: 'Retro Store', icon: 'store.png' },
            { id: 'guestbook', name: 'Guestbook', icon: 'guestbook.png' }
        ];

        const desktop = document.querySelector('.desktop');
        desktopIcons.forEach(icon => {
            const iconElement = this.createDesktopIcon(icon);
            desktop.appendChild(iconElement);
        });
    }

    createDesktopIcon(iconData) {
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.setAttribute('data-program', iconData.id);
        
        icon.innerHTML = `
            <img src="assets/icons/${iconData.icon}" alt="${iconData.name} Icon">
            <span>${iconData.name}</span>
        `;
        
        icon.addEventListener('click', () => this.launchProgram(iconData.id));
        icon.addEventListener('dblclick', () => this.launchProgram(iconData.id));
        
        return icon;
    }

    initTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <button class="start-button">Start</button>
            <div class="taskbar-programs"></div>
            <div class="system-tray">
                <div class="tray-icon" title="Volume">🔊</div>
                <div class="tray-icon" title="Network">📡</div>
                <div class="tray-icon" title="Mom Bot">👩</div>
            </div>
            <div class="taskbar-clock"></div>
        `;
        
        document.body.appendChild(taskbar);
        
        // Start button click handler
        taskbar.querySelector('.start-button').addEventListener('click', () => this.toggleStartMenu());
    }

    initStartMenu() {
        const startMenu = document.createElement('div');
        startMenu.className = 'start-menu';
        startMenu.innerHTML = `
            <div class="start-menu-item" data-program="mom-widget">
                <img src="assets/icons/mom.png" alt="Mom Widget">
                <span>Mom Widget</span>
            </div>
            <div class="start-menu-item" data-program="settings">
                <img src="assets/icons/settings.png" alt="Settings">
                <span>Settings</span>
            </div>
            <div class="start-menu-item" data-program="help">
                <img src="assets/icons/help.png" alt="Help">
                <span>Help</span>
            </div>
            <div class="start-menu-separator"></div>
            <div class="start-menu-item" data-program="shutdown">
                <img src="assets/icons/shutdown.png" alt="Shutdown">
                <span>Shutdown</span>
            </div>
        `;
        
        document.body.appendChild(startMenu);
        
        // Add click handlers for menu items
        startMenu.querySelectorAll('.start-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const program = item.getAttribute('data-program');
                this.launchProgram(program);
                this.toggleStartMenu();
            });
        });
    }

    initSystemTray() {
        // Initialize system tray icons and their functionality
        const trayIcons = document.querySelectorAll('.tray-icon');
        trayIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const action = e.target.getAttribute('title').toLowerCase();
                switch(action) {
                    case 'volume':
                        this.toggleVolume();
                        break;
                    case 'network':
                        this.toggleNetwork();
                        break;
                    case 'mom bot':
                        this.toggleMomBot();
                        break;
                }
            });
        });
    }

    initEventListeners() {
        // Global click handler to close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.hideStartMenu();
            }
        });

        // Handle window dragging
        document.addEventListener('mousedown', (e) => {
            const titleBar = e.target.closest('.title-bar');
            if (titleBar) {
                const window = titleBar.closest('.window-frame');
                this.startDragging(window, e);
            }
        });

        // Handle window resizing
        document.addEventListener('mousedown', (e) => {
            const resizeHandle = e.target.closest('.resize-handle');
            if (resizeHandle) {
                const window = resizeHandle.closest('.window-frame');
                this.startResizing(window, e);
            }
        });
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const dateString = now.toLocaleDateString();
            const clockElement = document.querySelector('.taskbar-clock');
            if (clockElement) {
                clockElement.textContent = `${timeString} ${dateString}`;
            }
        };

        // Update immediately and then every second
        updateClock();
        setInterval(updateClock, 1000);
    }

    launchProgram(programId) {
        // Check if program is already running
        if (this.windows.has(programId)) {
            const window = this.windows.get(programId);
            this.focusWindow(window);
            return;
        }

        // Create new window based on program type
        let window;
        switch(programId) {
            case 'paint':
                window = this.createPaintWindow();
                break;
            case 'wordpad':
                window = this.createWordPadWindow();
                break;
            case 'minesweeper':
                window = this.createMinesweeperWindow();
                break;
            case 'messenger':
                window = this.createMessengerWindow();
                break;
            case 'browser':
                window = this.createBrowserWindow();
                break;
            case 'mp3player':
                window = this.createMP3PlayerWindow();
                break;
            case 'mom-widget':
                window = this.createMomWidgetWindow();
                break;
            // Add more programs here
            default:
                window = this.createGenericWindow(programId);
        }

        if (window) {
            this.windows.set(programId, window);
            this.focusWindow(window);
        }
    }

    createGenericWindow(programId) {
        const window = document.createElement('div');
        window.className = 'window-frame';
        window.setAttribute('data-program', programId);
        
        const title = programId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        window.innerHTML = `
            <div class="title-bar">
                <span class="title-text">${title}</span>
                <div class="title-bar-buttons">
                    <button class="title-bar-button minimize-btn">—</button>
                    <button class="title-bar-button maximize-btn">□</button>
                    <button class="title-bar-button close-btn">×</button>
                </div>
            </div>
            <div class="window-content">
                <div class="menu-bar">
                    <div class="menu-item">File</div>
                    <div class="menu-item">Edit</div>
                    <div class="menu-item">View</div>
                    <div class="menu-item">Help</div>
                </div>
                <div class="program-content">
                    Loading ${title}...
                </div>
            </div>
        `;

        document.querySelector('.desktop').appendChild(window);
        this.setupWindowControls(window);
        return window;
    }

    setupWindowControls(window) {
        const titleBar = window.querySelector('.title-bar');
        const closeBtn = window.querySelector('.close-btn');
        const minimizeBtn = window.querySelector('.minimize-btn');
        const maximizeBtn = window.querySelector('.maximize-btn');

        // Close button
        closeBtn.addEventListener('click', () => {
            const programId = window.getAttribute('data-program');
            this.windows.delete(programId);
            window.remove();
        });

        // Minimize button
        minimizeBtn.addEventListener('click', () => {
            window.style.display = 'none';
            // Add to taskbar
            this.addToTaskbar(window);
        });

        // Maximize button
        maximizeBtn.addEventListener('click', () => {
            window.classList.toggle('maximized');
        });

        // Make window draggable
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target === titleBar || e.target.classList.contains('title-text')) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = window.offsetLeft;
                startTop = window.offsetTop;
                window.style.zIndex = ++this.zIndex;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                window.style.left = `${startLeft + dx}px`;
                window.style.top = `${startTop + dy}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    focusWindow(window) {
        // Bring window to front
        window.style.zIndex = ++this.zIndex;
        this.activeWindow = window;
        
        // Update taskbar
        this.updateTaskbar();
    }

    addToTaskbar(window) {
        const taskbar = document.querySelector('.taskbar-programs');
        const programId = window.getAttribute('data-program');
        const title = window.querySelector('.title-text').textContent;
        
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.setAttribute('data-program', programId);
        taskbarItem.textContent = title;
        
        taskbarItem.addEventListener('click', () => {
            if (window.style.display === 'none') {
                window.style.display = 'block';
                taskbarItem.classList.remove('minimized');
            } else {
                this.focusWindow(window);
            }
        });
        
        taskbar.appendChild(taskbarItem);
    }

    updateTaskbar() {
        const taskbar = document.querySelector('.taskbar-programs');
        taskbar.innerHTML = '';
        
        this.windows.forEach(window => {
            if (window.style.display !== 'none') {
                this.addToTaskbar(window);
            }
        });
    }

    toggleStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        if (startMenu) {
            startMenu.classList.toggle('visible');
            this.startMenuVisible = !this.startMenuVisible;
        }
    }

    hideStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        if (startMenu) {
            startMenu.classList.remove('visible');
            this.startMenuVisible = false;
        }
    }

    showWelcomeMessage() {
        const welcomeWindow = this.createGenericWindow('welcome');
        welcomeWindow.querySelector('.program-content').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>Welcome to MomBot OS!</h2>
                <p>Your friendly neighborhood Windows 3.x experience.</p>
                <p>Visitor #${this.visitorCount}</p>
                <p>Click on any desktop icon to get started!</p>
            </div>
        `;
        this.windows.set('welcome', welcomeWindow);
        this.focusWindow(welcomeWindow);
    }

    // Utility functions
    toggleVolume() {
        // Implement volume control
        console.log('Volume control clicked');
    }

    toggleNetwork() {
        // Implement network status
        console.log('Network status clicked');
    }

    toggleMomBot() {
        // Toggle Mom Bot widget
        if (this.windows.has('mom-widget')) {
            const window = this.windows.get('mom-widget');
            if (window.style.display === 'none') {
                window.style.display = 'block';
                this.focusWindow(window);
            } else {
                window.style.display = 'none';
            }
        } else {
            this.launchProgram('mom-widget');
        }
    }
}

// Initialize the OS when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.win3x = new WindowsOS();
}); 