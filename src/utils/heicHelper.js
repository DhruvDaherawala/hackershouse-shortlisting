import heic2any from 'heic2any';

/**
 * Checks if a file is an HEIC/HEIF image and converts it to a standard JPEG Blob/DataURL.
 * @param {File} file 
 * @returns {Promise<string>} Data URL of the image
 */
export async function processImageFile(file) {
  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';

  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      return await blobToDataURL(blob);
    } catch (err) {
      console.error('HEIC conversion failed:', err);
      throw new Error('Could not process HEIC file. Please try converting to JPG/PNG.');
    }
  }

  return await blobToDataURL(file);
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}
