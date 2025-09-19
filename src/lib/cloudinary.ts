import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
    width: number;
    height: number;
}

export interface CloudinaryDeleteResult {
    result: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
    file: File
): Promise<CloudinaryUploadResult> {

    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    reject(new Error(data.error));
                } else {
                    resolve(data);
                }
            })
            .catch(reject);
    });
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result as CloudinaryDeleteResult);
            }
        });
    });
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
    publicId: string,
    transformations: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string | number;
        format?: string;
        gravity?: string;
    } = {}
): string {
    const {
        width,
        height,
        crop = 'fill',
        quality = 'auto',
        format = 'auto',
        gravity = 'auto'
    } = transformations;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    }

    let url = `https://res.cloudinary.com/${cloudName}/image/upload`;

    // Add transformations
    const transformParts = [];
    if (width) transformParts.push(`w_${width}`);
    if (height) transformParts.push(`h_${height}`);
    if (crop) transformParts.push(`c_${crop}`);
    if (quality) transformParts.push(`q_${quality}`);
    if (format) transformParts.push(`f_${format}`);
    if (gravity) transformParts.push(`g_${gravity}`);

    if (transformParts.length > 0) {
        url += `/${transformParts.join(',')}`;
    }

    url += `/${publicId}`;

    return url;
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        return null;
    }

    const pattern = new RegExp(
        `https://res\\.cloudinary\\.com/${cloudName}/image/upload/(?:[^/]+/)?(.+?)(?:\\.[^.]+)?$`
    );

    const match = url.match(pattern);
    return match ? match[1] : null;
}

/**
 * Validate if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        return false;
    }

    return url.includes(`res.cloudinary.com/${cloudName}/image/upload`);
}
