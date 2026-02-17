import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

interface UploadResult {
    url: string;
    publicId: string;
}

export async function uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    resourceType: 'auto' | 'image' | 'raw' = 'auto'
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `research_assistant/${folder}`,
                resource_type: resourceType,
                format: resourceType === 'raw' ? undefined : undefined,
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
}

export async function deleteFromCloudinary(publicId: string, resourceType: string = 'auto'): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Cloudinary delete error:', error);
    }
}
