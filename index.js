require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.use(express.urlencoded({ extended: true }));

let nextShortUrl = 1;
const urlDatabase = {};

app.post('/api/shorturl', (req, res) => {
    const url = req.body.url;
    console.log(url)

    const urlPattern = /^(https?:\/\/)(www\.)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
  if (!urlPattern.test(url)) {
    return res.json({ error: 'invalid url' });
  }

    const shortUrl = nextShortUrl;
  urlDatabase[shortUrl] = url;
  nextShortUrl++;

    res.json({ original_url: url, short_url: shortUrl });
});





app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
