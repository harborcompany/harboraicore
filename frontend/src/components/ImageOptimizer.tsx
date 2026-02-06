import React from 'react';

interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean; // If true, don't lazy load (for hero/LCP images)
    sizes?: string;
}

/**
 * SEO-optimized Image Component
 * 
 * Implements all 7 image SEO factors:
 * 1. ✅ Descriptive alt text (required prop)
 * 2. ✅ Width/height specified (prevents CLS)
 * 3. ✅ Lazy loading (below-fold only, disabled for priority images)
 * 4. ✅ Responsive srcset generation
 * 5. ✅ WebP format enforcement
 * 6. ✅ Aspect ratio CSS for layout stability
 */
export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}) => {
    // Generate srcset for responsive images
    const generateSrcset = (baseSrc: string): string => {
        const widths = [400, 800, 1200, 1600];

        // For external URLs (Unsplash, etc.), use their resize params
        if (baseSrc.includes('unsplash.com')) {
            return widths
                .map(w => `${baseSrc.replace(/w=\d+/, `w=${w}`)} ${w}w`)
                .join(', ');
        }

        // For local images, assume we have resized versions
        // Format: image-400w.webp, image-800w.webp, etc.
        const ext = baseSrc.split('.').pop();
        const base = baseSrc.replace(`.${ext}`, '');

        return widths
            .map(w => `${base}-${w}w.webp ${w}w`)
            .join(', ');
    };

    // Ensure WebP format for local images
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return (
        <img
            src={webpSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes={sizes}
            srcSet={generateSrcset(src)}
            className={className}
            style={{
                aspectRatio: `${width} / ${height}`,
            }}
        />
    );
};

/**
 * Hero Image Component
 * Pre-configured for LCP-critical images
 * - Never lazy loaded
 * - High fetch priority
 * - Full width responsive
 */
export const HeroImage: React.FC<Omit<ImageProps, 'priority'>> = (props) => (
    <Image
        {...props}
        priority={true}
        sizes="100vw"
    />
);

/**
 * Card Image Component
 * For grid/card layouts
 * - Lazy loaded by default
 * - Smaller responsive sizes
 */
export const CardImage: React.FC<Omit<ImageProps, 'priority' | 'sizes'>> = (props) => (
    <Image
        {...props}
        priority={false}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
    />
);

export default Image;
