const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5002;

// Use cors with specific options
app.use(cors({
  origin: 'http://localhost:3000', // Or whatever your React app's origin is
  methods: ['GET', 'POST', 'DELETE'], // Explicitly allow DELETE
  allowedHeaders: ['Content-Type'], // Add other headers if needed
}));
app.use(bodyParser.json());

// Proxy GET /logs to Flask server
app.get('/logs', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/logs');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching logs from Flask server:', error.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// ✅ Proxy DELETE /log to Flask server
app.delete('/log', async (req, res) => {
  try {
    const { timestamp } = req.body;
    console.log("Received DELETE request for timestamp:", timestamp); // Added log

    const response = await axios.delete('http://localhost:5001/log', {
      data: { timestamp },
    });

    console.log("Flask server response:", response.data); // Added log
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting log from Flask server:', error.message);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

app.listen(PORT, () => {
  console.log(`Node logger proxy running on port ${PORT}`);
});