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

export const deleteFilesFromCloudinary = async (public_ids) => {
    if (!Array.isArray(public_ids) || public_ids.length === 0) {
        throw new Error("Missing required parameter - public_ids");
    }

    const deletePromises = public_ids.map((public_id) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (err, result) => {
                if (err) {
                    return reject({ public_id, error: err });
                }
                resolve({ public_id, result });
            });
        });
    });

    try {
        const results = await Promise.allSettled(deletePromises);
        const errors = results.filter(res => res.status === 'rejected').map(res => res.reason);
        if (errors.length) {
            console.error('Errors deleting files:', errors);
            throw new Error("Some images could not be deleted");
        }
        return results.filter(res => res.status === 'fulfilled').map(res => res.value);
    } catch (err) {
        throw new Error(`Error deleting files: ${err.message}`);
    }
};