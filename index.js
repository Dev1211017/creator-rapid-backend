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

app.get('/', (req, res) => {
  res.json({ status: 'Creator Rapid Backend is running' });
});

app.post('/generate-music', async (req, res) => {
  const { prompt, duration, tier } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const prediction = await replicate.predictions.create({
      version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      input: {
        prompt: prompt,
        model_version: "stereo-large",
        output_format: "mp3",
        normalization_strategy: "peak",
        duration: duration || 8,
      }
    });

    const completed = await replicate.wait(prediction);

    res.json({
      status: 'complete',
      audio_url: completed.output,
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