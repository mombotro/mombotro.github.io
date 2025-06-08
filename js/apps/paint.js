// Paint Application for Windows 3.x
class PaintApp {
    constructor(window) {
        this.window = window;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'pencil';
        this.currentColor = '#000000';
        this.brushSize = 2;
        this.lastX = 0;
        this.lastY = 0;
        
        this.init();
    }

    init() {
        // Set up the window content
        const content = this.window.querySelector('.window-content');
        content.innerHTML = `
            <div class="menu-bar">
                <div class="menu-item">File
                    <div class="menu-dropdown">
                        <div class="menu-option" data-action="new">New</div>
                        <div class="menu-option" data-action="open">Open...</div>
                        <div class="menu-option" data-action="save">Save</div>
                        <div class="menu-option" data-action="save-as">Save As...</div>
                        <div class="menu-separator"></div>
                        <div class="menu-option" data-action="exit">Exit</div>
                    </div>
                </div>
                <div class="menu-item">Edit
                    <div class="menu-dropdown">
                        <div class="menu-option" data-action="undo">Undo</div>
                        <div class="menu-option" data-action="cut">Cut</div>
                        <div class="menu-option" data-action="copy">Copy</div>
                        <div class="menu-option" data-action="paste">Paste</div>
                        <div class="menu-separator"></div>
                        <div class="menu-option" data-action="clear">Clear</div>
                    </div>
                </div>
                <div class="menu-item">View
                    <div class="menu-dropdown">
                        <div class="menu-option" data-action="zoom-in">Zoom In</div>
                        <div class="menu-option" data-action="zoom-out">Zoom Out</div>
                        <div class="menu-separator"></div>
                        <div class="menu-option" data-action="grid">Show Grid</div>
                    </div>
                </div>
                <div class="menu-item">Help
                    <div class="menu-dropdown">
                        <div class="menu-option" data-action="help">Help Topics</div>
                        <div class="menu-option" data-action="about">About Paint</div>
                    </div>
                </div>
            </div>
            <div class="paint-toolbar">
                <div class="tool-group">
                    <button class="tool-button" data-tool="pencil" title="Pencil">✏️</button>
                    <button class="tool-button" data-tool="brush" title="Brush">🖌️</button>
                    <button class="tool-button" data-tool="eraser" title="Eraser">🧹</button>
                    <button class="tool-button" data-tool="line" title="Line">📏</button>
                    <button class="tool-button" data-tool="rectangle" title="Rectangle">⬜</button>
                    <button class="tool-button" data-tool="circle" title="Circle">⭕</button>
                    <button class="tool-button" data-tool="fill" title="Fill">🪣</button>
                    <button class="tool-button" data-tool="text" title="Text">📝</button>
                </div>
                <div class="tool-group">
                    <input type="color" class="color-picker" value="#000000">
                    <select class="brush-size">
                        <option value="1">1px</option>
                        <option value="2" selected>2px</option>
                        <option value="4">4px</option>
                        <option value="8">8px</option>
                        <option value="16">16px</option>
                    </select>
                </div>
            </div>
            <div class="paint-canvas-container">
                <canvas id="paint-canvas" width="800" height="600"></canvas>
            </div>
            <div class="paint-status-bar">
                <span class="status-coords">0, 0</span>
                <span class="status-size">800 x 600</span>
            </div>
        `;

        // Initialize canvas
        this.canvas = content.querySelector('#paint-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set initial tool
        this.setTool('pencil');
    }

    setupEventListeners() {
        // Tool buttons
        const toolButtons = this.window.querySelectorAll('.tool-button');
        toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setTool(button.dataset.tool);
                // Update active state
                toolButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Color picker
        const colorPicker = this.window.querySelector('.color-picker');
        colorPicker.addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });

        // Brush size
        const brushSize = this.window.querySelector('.brush-size');
        brushSize.addEventListener('change', (e) => {
            this.brushSize = parseInt(e.target.value);
        });

        // Canvas drawing events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Menu options
        const menuOptions = this.window.querySelectorAll('.menu-option');
        menuOptions.forEach(option => {
            option.addEventListener('click', () => {
                const action = option.dataset.action;
                this.handleMenuAction(action);
            });
        });

        // Status bar coordinates
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            this.window.querySelector('.status-coords').textContent = `${x}, ${y}`;
        });
    }

    setTool(tool) {
        this.currentTool = tool;
        this.canvas.style.cursor = this.getCursorForTool(tool);
    }

    getCursorForTool(tool) {
        switch(tool) {
            case 'pencil': return 'crosshair';
            case 'brush': return 'crosshair';
            case 'eraser': return 'cell';
            case 'line': return 'crosshair';
            case 'rectangle': return 'crosshair';
            case 'circle': return 'crosshair';
            case 'fill': return 'cell';
            case 'text': return 'text';
            default: return 'default';
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;

        // For tools that need immediate feedback
        if (this.currentTool === 'fill') {
            this.floodFill(this.lastX, this.lastY, this.currentColor);
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        switch(this.currentTool) {
            case 'pencil':
            case 'brush':
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                break;
            case 'eraser':
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                this.ctx.globalCompositeOperation = 'source-over';
                break;
            case 'line':
                // Clear previous line preview
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.putImageData(this.savedImageData, 0, 0);
                // Draw new line preview
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                break;
            case 'rectangle':
                // Clear previous rectangle preview
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.putImageData(this.savedImageData, 0, 0);
                // Draw new rectangle preview
                this.ctx.strokeRect(
                    this.lastX,
                    this.lastY,
                    x - this.lastX,
                    y - this.lastY
                );
                break;
            case 'circle':
                // Clear previous circle preview
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.putImageData(this.savedImageData, 0, 0);
                // Draw new circle preview
                const radius = Math.sqrt(
                    Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2)
                );
                this.ctx.beginPath();
                this.ctx.arc(this.lastX, this.lastY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
        }

        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Save the current state for tools that need it
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Finalize the drawing based on the tool
        switch(this.currentTool) {
            case 'line':
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                break;
            case 'rectangle':
                this.ctx.strokeRect(
                    this.lastX,
                    this.lastY,
                    x - this.lastX,
                    y - this.lastY
                );
                break;
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2)
                );
                this.ctx.beginPath();
                this.ctx.arc(this.lastX, this.lastY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
        }

        this.isDrawing = false;
    }

    floodFill(startX, startY, fillColor) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;

        const startPos = (startY * this.canvas.width + startX) * 4;
        const startR = pixels[startPos];
        const startG = pixels[startPos + 1];
        const startB = pixels[startPos + 2];
        const startA = pixels[startPos + 3];

        // Convert fill color to RGB
        const fillR = parseInt(fillColor.slice(1, 3), 16);
        const fillG = parseInt(fillColor.slice(3, 5), 16);
        const fillB = parseInt(fillColor.slice(5, 7), 16);

        // Don't fill if the color is the same
        if (startR === fillR && startG === fillG && startB === fillB) return;

        const stack = [[startX, startY]];
        while (stack.length) {
            const [x, y] = stack.pop();
            const pos = (y * this.canvas.width + x) * 4;

            if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) continue;
            if (pixels[pos] !== startR || pixels[pos + 1] !== startG || 
                pixels[pos + 2] !== startB || pixels[pos + 3] !== startA) continue;

            pixels[pos] = fillR;
            pixels[pos + 1] = fillG;
            pixels[pos + 2] = fillB;
            pixels[pos + 3] = 255;

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    handleMenuAction(action) {
        switch(action) {
            case 'new':
                if (confirm('Start a new drawing? Any unsaved changes will be lost.')) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
                break;
            case 'save':
                this.saveDrawing();
                break;
            case 'save-as':
                this.saveDrawingAs();
                break;
            case 'undo':
                // Implement undo functionality
                console.log('Undo not implemented yet');
                break;
            case 'clear':
                if (confirm('Clear the entire drawing?')) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
                break;
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
        }
    }

    saveDrawing() {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    saveDrawingAs() {
        // Implement save as dialog
        console.log('Save as not implemented yet');
    }

    showHelp() {
        const helpWindow = window.win3x.createGenericWindow('paint-help');
        helpWindow.querySelector('.program-content').innerHTML = `
            <div style="padding: 20px;">
                <h2>Paint Help</h2>
                <h3>Tools:</h3>
                <ul>
                    <li>✏️ Pencil: Draw freehand lines</li>
                    <li>🖌️ Brush: Draw with a brush effect</li>
                    <li>🧹 Eraser: Erase parts of your drawing</li>
                    <li>📏 Line: Draw straight lines</li>
                    <li>⬜ Rectangle: Draw rectangles</li>
                    <li>⭕ Circle: Draw circles</li>
                    <li>🪣 Fill: Fill an area with color</li>
                    <li>📝 Text: Add text to your drawing</li>
                </ul>
                <h3>Tips:</h3>
                <ul>
                    <li>Use the color picker to choose colors</li>
                    <li>Adjust brush size for different line thicknesses</li>
                    <li>Save your work regularly!</li>
                </ul>
            </div>
        `;
        window.win3x.windows.set('paint-help', helpWindow);
        window.win3x.focusWindow(helpWindow);
    }

    showAbout() {
        const aboutWindow = window.win3x.createGenericWindow('paint-about');
        aboutWindow.querySelector('.program-content').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>Paint</h2>
                <p>Version 1.0</p>
                <p>Part of MomBot OS</p>
                <p>© 2024 MomBot</p>
            </div>
        `;
        window.win3x.windows.set('paint-about', aboutWindow);
        window.win3x.focusWindow(aboutWindow);
    }
}

// Register the Paint application with the OS
window.win3x.registerApp('paint', (window) => {
    return new PaintApp(window);
}); 