# PayPerPrompt Deployment Guide

## Deploying to Vercel

### Prerequisites
- Vercel account (free tier works)
- GitHub repository
- Vercel CLI installed

### Quick Deploy

#### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? payperprompt
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Option 2: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   # Create new repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/payperprompt.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"

### Environment Variables

After deployment, add these environment variables in Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:

```
NETWORK=testnet
RECIPIENT_ADDRESS=SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7
PAYMENT_AMOUNT_STX=0.1
OPENAI_API_KEY=your_openai_key_here (optional)
```

### Post-Deployment

1. **Get your URL:**
   - Vercel will provide a URL like: `https://payperprompt.vercel.app`

2. **Test the deployment:**
   ```bash
   curl https://payperprompt.vercel.app/api/health
   ```

3. **Update README:**
   - Add live demo link
   - Update screenshots with production URL

### Troubleshooting

**Issue: 404 on API routes**
- Check `vercel.json` is in root directory
- Verify routes configuration

**Issue: Environment variables not working**
- Redeploy after adding variables
- Check variable names match exactly

**Issue: CORS errors**
- Vercel handles CORS automatically
- Check if origin is allowed in server.js

### Alternative: Deploy to Railway

If you prefer a traditional server deployment:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add environment variables
railway variables set RECIPIENT_ADDRESS=SP...
railway variables set NETWORK=testnet
railway variables set PAYMENT_AMOUNT_STX=0.1

# Deploy
railway up
```

### Alternative: Deploy to Render

1. Go to https://render.com
2. Connect GitHub repository
3. Create new "Web Service"
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Custom Domain (Optional)

1. In Vercel dashboard, go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Monitoring

- **Vercel Analytics:** Built-in analytics available
- **Logs:** View in Vercel dashboard under "Deployments"
- **Performance:** Monitor in "Analytics" tab

### Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Dashboard loads correctly
- [ ] Analytics working
- [ ] CORS configured properly
- [ ] Error handling tested
- [ ] Custom domain added (optional)
- [ ] SSL certificate active (automatic on Vercel)

### Cost

- **Vercel Free Tier:**
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Perfect for hackathon demo

### Next Steps

1. Deploy to Vercel
2. Test all endpoints
3. Update README with live URL
4. Record demo video with production URL
5. Submit to DoraHacks with live demo link
