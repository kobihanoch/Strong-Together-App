import {
  uploadProfilePictureToStorage,
  getPublicPicUrl,
} from "../services/MediaService";
import { useState } from "react";

export const useMediaUploads = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publicPicUrl, setPublicPicUrl] = useState(null);

  const uploadToStorage = async (filePath, file) => {
    try {
      setLoading(true);
      await uploadProfilePictureToStorage(filePath, file);
    } catch (err) {
      setError(err);
      console.log("Hook error uploading profile picture to storage: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicUrl = async (filePath) => {
    try {
      setLoading(true);
      const url = await getPublicPicUrl(filePath);
      setPublicPicUrl(url);
      return url;
    } catch (err) {
      setError(err);
      console.log("Hook error getting public URL: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadToStorage,
    fetchPublicUrl,
    publicPicUrl,
    loading,
    error,
  };
};

export default useMediaUploads;
