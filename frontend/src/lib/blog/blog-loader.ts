// Dynamic blog post loader
// Reads markdown files from /content/blog/ and returns structured data
// Browser-compatible version (no gray-matter dependency)

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    category: string;
    author: string;
    excerpt: string;
    keywords: string[];
    thumbnail: string;
    content: string;
}

// For Vite, we use import.meta.glob to load markdown files
const blogModules = import.meta.glob('/src/content/blog/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
}) as Record<string, string>;

// Simple frontmatter parser (browser-compatible)
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content };
    }

    const yamlContent = match[1];
    const bodyContent = match[2];
    const data: Record<string, unknown> = {};

    // Parse YAML-like frontmatter
    yamlContent.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.slice(0, colonIndex).trim();
        let value: unknown = line.slice(colonIndex + 1).trim();

        // Remove quotes
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }

        // Handle arrays (simple single-line format)
        if (key === 'keywords' && typeof value === 'string') {
            // Handle multiline arrays or empty
            if (value === '') {
                // Keywords might be on subsequent lines, skip for now
                value = [];
            }
        }

        if (key) {
            data[key] = value;
        }
    });

    return { data, content: bodyContent };
}

export function getAllPosts(): BlogPost[] {
    const posts: BlogPost[] = [];

    for (const [path, rawContent] of Object.entries(blogModules)) {
        try {
            const { data, content: body } = parseFrontmatter(rawContent);
            const filename = path.split('/').pop()?.replace('.md', '') || '';

            posts.push({
                slug: (data.slug as string) || filename,
                title: (data.title as string) || 'Untitled',
                date: (data.date as string) || new Date().toISOString().split('T')[0],
                category: (data.category as string) || 'general',
                author: (data.author as string) || 'Harbor Team',
                excerpt: (data.excerpt as string) || body.slice(0, 160).replace(/[#*_\n]/g, '') + '...',
                keywords: Array.isArray(data.keywords) ? data.keywords : [],
                thumbnail: (data.thumbnail as string) || 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800',
                content: body
            });
        } catch (e) {
            console.error(`Error parsing ${path}:`, e);
        }
    }

    // Sort by date, newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return getAllPosts().find(post => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
    return getAllPosts().filter(post => post.category === category);
}

export function getRecentPosts(count: number = 6): BlogPost[] {
    return getAllPosts().slice(0, count);
}
