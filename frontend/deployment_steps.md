---
description: How to build and deploy the Harbor application
---

# Deployment Workflow

This guide details how to build the Harbor frontend application for production deployment.

## 1. Create the Production Build

Run the following command in your terminal to generate the optimized static files:

```bash
npm run build
```

This will create a `dist/` folder in your project root containing:
- `index.html`: The entry point.
- `assets/`: Compiled JavaScript, CSS, and images.

## 2. Deploy to Your Hosting Provider

The steps depend on how `aibcmedia.com` is hosted:

### Option A: Static Hosting (Vercel, Netlify, Cloudflare Pages)
1. **Connect your Git repository** to the hosting provider.
2. Set the **Build Command** to: `npm run build`
3. Set the **Output Directory** to: `dist`
4. The provider will automatically deploy whenever you push to main.

### Option B: Traditional Web Server (Apache, Nginx, cPanel)
1. Run `npm run build` locally.
2. **Upload** the *contents* of the `dist/` folder to your server's public web directory (often named `public_html`, `www`, or `htdocs`).
   - Ensure `index.html` is at the root of that directory.
3. **Configure Rewrite Rules:** Since this is a Single Page Application (SPA), you must configure your server to redirect all requests to `index.html` so that React Router can handle the paths (e.g., `/pricing`, `/auth`).
   - **Apache (.htaccess):**
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```
   - **Nginx:**
     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

### Option C: AWS S3 + CloudFront
1. Run `npm run build`.
2. Upload the contents of `dist/` to your S3 bucket.
3. Configure the bucket for Static Website Hosting.
4. Point CloudFront to the S3 bucket (recommended for SSL and caching).

## 3. Verification
After deployment, visit `aibcmedia.com` and verify:
- The site loads correctly.
- Navigation links work (try reloading on a sub-page like `/pricing`).
- Assets (images, fonts) load without 404 errors.
