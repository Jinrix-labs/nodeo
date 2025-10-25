# 🚀 Nodeo Deployment Guide

## Vercel Deployment

### Prerequisites

- GitHub account
- Vercel account (free tier available)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Ensure all files are committed:**
   - `package.json` with prebuild script ✅
   - `src/challenges/nvidiaPack.ts` ✅
   - All source files ✅
   - Vercel will auto-detect Vite configuration ✅

### Step 2: Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. **Build Settings** (should auto-detect):
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Step 3: Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
VITE_OPENAI_API_KEY=your_actual_openai_api_key
```

**Note:** The `VITE_` prefix is required for client-side access in Vite.

### Step 4: Build Configuration

Vercel will automatically:

- Run `npm run prebuild` (generates nvidia pack)
- Run `npm run build` (builds the app)
- Deploy the `dist` folder

### Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Build Process

The deployment process:

1. **Prebuild:** Generates `src/challenges/nvidiaPack.ts` from nvidia-practice-pack
2. **Build:** Compiles TypeScript and builds with Vite
3. **Deploy:** Serves the static files

## Features Included

✅ **Dynamic NVIDIA Pack Loading**

- 22 challenges loaded on-demand
- Keeps initial bundle lightweight

✅ **Full Persistence**

- All user progress saved in localStorage
- Works offline after first load

✅ **Multi-language Support**

- JavaScript, Python, C++, Java
- Judge0 integration for code execution

✅ **Responsive Design**

- Works on desktop and mobile

## Troubleshooting

### Build Fails

- Check that `nvidia-practice-pack` directory exists
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Redeploy after adding new variables
- Check Vercel function logs

### Performance Issues

- NVIDIA pack loads dynamically (good for performance)
- Static assets are cached for 1 year
- Consider adding a loading indicator

## Local Testing

Test the production build locally:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the built version.

## Monitoring

- Check Vercel dashboard for deployment status
- Monitor function logs for any errors
- Use browser dev tools to verify localStorage persistence

---

**Ready to deploy?** Just push to GitHub and connect to Vercel! 🎉
