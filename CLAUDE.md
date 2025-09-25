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
- Blog writer and web publication creation tool
- Blog post management with deletion capabilities

## 📁 File Structure

```
azirona/
├── index.html              # Main website
├── script.js               # Core functionality
├── styles.css              # Complete styling system
├── project-editor.html     # Content management tool
├── project-editor.js       # Editor functionality
├── blog-writer.html        # Blog and publication creation tool
├── blog-writer.js          # Blog writer functionality
├── CLAUDE.md              # This documentation
├── README.md              # Project README
├── CNAME                  # Custom domain configuration
├── work-status.json       # Master project list and content
├── assets/                # Images and media
├── blog/                  # Blog post files
│   └── index.json         # Blog post metadata
├── games/                 # Web game files
│   ├── kirbo/            # PICO-8 test game
│   ├── memory-game.html  # Memory card game
│   └── word-chain.html   # Word chain game
└── publications/          # Published works and PDFs
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
2. Or manually edit the `work-status.json` file which now contains all project data:
   - Consolidated content management in single JSON file
   - Separate blog posts stored in `/blog/` directory
   - Games stored as standalone HTML files in `/games/`
   - Publications stored in `/publications/` directory

### Project Editor Features
- Category-specific form fields
- External links management (up to 3 configurable web links per project)
- JSON import/export functionality for data backup and restoration
- Gumroad integration setup
- Author selection (Alek/Juleah/Both)
- Real-time JSON preview
- Export/download functionality
- File validation and error handling for imports

### Global Status Management
- All projects consolidated in `work-status.json` for unified management
- Comprehensive project data including content, metadata, and links
- Status-based project organization with filtering capabilities
- Streamlined content architecture for easier maintenance

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

### Phase 6: Enhanced Project Management
- ✅ External links system (3 configurable links per project)
- ✅ JSON import/export functionality for data backup
- ✅ Project data validation and error handling
- ✅ Clickable external links in project displays

### Phase 7: Content Creation Tools
- ✅ Blog writer tool with markdown support
- ✅ Web publication creation functionality
- ✅ Blog post management with deletion capabilities
- ✅ JSON import/export for blog index management
- ✅ Multi-content type support (blog posts vs web publications)

### Phase 8: Expanded Project Types
- ✅ Video project type support with 🎬 icon
- ✅ Purple accent styling for video projects
- ✅ Integration with external video platforms

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

### External Links System
Flexible external link management:
- Up to 3 configurable links per project with custom labels
- Support for any external platform (Lulu, Webtoon, Itch.io, etc.)
- Clickable links in project displays with visual indicators
- JSON-based storage for easy management and portability

### Data Backup & Import System
Comprehensive data management:
- JSON export functionality for complete project backup
- Import validation with error handling and user confirmation
- File format validation and structure verification
- Warning system to prevent accidental data loss
- Seamless restoration of all project data and configurations

### Blog Writer Tool
Advanced content creation system:
- Dual-mode content creation (blog posts vs web publications)
- Real-time markdown preview with proper formatting
- Automatic file generation with download functionality
- Blog post management with import/export capabilities
- Post deletion with confirmation safeguards
- Character counting and form validation
- Integration with existing blog system architecture

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