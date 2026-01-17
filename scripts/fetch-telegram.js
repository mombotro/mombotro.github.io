const https = require('https');
const fs = require('fs');

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL; // e.g., @azironablog

if (!BOT_TOKEN || !CHANNEL_USERNAME) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Function to make Telegram API requests
function telegramRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}?${queryString}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.ok) {
            resolve(json.result);
          } else {
            reject(new Error(json.description));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Get channel info to get chat ID
async function getChannelId() {
  const chat = await telegramRequest('getChat', {
    chat_id: CHANNEL_USERNAME
  });
  return chat.id;
}

// Fetch recent messages from channel
async function fetchMessages(chatId, limit = 50) {
  try {
    const updates = await telegramRequest('getUpdates', {
      limit: 100,
      allowed_updates: JSON.stringify(['channel_post'])
    });
    
    // Filter for messages from our channel
    const channelPosts = updates
      .filter(update => update.channel_post && update.channel_post.chat.id === chatId)
      .map(update => update.channel_post)
      .slice(0, limit);
    
    return channelPosts;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Format posts for blog
function formatPosts(messages) {
  return messages.map(msg => {
    const post = {
      id: msg.message_id,
      date: new Date(msg.date * 1000).toISOString(),
      text: msg.text || msg.caption || '',
      author: msg.author_signature || 'Azirona Drift'
    };
    
    // Handle photos
    if (msg.photo) {
      const largestPhoto = msg.photo[msg.photo.length - 1];
      post.photo = {
        file_id: largestPhoto.file_id,
        width: largestPhoto.width,
        height: largestPhoto.height
      };
    }
    
    // Handle other media types
    if (msg.video) post.video = msg.video.file_id;
    if (msg.document) post.document = msg.document.file_id;
    
    return post;
  }).reverse(); // Oldest first
}

// Main function
async function main() {
  try {
    console.log('Fetching channel posts...');
    const chatId = await getChannelId();
    console.log(`Channel ID: ${chatId}`);
    
    const messages = await fetchMessages(chatId);
    console.log(`Found ${messages.length} posts`);
    
    const posts = formatPosts(messages);
    
    // Read existing posts if they exist
    let existingPosts = [];
    if (fs.existsSync('blog/posts.json')) {
      existingPosts = JSON.parse(fs.readFileSync('blog/posts.json', 'utf8'));
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

// Generate RSS feed
function generateRSS(posts) {
  const rssItems = posts.slice(0, 20).map(post => `
    <item>
      <title>${escapeXml(post.text.substring(0, 100))}</title>
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

main();