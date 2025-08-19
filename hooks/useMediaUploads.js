import { useState } from "react";
import { uploadProfilePictureToStorageAndGetPath } from "../services/MediaService";

export const useMediaUploads = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cnagne name
  const uploadToStorageAndReturnPath = async (file) => {
    try {
      setLoading(true);
      const { path, url } = await uploadProfilePictureToStorageAndGetPath(file);
      return { path: path, url: url };
    } catch (err) {
      setError(err);
      console.log("Hook error uploading profile picture to storage: " + err);
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
