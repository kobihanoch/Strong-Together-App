import { backgroundUpload, UploaderHttpMethod, UploadType } from 'react-native-compressor';
import api from '../../../../infrastructure/api/api-config/api';
import { CreateVideoUploadUrlResponse } from '@strong-together/shared';
import { CreateVideoUploadUrlBody } from '@strong-together/shared';

type UploadVideoToS3Options = {
  onProgress?: (progress: number) => void;
  onRegisterCancellationId?: (cancellationId: string) => void;
  abortSignal?: AbortSignal;
};

export const getPresignedUrlFromS3 = async (body: CreateVideoUploadUrlBody): Promise<CreateVideoUploadUrlResponse> => {
  const { data } = await api.post<CreateVideoUploadUrlResponse>('/api/video-analysis/upload-urls', body, {
    sentryContinueTrace: true,
  });
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
