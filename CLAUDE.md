# The Azirona Drift - Project Overview

> A collaborative creative portfolio website for Alek & Juleah Miller

## 🌵 Project Description

The Azirona Drift is a comprehensive creative portfolio website showcasing the collaborative work of author/game designer Alek Miller and artist Juleah Miller. The site features a "digital southwest" aesthetic with a warm, desert-inspired color palette and serves as both a portfolio showcase and an e-commerce platform for selling creative works.

## 🏗️ Architecture

**Tech Stack:**
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Data Management**: JSON-based content system
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **E-commerce**: Gumroad integration for PDF sales
- **Design**: Responsive, mobile-first approach

**Key Features:**
- Modal-based project detail system
- Global project filtering (All/Completed/In Progress/Planning)
- JSON-driven content management
- Interactive web game player
- YouTube playlist integration
- Gumroad PDF selling platform
- Author attribution system
- Project management editor tool

## 📁 File Structure

```
azirona/
├── index.html              # Main website
├── script.js               # Core functionality
├── styles.css              # Complete styling system
├── project-editor.html     # Content management tool
├── project-editor.js       # Editor functionality
├── CLAUDE.md              # This documentation
├── README.md              # Project README
├── assets/                # Images and media
│   └── pink_chicken.png   # My Balloons cover
├── games/                 # Web game files
│   └── kirbo/            # PICO-8 test game
└── JSON Data Files:
    ├── work-status.json       # Master project list
    ├── writing-projects.json  # Detailed writing projects
    ├── comics-projects.json   # Comic project details
    ├── games-projects.json    # Game project details
    ├── music-projects.json    # Music collection details
    ├── flash-fiction.json     # Flash fiction stories
    └── blog-posts.json        # Blog post content
```

## 🎨 Design System

**Color Palette:**
- Primary: Terracotta (#c65d00)
- Secondary: Clay (#b85333) 
- Accent: Sage (#8fbc8f)
- Background: Warm White (#fefcf8)
- Text: Charcoal (#2c2c2c)
- Highlight: Dusty Blue (#6b8cae)

**Typography:**
- Headers: System fonts with fallbacks
- Body: Readable system font stack
- Consistent spacing and hierarchy

## 🚀 Major Features Implemented

### 1. Content Management System
- **JSON-driven architecture** for easy content updates
- **Global project filtering** across all creative disciplines
- **Author attribution** system (Alek/Juleah/Collaborative)
- **Status tracking** (Planning/In Progress/Completed/Published)

### 2. Creative Portfolio Sections

**Writing Projects:**
- Detailed book information with excerpts
- Publisher and purchase link integration
- Author collaboration notes
- Reviews and awards display

**Comics Projects:**
- Visual project showcases
- Platform integration (Webtoon, etc.)
- Art style descriptions
- Collaboration details

**Games Projects:**
- Playable web game integration
- PICO-8 game support via iframe
- Download/purchase links
- Mechanics and tools documentation

**Music Collections:**
- YouTube playlist integration
- Track listings with descriptions
- Instrument and theme tagging
- Collaboration documentation

### 3. Interactive Features
- **Flash Fiction Reader** with navigation
- **Blog System** with post management
- **Web Game Player** with fullscreen support
- **Modal-based detail views** for all projects
- **Responsive navigation** with mobile support

### 4. E-commerce Integration
- **Gumroad PDF selling** with professional buttons
- **Multi-platform support** (Lulu, Itch.io, etc.)
- **Consistent button styling** and user experience
- **Purchase link management** in project editor

### 5. Project Management Tools
- **Visual project editor** with category-specific fields
- **Real-time JSON generation** and export
- **Local storage** for draft management
- **Mobile-responsive** editing interface

## 💻 Development Features

### Responsive Design
- Mobile-first CSS approach
- Flexible grid systems
- Touch-friendly interface elements
- Optimized modal experiences

### Performance
- Vanilla JavaScript for fast loading
- Efficient JSON data loading
- Optimized asset delivery
- Clean, semantic HTML structure

### Accessibility
- Keyboard navigation support
- Screen reader friendly markup
- High contrast design elements
- Focus management for modals

## 🛠️ Content Management

### Adding New Projects
1. Use the **Project Editor** (`project-editor.html`) for GUI management
2. Or manually edit the appropriate JSON file:
   - `writing-projects.json` for books/stories
   - `comics-projects.json` for visual narratives
   - `games-projects.json` for interactive media
   - `music-projects.json` for audio collections

### Project Editor Features
- Category-specific form fields
- Gumroad integration setup
- Author selection (Alek/Juleah/Both)
- Real-time JSON preview
- Export/download functionality

### Global Status Management
- All projects appear in `work-status.json` for filtering
- Automatic metadata calculation
- Status-based project organization

## 🎯 Key Accomplishments

### Phase 1: Foundation
- ✅ Core website structure and navigation
- ✅ Desert-themed visual design system
- ✅ Responsive layout architecture

### Phase 2: Content Systems
- ✅ JSON-based content management
- ✅ Flash fiction and blog readers
- ✅ Global project filtering system

### Phase 3: Portfolio Integration
- ✅ Writing project modals with purchase links
- ✅ Comics project showcase system
- ✅ Games integration with web player
- ✅ Music collections with YouTube integration

### Phase 4: E-commerce Platform
- ✅ Gumroad PDF selling integration
- ✅ Professional purchase button styling
- ✅ Multi-platform purchase support

### Phase 5: Management Tools
- ✅ Visual project editor interface
- ✅ Author attribution system
- ✅ Content management workflow

## 🔧 Technical Highlights

### JSON Architecture
Flexible, scalable content system allowing for:
- Easy project additions without code changes
- Consistent data structure across categories
- Author collaboration tracking
- Status and metadata management

### Modal System
Unified modal architecture providing:
- Consistent user experience across project types
- Keyboard navigation and accessibility
- Mobile-responsive design
- Click-outside-to-close functionality

### Game Integration
Innovative web game player featuring:
- PICO-8 HTML game support
- Fullscreen toggle functionality
- Secure iframe implementation
- Proper cleanup and resource management

### Gumroad Integration
Professional e-commerce implementation:
- Brand-consistent button styling
- Seamless integration with existing purchase flows
- Mobile-optimized checkout experience
- Easy management through project editor

## 🚀 Future Development

The architecture supports easy expansion for:
- Additional creative categories
- Enhanced e-commerce features
- User account systems
- Admin dashboard development
- API integration for external platforms

## 📝 Development Notes

### Commands for Development
- **No build process required** - vanilla HTML/CSS/JS
- **Local server recommended** for JSON loading
- **Git-based version control** with descriptive commits

### Best Practices Implemented
- Semantic HTML structure
- Progressive enhancement
- Mobile-first responsive design
- Accessible interaction patterns
- Clean, maintainable code organization

---

*Built with vanilla web technologies for maximum compatibility and performance.*
*Designed and developed in collaboration with Claude Code.*