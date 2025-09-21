# The Azirona Drift

A digital minimal southwest aesthetic website for author/game designer Alek Miller and artist Juleah Miller.

## Local Development

To run this website locally and load the JSON data properly, you need to serve the files through a local web server (not open directly in browser).

### Quick Start Options:

**Python (if installed):**
```bash
# Navigate to the project folder
cd azirona

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Node.js (if installed):**
```bash
# Install a simple server globally
npm install -g http-server

# Navigate to project folder and run
cd azirona
http-server -p 8000
```

**VS Code (if using):**
- Install "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

**PHP (if installed):**
```bash
cd azirona
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```
azirona/
├── index.html          # Main website
├── styles.css          # Southwest aesthetic styling
├── script.js           # Interactive functionality
├── flash-fiction.json  # Story data (JSON format)
└── README.md           # This file
```

## Flash Fiction Management

Stories are managed through `flash-fiction.json`. To add/edit stories:

1. Edit the JSON file with your preferred text editor
2. Follow the existing structure for new stories
3. Refresh the website to see changes

### JSON Structure:
```json
{
  "collection": {
    "title": "Flash Fiction Collection",
    "description": "Description here",
    "author": "Author Name"
  },
  "stories": [
    {
      "id": "unique-story-id",
      "title": "Story Title",
      "wordCount": 150,
      "readTime": "1 min read",
      "tags": ["tag1", "tag2"],
      "dateWritten": "2025-01-15",
      "content": [
        "First paragraph...",
        "Second paragraph..."
      ]
    }
  ]
}
```

## Features

- **Responsive Design**: Works on desktop and mobile
- **Flash Fiction Reader**: Modal-based story reading experience
- **Work Status Tracking**: Toggle between Alek's and Juleah's projects
- **Interactive To-Do List**: Persistent local storage
- **Smooth Animations**: Parallax effects and transitions
- **Keyboard Navigation**: Arrow keys for story navigation, Esc to close

## Deployment

For production deployment, simply upload all files to any web server. The JSON loading will work automatically when served over HTTP/HTTPS.