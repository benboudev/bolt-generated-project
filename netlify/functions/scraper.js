import axios from 'axios';
import cheerio from 'cheerio';

export const handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body || '{}');
    
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Example: Get all headings and paragraphs
    const data = {
      title: $('title').text(),
      headings: $('h1, h2, h3').map((_, el) => $(el).text()).get(),
      paragraphs: $('p').map((_, el) => $(el).text()).get()
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
