import { Hono } from 'hono';
import { parseUrl } from '../integrations/metadata';

const metadata = new Hono();

metadata.post('/parse-url', async (c) => {
  try {
    const { url } = await c.req.json();

    if (!url) {
      return c.json({ success: false, error: 'URL is required' }, 400);
    }

    const data = await parseUrl(url);

    return c.json({ success: true, data });
  } catch (error) {
    console.error('Failed to parse URL metadata:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default metadata;
