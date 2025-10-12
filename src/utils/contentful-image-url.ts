/**
 * Optimizes Contentful image URLs with appropriate parameters
 * @param url - The Contentful image URL (can include or exclude https:)
 * @param options - Optimization options
 * @returns Optimized URL with query parameters
 */
export function optimizeContentfulImageUrl(
    url: string,
    options?: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'jpg' | 'png' | 'webp' | 'avif';
        fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
        focus?: 'center' | 'top' | 'right' | 'left' | 'bottom' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'face' | 'faces';
        progressive?: boolean;
    }
): string {
    // Ensure URL starts with https:
    const fullUrl = url.startsWith('https:') ? url : `https:${url}`;
    
    // Don't optimize if not a Contentful URL
    if (!fullUrl.includes('ctfassets.net')) {
        return fullUrl;
    }

    const urlObj = new URL(fullUrl);
    const params = new URLSearchParams(urlObj.search);

    // Add optimization parameters
    if (options?.width) params.set('w', options.width.toString());
    if (options?.height) params.set('h', options.height.toString());
    if (options?.quality) params.set('q', options.quality.toString());
    if (options?.format) params.set('fm', options.format);
    if (options?.fit) params.set('fit', options.fit);
    if (options?.focus) params.set('f', options.focus);
    if (options?.progressive !== undefined) params.set('fl', 'progressive');

    urlObj.search = params.toString();
    return urlObj.toString();
}

/**
 * Get optimized Contentful image URL for different viewport sizes
 */
export function getContentfulImageSrcSet(
    url: string,
    options?: {
        quality?: number;
        format?: 'jpg' | 'png' | 'webp' | 'avif';
    }
) {
    const widths = [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    
    return widths.map(width => ({
        src: optimizeContentfulImageUrl(url, {
            ...options,
            width,
        }),
        width,
    }));
}

