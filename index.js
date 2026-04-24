const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
    console.log(`Generating music for prompt: "${prompt}"`);

    const output = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      {
        input: {
          prompt: prompt,
          model_version: "stereo-large",
          output_format: "mp3",
          normalization_strategy: "peak",
          duration: duration || 8,
        }
      }
    );

    res.json({
      status: 'complete',
      audio_url: output,
      prompt,
      tier: tier || 'LITE'
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Generation failed', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Creator Rapid Backend running on port ${PORT}`);
});