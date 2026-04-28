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
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'Creator Rapid Backend is running' });
});

app.post('/generate-music', async (req, res) => {
  const { prompt, duration, tier, mic_audio_url } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const input = {
      prompt: prompt,
      model_version: mic_audio_url ? "stereo-melody-large" : "stereo-large",
      output_format: "mp3",
      normalization_strategy: "peak",
      duration: duration || 8,
    };

    if (mic_audio_url) {
      input.input_audio = mic_audio_url;
      input.continuation = false;
    }
      output_format: "mp3",
      normalization_strategy: "peak",
      duration: duration || 8,
    };

    if (mic_audio_url) {
      input.input_audio = mic_audio_url;
      input.continuation = false;
    }

    const prediction = await replicate.predictions.create({
      version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      input: input,
    });

    const completed = await replicate.wait(prediction, { interval: 2000 });

    res.json({
      status: 'complete',
      audio_url: completed.output,
      prompt,
      tier: tier || 'LITE',
      used_mic_input: !!mic_audio_url,
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