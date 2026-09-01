import { useState } from 'react';
import { UploadableFile, uploadProfilePictureToStorageAndGetPath } from '../../../features/user/services/media.service';

export const useMediaUploads = (): {
  uploadToStorageAndReturnPath: (file: UploadableFile) => Promise<{ profilePicPath: string; url: string }>;
  loading: boolean;
  error: Error | null;
} => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cnagne name
  const uploadToStorageAndReturnPath = async (file: UploadableFile) => {
    try {
      setLoading(true);
      const { profilePicPath, url } = await uploadProfilePictureToStorageAndGetPath(file);
      return { profilePicPath, url };
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
