import { Readable } from 'stream';
import uploadCloudinary from './cloudinary';

function streamToNodeStream(readableStream) {
  const reader = readableStream.getReader();

  return new Readable({
    async read(size) {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null); // Signal that the stream is done
      } else {
        this.push(value); // Push the chunk into the Node.js stream
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

async function handleFileUpload(formData) {
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    throw new Error('No valid file uploaded');
  }

  const stream = streamToNodeStream(file.stream());
  const result = await uploadCloudinary(stream, file.name);

  return result; // Return Cloudinary result
}

export { handleFileUpload, streamToNodeStream };
