import { useState } from 'react';
import { showErrorAlert } from '../errors/errorAlerts';
import { getPresignedUrlFromS3, publishAnalyzeJobToServer, uploadVideoToS3 } from '../services/AnalyzeVideoService';
import { GetPresignedUrlFromS3Body } from '../types/api/videoAnalysis/requests';
import { ExerciseEntity } from '../types/entities/exercise.entity';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/videoAnalysis.dto';
import { registerToVideoAnalysisResultsListener } from '../webSockets/socketListeners';

type useVideoAnalysisProps = {
  fileName: GetPresignedUrlFromS3Body['fileName'];
  fileType: GetPresignedUrlFromS3Body['fileType'];
  exercise: ExerciseEntity['name'];
  fileURI: string;
};

const useVideoAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalyzeVideoResultPayload<SquatRepetition> | null>(null);

  const analyzeVideo = async ({ fileName, fileType, exercise, fileURI }: useVideoAnalysisProps) => {
    try {
      setLoading(true);
      // Get presigned URL
      const { uploadUrl, fileKey } = await getPresignedUrlFromS3({ fileName, fileType });

      // Download video from media
      const response = await fetch(fileURI);
      const blob = await response.blob();

      // Upload to S3 with url
      try {
        await uploadVideoToS3(uploadUrl, blob, fileType);
      } catch {
        showErrorAlert('Error uploading file', 'An unknown error has occured.');
      }

      // Publish job to server
      const { jobId } = await publishAnalyzeJobToServer({ fileKey, exercise });

      // Connect lsocket listener
      const cleanUp = registerToVideoAnalysisResultsListener(jobId, setAnalysisResults);
      // CleanUp listener
      return cleanUp;
    } catch {
    } finally {
      setLoading(false);
      return;
    }
  };

  return { loading, analyzeVideo, analysisResults };
};

export default useVideoAnalysis;
