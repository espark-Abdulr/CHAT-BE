import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getBase64 = (file) => {
    if (!file || !file.buffer || !file.mimetype) {
        throw new Error("Invalid file object");
    }
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

export const uploadFilesToCloudinary = async (files = [], folderName) => {
    if (!Array.isArray(files) || files.length === 0) {
        throw new Error("Missing required parameter - files");
    }

    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: 'auto',
                    public_id: uuid(),
                    folder: folderName
                },
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                },
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);
        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (err) {
        throw new Error(`Error uploading files: ${err.message}`);
    }
};