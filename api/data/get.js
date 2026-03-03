const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key if configured
  const apiKey = process.env.API_KEY;
  const providedKey = req.headers['x-api-key'];
  if (apiKey && providedKey !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT data, updated_at
      FROM app_data
      WHERE id = 1
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    return res.status(200).json({
      data: result[0].data,
      updatedAt: result[0].updated_at,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
