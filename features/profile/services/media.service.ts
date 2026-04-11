import api from '../../../api/api';
import { SetProfilePicAndUpdateDBResponse } from '@strong-together/shared';

export type UploadableFile = {
  uri: string;
  name?: string;
  type?: string;
};

// Return URL
export const uploadProfilePictureToStorageAndGetPath = async (
  file: UploadableFile,
): Promise<SetProfilePicAndUpdateDBResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'profile.jpg',
      type: file.type || 'image/jpeg',
    } as unknown as Blob);

    const { data } = await api.put<SetProfilePicAndUpdateDBResponse>('/api/users/setprofilepic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data; // { path, url, message }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    console.error('Error uploading profile picture:', errorMessage);
    throw error;
  }
};
