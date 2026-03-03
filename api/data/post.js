const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key if configured
  const apiKey = process.env.API_KEY;
  const providedKey = req.headers['x-api-key'];
  if (apiKey && providedKey !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      UPDATE app_data
      SET data = ${JSON.stringify(data)}::jsonb,
          updated_at = NOW()
      WHERE id = 1
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: 'Failed to update data' });
  }
}
