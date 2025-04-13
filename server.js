// 📁 server.js
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const client = new OpenAI({
  apiKey: "sk-XIVuRjLd6iCGp6lHy45jTaDLQtFICMnGapsxtyvwHMgMa9AK",
  baseURL: "https://api.opentyphoon.ai/v1"
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/generate-question', async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "typhoon-v1.5-instruct",
      messages: [
        {
          role: "user",
          content: `
            สร้างคำถามคณิตศาสตร์ระดับมัธยมปลายเป็นภาษาอังกฤษ 1 ข้อ พร้อมคำตอบ เช่น:
            {"question": "7 + 5 = ?", "answer": 12}
            ส่งในรูปแบบ JSON
          `
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 0.9
    });

    const text = completion.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      res.json(data);
    } else {
      res.status(500).json({ error: 'Invalid response format from LLM.' });
    }
  } catch (error) {
    console.error('LLM error:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
