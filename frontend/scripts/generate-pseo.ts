import { SeoEngine } from '../src/lib/seo-engine/SeoEngine';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
    const engine = new SeoEngine();
    const pages = await engine.generateAllPages();

    // Create lookup map for O(1) access
    const pageMap: Record<string, any> = {};
    pages.forEach(page => {
        pageMap[page.url] = page;
    });

    // Ensure output directory exists
    const outputDir = path.resolve(__dirname, '../src/lib/seo-engine/output');
    await fs.mkdir(outputDir, { recursive: true });

    // specific file for the frontend to import
    await fs.writeFile(
        path.join(outputDir, 'manifest.json'),
        JSON.stringify(pageMap, null, 2)
    );

    // Generate Sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>https://harborml.com/r/${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    await fs.writeFile(
        path.join(outputDir, 'sitemap.xml'),
        sitemap
    );

    console.log(`✅ Successfully generated ${pages.length} pages and sitemap.xml`);
}

main().catch(console.error);
