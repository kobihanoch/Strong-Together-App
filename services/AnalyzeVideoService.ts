import { backgroundUpload, UploaderHttpMethod, UploadType } from 'react-native-compressor';
import api from '../api/api';
import { GetPresignedUrlFromS3Response } from '../types/api/videoAnalysis/responses';
import { GetPresignedUrlFromS3Body } from './../types/api/videoAnalysis/requests';

type UploadVideoToS3Options = {
  onProgress?: (progress: number) => void;
  onRegisterCancellationId?: (cancellationId: string) => void;
  abortSignal?: AbortSignal;
};

export const getPresignedUrlFromS3 = async (
  body: GetPresignedUrlFromS3Body,
): Promise<GetPresignedUrlFromS3Response> => {
  const { data } = await api.post<GetPresignedUrlFromS3Response>('/api/videoanalysis/getpresignedurl', body);
  return data;
};

export const uploadVideoToS3 = async (
  uploadUrl: string,
  fileUri: string,
  fileType: string,
  options?: UploadVideoToS3Options,
): Promise<void> => {
  const uploadOptions = {
    httpMethod: UploaderHttpMethod.PUT,
    uploadType: UploadType.BINARY_CONTENT,
    mimeType: fileType,
    headers: {
      'Content-Type': fileType,
    },
    ...(options?.onRegisterCancellationId ? { getCancellationId: options.onRegisterCancellationId } : {}),
  };

  await backgroundUpload(
    uploadUrl,
    fileUri,
    uploadOptions,
    (written, total) => {
      if (total) {
        const progress = Math.round((written * 100) / total);
        //console.log(`Uploading to S3: ${progress}%`);
        options?.onProgress?.(progress);
      }
    },
    options?.abortSignal,
  );
};
