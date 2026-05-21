const express = require('express');
require('dotenv').config();

const app = express();
const baseUrl = process.env.annieUrl

if (!baseUrl) {
  throw new Error('Missing annieUrl env var in .env');
}

const host = '192.168.0.122'
const port = 8000;

app.use(express.static('public'))

app.get('/api/config', (req, res) => {
    res.json({ baseUrl});
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
