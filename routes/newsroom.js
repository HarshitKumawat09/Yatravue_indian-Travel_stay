const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const parser = new Parser();

router.get('/newsroom', async (req, res) => {
  try {
    // Use the travel RSS feed for Indian travel news
    const feed = await parser.parseURL('https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms');
    const articles = feed.items.map(item => ({
      title: item.title,
      url: item.link,
      publishedAt: item.pubDate,
      source: { name: 'Times of India' },
      image: item.enclosure && item.enclosure.url ? item.enclosure.url : null // Try to get image
    }));
    res.render('newsroom', { articles, error: null });
  } catch (err) {
    res.render('newsroom', { articles: [], error: 'Failed to fetch news.' });
  }
});

module.exports = router;