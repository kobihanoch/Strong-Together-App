import api from "../api/api";

// Return URL
export const uploadProfilePictureToStorageAndGetPath = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name || "profile.jpg",
      type: file.type || "image/jpeg",
    });

    const { data } = await api.put("/api/users/setprofilepic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data; // { path, url, message }
  } catch (error) {
    console.error(
      "Error uploading profile picture:",
      error.response?.data || error.message
    );
    throw error;
  }
};
