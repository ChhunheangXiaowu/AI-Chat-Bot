import type { Part } from "@google/genai";

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 * This involves reading the file as a base64 string.
 * @param file The file to convert.
 * @param mimeType The MIME type of the file.
 * @returns A promise that resolves to a Part object.
 */
export const fileToGenerativePart = async (file: File, mimeType: string): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result includes the data URL prefix (e.g., "data:image/png;base64,"),
      // which needs to be removed.
      const base64Data = (reader.result as string).split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });

  const base64EncodedData = await base64EncodedDataPromise;
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType,
    },
  };
};

/**
 * Creates a smaller thumbnail from a base64 image URL to save storage space.
 * @param imageUrl The original base64 data URL of the image.
 * @param maxSize The maximum width or height of the thumbnail.
 * @returns A promise that resolves to a new, smaller base64 data URL (JPEG format).
 */
export const createThumbnail = (imageUrl: string, maxSize = 256): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      // Use JPEG format for thumbnails for better compression
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = (err) => {
      const error = err instanceof Event ? new Error('Image loading failed') : err;
      reject(error);
    };
    img.src = imageUrl;
  });
};