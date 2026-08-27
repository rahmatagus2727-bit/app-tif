/**
 * Utility to compress image files and base64 strings to lightweight WebP/JPEG (<60KB)
 * for instant multi-device real-time MQTT broadcasting and resilient localStorage caching.
 */

export async function compressImageFile(file: File, maxDim = 800, quality = 0.65): Promise<{ base64: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ base64: e.target?.result as string, fileName: file.name });
            return;
          }

          // Draw and compress
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Use JPEG with 0.65 quality (produces ~30-50KB size)
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve({
            base64: compressedBase64,
            fileName: file.name
          });
        } catch (err) {
          resolve({ base64: e.target?.result as string, fileName: file.name });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
