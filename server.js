
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  const { prompt, targetLang } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Ты переводчик с швейцарского немецкого на ${targetLang}. Переводи кратко.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ translation: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Ошибка при обращении к OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при обращении к OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
