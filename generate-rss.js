const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://sharafdin.com';
const POSTS_DIR = path.join(__dirname, 'posts');
const FEED_PATH = path.join(__dirname, 'feed.xml');

function generateRSS() {
    console.log('Generating RSS feed...');
    
    let itemsHtml = '';
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Simple regex to extract title and description (customize as needed)
        const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
        const title = titleMatch ? titleMatch[1] : file;
        
        const descMatch = content.match(/<p class="subtitle">(.*?)<\/p>/) || content.match(/<p>(.*?)<\/p>/);
        const description = descMatch ? descMatch[1] : 'No description available.';
        
        const dateMatch = content.match(/<time>(.*?)<\/time>/);
        const pubDate = dateMatch ? new Date(dateMatch[1]).toUTCString() : new Date().toUTCString();

        itemsHtml += `
  <item>
    <title>${title}</title>
    <link>${SITE_URL}/posts/${file}</link>
    <guid>${SITE_URL}/posts/${file}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
  </item>`;
    });

    const rssTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Mr Sharafdin - Blog</title>
  <link>${SITE_URL}/blog.html</link>
  <description>Innovator, Trier, and Open-Source Contributor</description>
  <language>en-us</language>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  ${itemsHtml}
</channel>
</rss>`;

    fs.writeFileSync(FEED_PATH, rssTemplate.trim());
    console.log('RSS feed updated successfully at feed.xml');
}

generateRSS();
