
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function uploadCloudinary(fileStream, fileName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto', public_id: fileName },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Upload result:', result);
          resolve(result);
        }
      }
    );

    // Pipe the file stream to Cloudinary
    fileStream.pipe(uploadStream).on('finish', () => {
      console.log('Upload finished successfully.');
    }).on('error', (err) => {
      console.error('Stream error:', err);
      reject(err);
    });
  });
}