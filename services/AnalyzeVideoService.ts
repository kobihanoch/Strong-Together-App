import axios from 'axios';
import api from '../api/api';
import { GetPresignedUrlFromS3Response, PublishVideoAnalysisJobResponse } from '../types/api/videoAnalysis/responses';
import { GetPresignedUrlFromS3Body, PublishVideoAnalysisJobBody } from './../types/api/videoAnalysis/requests';

export const getPresignedUrlFromS3 = async (
  body: GetPresignedUrlFromS3Body,
): Promise<GetPresignedUrlFromS3Response> => {
  const { data } = await api.post<GetPresignedUrlFromS3Response>('/api/videoanalysis/getpresignedurl', body);
  return data;
};

export const uploadVideoToS3 = async (uploadUrl: string, blob: Blob, fileType: string): Promise<void> => {
  await axios.put(uploadUrl, blob, {
    headers: {
      'Content-Type': fileType,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Uploading to S3: ${progress}%`);
      }
    },
  });
};

export const publishAnalyzeJobToServer = async (body: PublishVideoAnalysisJobBody) => {
  const { data } = await api.post<PublishVideoAnalysisJobResponse>('/api/videoanalysis/publishjob', body);
  return data;
};
