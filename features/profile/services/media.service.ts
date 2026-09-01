import api from '../../../infrastructure/api/api-config/api';
import { ReplaceProfilePictureResponse } from '@strong-together/shared';

export type UploadableFile = {
  uri: string;
  name?: string;
  type?: string;
};

// Return URL

export const uploadProfilePictureToStorageAndGetPath = async (file: UploadableFile): Promise<ReplaceProfilePictureResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'profile.jpg',
      type: file.type || 'image/jpeg',
    } as unknown as Blob);

    const { data } = await api.put<ReplaceProfilePictureResponse>('/api/users/me/profile-picture', formData, {
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
