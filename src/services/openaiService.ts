import apiClient from './apiClient';
import { ResumeData, CoverLetterData } from '@/types/documents';

export const openaiService = {
  enhanceResume: async (resumeData: ResumeData, lang: string) => {
    try {
      const { personalInfo: { photo, ...personalInfoWithoutPhoto }, ...resumeWithoutPhoto } = resumeData;
      const response = await apiClient.post('/resume/enhance', {
        resumeData: { ...resumeWithoutPhoto, personalInfo: personalInfoWithoutPhoto },
        lang, // ✅ send language
      });
      return response.data;
    } catch (error) {
      console.error('Error enhancing resume', error);
      throw error;
    }
  },

  enhanceCoverLetter: async (coverLetterData: CoverLetterData, lang: string) => {
    try {
      const response = await apiClient.post('/cover-letter/enhance', {
        coverLetterData,
        lang, // ✅ send language
      });
      return response.data;
    } catch (error) {
      console.error('Error enhancing cover letter', error);
      throw error;
    }
  }
};
