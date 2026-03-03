# Setup Guide: Neon Database + Vercel Deployment

## 1. Create Neon Database

1. Go to [console.neon.tech](https://console.neon.tech/)
2. Sign up / Log in
3. Click "Create a project"
4. Choose a name (e.g., "quit-vaping") and region
5. Copy the **Connection String** (looks like `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

## 2. Run Database Schema

1. In Neon console, go to **SQL Editor**
2. Paste the contents of `docs/schema.sql`
3. Click **Run**

Or run via CLI:
```bash
psql "postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" -f docs/schema.sql
```

## 3. Set Environment Variables

### Option A: Vercel (Recommended)
1. Go to your Vercel project settings
2. Add environment variable:
   - `DATABASE_URL`: Your Neon connection string
   - `API_KEY`: (Optional) A random string for API authentication

### Option B: Local Development
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your values:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   API_KEY=your-random-secret-key
   ```

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 5. Verify Setup

1. Open your deployed app
2. You should see a green "Synced" indicator in the top-right
3. Make some changes (log a craving, update settings)
4. Check that the indicator shows "Syncing..." then "Synced"
5. Open the app on another device/browser - data should sync!

## Troubleshooting

**Sync indicator shows "Sync failed"**
- Check `DATABASE_URL` is set correctly in Vercel
- Check Neon console that the `app_data` table exists
- Check browser console for specific error messages

**Data not syncing across devices**
- Make sure both devices are accessing the same Vercel deployment
- Check that `API_KEY` matches (if set)
- Wait a few seconds - sync is debounced by 1 second

**"No data found" error**
- Run the schema SQL in Neon console
- Verify the row was created: `SELECT * FROM app_data;`

## Security Notes

- The `API_KEY` is optional but recommended if your app is publicly accessible
- Without an API key, anyone who can access your app URL can read/write your data
- For a single-user app like this, that's usually fine
- For additional security, use a long random string for `API_KEY`
