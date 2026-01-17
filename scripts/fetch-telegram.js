const https = require('https');
const fs = require('fs');

// Configuration - channel username without @
const CHANNEL_USERNAME = (process.env.TELEGRAM_CHANNEL || '').replace('@', '');

if (!CHANNEL_USERNAME) {
  console.error('Missing TELEGRAM_CHANNEL environment variable');
  process.exit(1);
}

// Fetch the public channel page
function fetchChannelPage() {
  return new Promise((resolve, reject) => {
    const url = `https://t.me/s/${CHANNEL_USERNAME}`;
    console.log(`Fetching ${url}`);

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parse posts from the HTML
function parsePosts(html) {
  const posts = [];

  // Match each message widget
  const messageRegex = /<div class="tgme_widget_message_wrap[^"]*"[^>]*>[\s\S]*?<div class="tgme_widget_message text_not_supported_wrap[^"]*"[^>]*data-post="([^"]+)"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

  // Simpler approach: find all data-post attributes and extract content
  const postBlocks = html.split('tgme_widget_message_wrap');

  for (const block of postBlocks) {
    // Get post ID
    const postIdMatch = block.match(/data-post="([^"]+)"/);
    if (!postIdMatch) continue;

    const postId = postIdMatch[1];
    const messageId = postId.split('/')[1];

    // Get timestamp
    const timeMatch = block.match(/datetime="([^"]+)"/);
    const date = timeMatch ? timeMatch[1] : new Date().toISOString();

    // Get text content
    const textMatch = block.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="tgme_widget_message_footer|<\/div>\s*<\/div>)/);
    let text = '';
    if (textMatch) {
      text = textMatch[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
        .trim();
    }

    // Get author if present
    const authorMatch = block.match(/<span class="tgme_widget_message_from_author"[^>]*>([^<]+)<\/span>/);
    const author = authorMatch ? authorMatch[1].trim() : '';

    // Get photo if present
    const photoMatch = block.match(/tgme_widget_message_photo_wrap[^>]*style="[^"]*background-image:url\('([^']+)'\)/);
    const photo = photoMatch ? photoMatch[1] : null;

    if (text || photo) {
      posts.push({
        id: parseInt(messageId) || postId,
        date: date,
        text: text,
        author: author || 'Azirona Drift',
        photo: photo
      });
    }
  }

  return posts;
}

// Generate RSS feed
function generateRSS(posts) {
  const rssItems = posts.slice(0, 20).map(post => `
    <item>
      <title>${escapeXml(post.text.substring(0, 100) || 'Post')}</title>
      <description>${escapeXml(post.text)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>telegram-post-${post.id}</guid>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Azirona Blog</title>
    <link>https://azirona.com/</link>
    <description>hi there</description>
    <language>en-us</language>
    ${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync('blog/feed.xml', rss);
  console.log('Generated RSS feed');
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Main function
async function main() {
  try {
    console.log(`Fetching posts from @${CHANNEL_USERNAME}...`);

    const html = await fetchChannelPage();
    console.log(`Fetched ${html.length} bytes`);

    const posts = parsePosts(html);
    console.log(`Parsed ${posts.length} posts`);

    // Read existing posts if they exist
    let existingPosts = [];
    if (fs.existsSync('blog/posts.json')) {
      try {
        existingPosts = JSON.parse(fs.readFileSync('blog/posts.json', 'utf8'));
      } catch (e) {
        existingPosts = [];
      }
    }

    // Merge new posts with existing (avoid duplicates)
    const existingIds = new Set(existingPosts.map(p => p.id));
    const newPosts = posts.filter(p => !existingIds.has(p.id));

    const allPosts = [...existingPosts, ...newPosts].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    // Save to file
    fs.writeFileSync('blog/posts.json', JSON.stringify(allPosts, null, 2));
    console.log(`Saved ${allPosts.length} total posts (${newPosts.length} new)`);

    // Generate RSS feed
    generateRSS(allPosts);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
