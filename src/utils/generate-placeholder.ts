import { getPlaiceholder } from "plaiceholder";
import { optimizeContentfulImageUrl } from "./contentful-image-url";

/**
 * Generate a tiny base64 placeholder from Contentful image URL
 * Much faster than getPlaiceholder because we request a tiny version from Contentful
 */
export async function generateTinyPlaceholder(imageUrl: string): Promise<string> {
    // Ensure URL starts with https:
    const fullUrl = imageUrl.startsWith('https:') ? imageUrl : `https:${imageUrl}`;
    
    // For Contentful images, request a tiny optimized version
    if (fullUrl.includes('ctfassets.net')) {
        const tinyUrl = optimizeContentfulImageUrl(fullUrl, {
            width: 20, // Very small for blur
            quality: 20, // Low quality for blur
            format: 'jpg' // JPG compresses better for tiny images
        });
        
        try {
            const { base64 } = await getPlaiceholder(tinyUrl);
            return base64;
        } catch (error) {
            console.error('Error generating tiny placeholder:', error);
            // Fallback to a simple gray placeholder
            return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCfAA==';
        }
    }
    
    // For non-Contentful images, use normal getPlaiceholder
    const { base64 } = await getPlaiceholder(fullUrl);
    return base64;
}

/**
 * Generate high-quality placeholder (for hero images, featured images)
 */
export async function generateHighQualityPlaceholder(imageUrl: string): Promise<string> {
    const fullUrl = imageUrl.startsWith('https:') ? imageUrl : `https:${imageUrl}`;
    const { base64 } = await getPlaiceholder(fullUrl);
    return base64;
}

