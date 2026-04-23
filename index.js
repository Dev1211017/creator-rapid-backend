const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Creator Rapid Backend is running' });
});

// Generate music endpoint
app.post('/generate-music', async (req, res) => {
  const { user_id, prompt, duration, tier } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // MusicGen API call will go here in next step
    res.json({
      status: 'processing',
      message: 'Music generation endpoint ready',
      prompt,
      tier: tier || 'LITE'
    });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Creator Rapid Backend running on port ${PORT}`);
});