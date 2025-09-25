// Blog Writer JavaScript - Azirona Drift
// Handles blog post creation, preview, and file generation

// Global variable to store imported blog index
let importedBlogIndex = null;

document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('blog-date').value = today;

    // Auto-generate post ID from title
    document.getElementById('blog-title').addEventListener('input', function() {
        const title = this.value;
        const postId = generatePostId(title);
        document.getElementById('blog-id').value = postId;
    });

    // Character counters
    document.getElementById('blog-excerpt').addEventListener('input', updateExcerptCount);
    document.getElementById('blog-content').addEventListener('input', updateContentCount);

    // Initialize counters
    updateExcerptCount();
    updateContentCount();

    // Initialize content type toggle
    toggleContentFields();
});

function generatePostId(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

function updateExcerptCount() {
    const excerpt = document.getElementById('blog-excerpt').value;
    document.getElementById('excerpt-count').textContent = `${excerpt.length} characters`;
}

function updateContentCount() {
    const content = document.getElementById('blog-content').value;
    document.getElementById('content-count').textContent = `${content.length} characters`;
}

// New Post function - clears all fields
function newPost() {
    // Clear all form fields
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-author').value = '';
    document.getElementById('blog-id').value = '';
    document.getElementById('blog-excerpt').value = '';
    document.getElementById('blog-content').value = '';

    // Reset date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('blog-date').value = today;

    // Reset content type to blog
    document.getElementById('content-type').value = 'blog';

    // Update counters
    updateExcerptCount();
    updateContentCount();

    // Toggle fields based on content type
    toggleContentFields();

    // Hide preview and files sections
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('files-section').style.display = 'none';
    document.getElementById('blog-list-section').style.display = 'none';

    // Focus on title field
    document.getElementById('blog-title').focus();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle content fields based on type
function toggleContentFields() {
    const contentType = document.getElementById('content-type').value;
    const blogFields = document.getElementById('blog-specific-fields');
    const excerptField = document.getElementById('excerpt-field');
    const contentLabel = document.getElementById('content-label');

    if (contentType === 'blog') {
        blogFields.style.display = 'block';
        excerptField.style.display = 'block';
        contentLabel.textContent = 'Blog Content * (Markdown supported)';

        // Make excerpt required
        document.getElementById('blog-excerpt').required = true;
        document.getElementById('blog-id').required = true;
    } else {
        blogFields.style.display = 'none';
        excerptField.style.display = 'none';
        contentLabel.textContent = 'Publication Content * (Markdown supported)';

        // Remove excerpt requirement
        document.getElementById('blog-excerpt').required = false;
        document.getElementById('blog-id').required = false;
    }
}

function generatePreview() {
    const title = document.getElementById('blog-title').value;
    const author = document.getElementById('blog-author').value;
    const date = document.getElementById('blog-date').value;
    const content = document.getElementById('blog-content').value;

    if (!title || !author || !date || !content) {
        alert('Please fill in all required fields before generating preview.');
        return;
    }

    // Convert date to readable format
    const dateObj = new Date(date);
    const readableDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Convert markdown-like content to HTML for preview
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

    document.getElementById('preview-content').innerHTML = previewContent;
    document.getElementById('preview-section').style.display = 'block';

    // Scroll to preview
    document.getElementById('preview-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

async function generateFiles() {
    const contentType = document.getElementById('content-type').value;
    const title = document.getElementById('blog-title').value;
    const author = document.getElementById('blog-author').value;
    const date = document.getElementById('blog-date').value;
    const content = document.getElementById('blog-content').value;

    if (!title || !author || !date || !content) {
        alert('Please fill in all required fields before generating files.');
        return;
    }

    if (contentType === 'blog') {
        generateBlogFiles(title, author, date, content);
    } else {
        generateWebPublicationFiles(title, author, date, content);
    }
}

async function generateBlogFiles(title, author, date, content) {
    const postId = document.getElementById('blog-id').value;
    const excerpt = document.getElementById('blog-excerpt').value;

    if (!postId || !excerpt) {
        alert('Please fill in Post ID and Excerpt for blog posts.');
        return;
    }

    // Format date for display
    const dateObj = new Date(date);
    const readableDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Generate blog post content (markdown format)
    const blogContent = `# ${title}

*${readableDate} - by ${author}*

${content}`;

    // Create new blog post entry
    const newPost = {
        id: postId,
        title: title,
        date: date,
        author: author,
        excerpt: excerpt,
        filename: `${postId}.txt`
    };

    // Use imported blog index or create default template
    let blogIndex;
    if (importedBlogIndex) {
        // Use the imported blog index
        blogIndex = JSON.parse(JSON.stringify(importedBlogIndex)); // Deep copy
    } else {
        // Use default template
        blogIndex = {
            posts: [
                {
                    id: "welcome-to-the-drift",
                    title: "Welcome to the Drift",
                    date: "2025-01-15",
                    author: "Alek & Juleah Miller",
                    excerpt: "Our first post about starting this creative journey together.",
                    filename: "welcome-to-the-drift.txt"
                },
                {
                    id: "creative-process",
                    title: "Our Creative Process",
                    date: "2025-01-10",
                    author: "Alek Miller",
                    excerpt: "How we collaborate on books, games, and art.",
                    filename: "creative-process.txt"
                },
                {
                    id: "desert-inspiration",
                    title: "Desert Inspiration",
                    date: "2025-01-05",
                    author: "Juleah Miller",
                    excerpt: "Finding beauty in the southwestern landscape.",
                    filename: "desert-inspiration.txt"
                }
            ]
        };
    }

    // Add new post to the beginning (newest first)
    blogIndex.posts.unshift(newPost);

    // Generate updated blog index JSON
    const updatedIndexJSON = JSON.stringify(blogIndex, null, 2);

    // Display file information and create downloads
    displayGeneratedFiles(postId, updatedIndexJSON, blogContent);
}

async function generateWebPublicationFiles(title, author, date, content) {
    // Format date for display
    const dateObj = new Date(date);
    const readableDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Generate publication ID from title
    const publicationId = generatePostId(title);

    // Generate web publication content (markdown format)
    const publicationContent = `# ${title}

*by ${author}*
*Published: ${readableDate}*

${content}`;

    // Clear previous downloads
    document.getElementById('file-downloads').innerHTML = '';

    // Create downloadable file for web publication
    createDownloadableFile(`${publicationId}.txt`, publicationContent, 'text/plain');

    // Show files section with publication-specific messaging
    document.getElementById('files-section').style.display = 'block';

    // Update the messaging for web publications
    const filesSection = document.getElementById('files-section');
    const originalH3 = filesSection.querySelector('h3');
    const originalP = filesSection.querySelector('p');

    originalH3.textContent = 'Generated Web Publication';
    originalP.textContent = 'Your web publication file is ready for download:';

    // Hide JSON preview section for web publications
    const jsonPreviewSection = filesSection.querySelector('h4');
    const jsonPreview = document.getElementById('json-preview');
    if (jsonPreviewSection) jsonPreviewSection.style.display = 'none';
    if (jsonPreview) jsonPreview.style.display = 'none';

    // Show a different message about where to place the file
    if (!document.getElementById('publication-instructions')) {
        const instructionsDiv = document.createElement('div');
        instructionsDiv.id = 'publication-instructions';
        instructionsDiv.innerHTML = `
            <h4 style="margin-top: 20px; color: #c65d00;">Installation Instructions:</h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px;">
                <p style="margin: 0; font-size: 0.9em; color: #495057;">
                    1. Save the downloaded <code>${publicationId}.txt</code> file to your <code>publications/</code> directory<br>
                    2. Add this publication to your project data with type "web publication" and webFile: "publications/${publicationId}.txt"<br>
                    3. The publication will be accessible through your project showcase system
                </p>
            </div>
        `;
        filesSection.appendChild(instructionsDiv);
    }

    // Scroll to files section
    document.getElementById('files-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function createDownloadableFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.textContent = `Download ${filename}`;
    downloadLink.className = 'download-link';

    // Add to downloads container
    document.getElementById('file-downloads').appendChild(downloadLink);

    // Clean up URL after download
    downloadLink.addEventListener('click', () => {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
}

function displayGeneratedFiles(postId, updatedIndexJSON, blogContent) {
    // Clear previous downloads
    document.getElementById('file-downloads').innerHTML = '';

    // Reset section messaging to default (for blog posts)
    const filesSection = document.getElementById('files-section');
    const originalH3 = filesSection.querySelector('h3');
    const originalP = filesSection.querySelector('p');

    originalH3.textContent = 'Generated Files';
    originalP.textContent = 'Your blog files are ready for download:';

    // Show JSON preview section for blog posts
    const jsonPreviewSection = filesSection.querySelector('h4');
    const jsonPreview = document.getElementById('json-preview');
    if (jsonPreviewSection) jsonPreviewSection.style.display = 'block';
    if (jsonPreview) jsonPreview.style.display = 'block';

    // Remove any publication instructions
    const existingInstructions = document.getElementById('publication-instructions');
    if (existingInstructions) {
        existingInstructions.remove();
    }

    // Create downloadable files
    createDownloadableFile(`${postId}.txt`, blogContent, 'text/plain');
    createDownloadableFile('index.json', updatedIndexJSON, 'application/json');

    // Parse the updated JSON to show the blog post list
    try {
        const parsedIndex = JSON.parse(updatedIndexJSON);
        displayBlogPostList(parsedIndex.posts);
    } catch (error) {
        console.error('Error parsing updated JSON:', error);
    }

    // Show files section
    document.getElementById('files-section').style.display = 'block';

    // Display JSON preview
    document.getElementById('json-preview').textContent = updatedIndexJSON;

    // Scroll to files section
    document.getElementById('files-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Form validation
document.getElementById('blog-form').addEventListener('submit', function(e) {
    e.preventDefault();
    generateFiles();
});

// Prevent form submission on Enter in text inputs
document.querySelectorAll('input[type="text"], input[type="date"], select').forEach(input => {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

// JSON Import functionality
function importJSON() {
    const fileInput = document.getElementById('json-import');
    const file = fileInput.files[0];

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

            // Validate JSON structure
            if (!jsonContent.posts || !Array.isArray(jsonContent.posts)) {
                throw new Error('Invalid JSON structure: missing posts array');
            }

            // Validate each post has required fields
            for (const post of jsonContent.posts) {
                if (!post.id || !post.title || !post.date || !post.author || !post.excerpt || !post.filename) {
                    throw new Error('Invalid post structure: missing required fields');
                }
            }

            // Store the imported blog index
            importedBlogIndex = jsonContent;

            // Display the blog post list with delete functionality
            displayBlogPostList(jsonContent.posts, true);

            // Provide feedback
            const postCount = jsonContent.posts.length;
            alert(`✅ Successfully imported blog index with ${postCount} existing posts!\n\nWhen you generate files, your new post will be added to this existing collection.`);

            // Update button text to show import status
            const importButton = document.querySelector('button[onclick="importJSON()"]');
            importButton.innerHTML = '✅ JSON Imported (' + postCount + ' posts)';
            importButton.style.background = '#28a745';

            // Clear the file input
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

// Display blog post list
function displayBlogPostList(posts, allowDelete = false) {
    const blogListContainer = document.getElementById('blog-post-list');
    const blogListSection = document.getElementById('blog-list-section');

    if (!posts || posts.length === 0) {
        blogListContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #6c757d;">No blog posts found.</p>';
    } else {
        let listHTML = '';
        posts.forEach((post, index) => {
            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const deleteButton = allowDelete ?
                `<button class="delete-btn" onclick="deletePost('${post.id}')" title="Delete this post">🗑️ Delete</button>` : '';

            listHTML += `
                <div class="blog-post-item" data-post-id="${post.id}">
                    <div class="blog-post-info">
                        <div class="blog-post-title">${post.title}</div>
                        <div class="blog-post-meta">${date} - by ${post.author}</div>
                        <div class="blog-post-excerpt">${post.excerpt}</div>
                    </div>
                    <div class="blog-post-actions">
                        <div class="blog-post-id">${post.id}</div>
                        ${deleteButton}
                    </div>
                </div>
            `;
        });
        blogListContainer.innerHTML = listHTML;
    }

    // Show the blog list section
    blogListSection.style.display = 'block';
}

// Show blog list function
function showBlogList() {
    if (!importedBlogIndex || !importedBlogIndex.posts) {
        alert('No blog index loaded. Please import a blog/index.json file first.');
        return;
    }

    displayBlogPostList(importedBlogIndex.posts, true);

    // Scroll to blog list
    document.getElementById('blog-list-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Delete post function
function deletePost(postId) {
    if (!importedBlogIndex || !importedBlogIndex.posts) {
        alert('No blog index loaded.');
        return;
    }

    const postIndex = importedBlogIndex.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        alert('Post not found.');
        return;
    }

    const post = importedBlogIndex.posts[postIndex];
    const confirmDelete = confirm(`Are you sure you want to delete the post "${post.title}"?\n\nThis will remove it from your blog index. You'll need to generate new files to save these changes.`);

    if (confirmDelete) {
        // Remove the post from the imported blog index
        importedBlogIndex.posts.splice(postIndex, 1);

        // Update the display
        displayBlogPostList(importedBlogIndex.posts, true);

        // Show success message
        alert(`✅ Post "${post.title}" has been deleted from the blog index.\n\nGenerate new files to save these changes.`);

        // Update import button to reflect changes
        const importButton = document.querySelector('button[onclick="importJSON()"]');
        const postCount = importedBlogIndex.posts.length;
        importButton.innerHTML = '✅ JSON Modified (' + postCount + ' posts)';
        importButton.style.background = '#ffc107';
        importButton.style.color = '#212529';
    }
}

// Reset import status when page loads
document.addEventListener('DOMContentLoaded', function() {
    const importButton = document.querySelector('button[onclick="importJSON()"]');
    if (importButton) {
        importButton.innerHTML = '📥 Import blog/index.json';
        importButton.style.background = '#6c757d';
    }
});