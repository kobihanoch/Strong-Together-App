import { SUPABASE_REF, SUPABASE_ANON_KEY } from "@env";

// Uploads profile pic to public Supabase Storage via REST API
export const uploadProfilePictureToStorage = async (filePath, file) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: filePath,
      type: file.type,
    });

    const response = await fetch(
      `https://${SUPABASE_REF}.supabase.co/storage/v1/object/profile_pics/${filePath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          "x-upsert": "true",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Upload failed:", responseText);
      throw new Error("Upload failed");
    }

    console.log("Upload success!");
    return responseText;
  } catch (error) {
    console.error("Service error while uploading profile pic:", error);
    throw error;
  }
};

// Returns the public URL of the uploaded image
export const getPublicPicUrl = (filePath) => {
  return `https://${SUPABASE_REF}.supabase.co/storage/v1/object/public/profile_pics/${filePath}`;
};
