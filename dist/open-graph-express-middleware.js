// Express / Node.js Dynamic Open Graph Middleware (server.js)
// Intercepts social media web crawlers (Twitterbot, Discordbot, Facebook, etc.)
// and injects the dynamic Cloudinary image URL into <meta property="og:image">.

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const BOT_USER_AGENTS = [
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'discordbot',
  'slackbot',
  'whatsapp',
  'telegrambot'
];

app.get('/card/:id', async (req, res) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isSocialBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  
  // Fetch metadata from MongoDB using card ID
  const cardData = await fetchCardRecordFromMongo(req.params.id);
  const cloudinaryUrl = cardData?.imageUrl || 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
  const builderName = cardData?.name || 'Builder';

  let html = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf8');

  // Replace Open Graph placeholders with dynamic Cloudinary URL & metadata
  html = html
    .replace(/\{\{CLOUDINARY_IMAGE_URL\}\}/g, cloudinaryUrl)
    .replace(/\{\{BUILDER_NAME\}\}/g, builderName);

  if (isSocialBot) {
    // Send pre-populated HTML directly to crawler bot
    return res.status(200).send(html);
  }

  // Send regular client app bundle to normal browsers
  res.status(200).send(html);
});

async function fetchCardRecordFromMongo(id) {
  // Database lookup placeholder
  return { name: 'Goa Builder', imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/card.png' };
}

app.listen(3000, () => console.log('Server running on port 3000'));
