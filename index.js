require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.json());


let nextShortUrl = 1;
const urlDatabase = {};

// Function to validate URLs using dns.lookup
function validateUrl(url, callback) {
  const match = url.match(/^(https?:\/\/)?([^/]+)/i);

  if (!match) {
    callback(false);
  } else {
    const hostname = match[2];
    dns.lookup(hostname, (err) => {
      callback(!err);
    });
  }
}

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Validate the URL
  validateUrl(url, (isValid) => {
    if (!isValid) {
      return res.json({ error: 'invalid url' });
    }

    // Store the URL in the database and assign a short_url
    const shortUrl = nextShortUrl;
    urlDatabase[shortUrl] = url;
    nextShortUrl++;

    res.json({ original_url: url, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;

  // Check if short_url exists in the database
  if (!urlDatabase[short_url]) {
    return res.json({ error: 'short_url not found' });
  }

  // Redirect to the original URL
  res.redirect(urlDatabase[short_url]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
