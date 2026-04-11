import { useState } from 'react';
import { UploadableFile, uploadProfilePictureToStorageAndGetPath } from '../services/media.service';

export const useMediaUploads = (): {
  uploadToStorageAndReturnPath: (file: UploadableFile) => Promise<{ path: string; url: string }>;
  loading: boolean;
  error: Error | null;
} => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cnagne name
  const uploadToStorageAndReturnPath = async (file: UploadableFile) => {
    try {
      setLoading(true);
      const { path, url } = await uploadProfilePictureToStorageAndGetPath(file);
      return { path: path, url: url };
    } catch (err) {
      setError(err as Error);
      console.log('Hook error uploading profile picture to storage: ' + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadToStorageAndReturnPath,
    loading,
    error,
  };
};

export default useMediaUploads;
