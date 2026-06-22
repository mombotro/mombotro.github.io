// Room expansion system
class RoomSystem {
    constructor() {
        this.modal = document.getElementById('room-modal');
        this.content = document.getElementById('room-content');
        this.closeBtn = document.querySelector('.room-modal-close');

        this.setupListeners();
    }

    setupListeners() {
        // Room click handlers
        document.querySelectorAll('.farm-building[data-room]').forEach(building => {
            building.addEventListener('click', () => {
                const room = building.dataset.room;
                this.openRoom(room);
            });
        });

        // Close modal
        this.closeBtn.addEventListener('click', () => this.closeRoom());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeRoom();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeRoom();
        });
    }

    async openRoom(room) {
        try {
            const response = await fetch(`./gallery/${room}/index.html`);
            if (!response.ok) throw new Error(`Failed to load room: ${room}`);

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract content based on room type
            if (room === 'tools') {
                this.loadToolsRoom(doc);
            } else {
                this.loadDefaultRoom(doc);
            }

            this.modal.classList.add('active');
        } catch (error) {
            console.error('Error loading room:', error);
            this.content.innerHTML = `<p>Error loading room content</p>`;
            this.modal.classList.add('active');
        }
    }

    loadToolsRoom(doc) {
        const container = doc.querySelector('.container') || doc.querySelector('.tools-grid');

        if (container) {
            this.content.innerHTML = container.innerHTML;
        }
    }

    loadDefaultRoom(doc) {
        const container = doc.querySelector('.container') || doc.querySelector('.tools-grid');

        if (container) {
            this.content.innerHTML = container.innerHTML;
            this.setupImageLightbox();
        }
    }

    setupImageLightbox() {
        const images = this.content.querySelectorAll('img');
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.openImageLightbox(img.src, img.alt);
            });
        });
    }

    openImageLightbox(src, alt) {
        let lightbox = document.getElementById('image-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'image-lightbox';
            lightbox.className = 'image-lightbox';
            lightbox.innerHTML = '<img id="lightbox-image" src="" alt="">';
            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') lightbox.classList.remove('active');
            });
        }

        document.getElementById('lightbox-image').src = src;
        document.getElementById('lightbox-image').alt = alt;
        lightbox.classList.add('active');
    }

    closeRoom() {
        this.modal.classList.remove('active');
        this.content.innerHTML = '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.roomSystem = new RoomSystem();
});
