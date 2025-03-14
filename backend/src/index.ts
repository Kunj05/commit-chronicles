import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: message,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        },
      }
    );

    const aiMessage = response.data.choices[0].text.trim();
    res.json({ message: aiMessage });
  } catch (error) {
    console.error('Error fetching AI response:', error);
    res.status(500).json({ error: 'Error fetching AI response' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});