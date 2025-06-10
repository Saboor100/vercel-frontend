// Mock backend service for resume and cover letter generation
// In a real application, this would make actual API calls to a backend server

import i18next from 'i18next'; // <-- Import i18next

// Define types for our API
export interface GenerationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ResumeGenerationRequest {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    date: string;
    description: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    date: string;
    description: string;
  }>;
  skills: Array<{
    category: string;
    skills: string;
  }>;
}

export interface CoverLetterGenerationRequest {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  recipientInfo: {
    name: string;
    title: string;
    company: string;
  };
  jobInfo: {
    title: string;
    reference: string;
  };
  experience: string;
  skills: string;
  motivation: string;
  closing: string;
}

// Mock API delay to simulate network requests
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

class ApiService {
  // Generate a resume using AI
  async generateResume(data: ResumeGenerationRequest): Promise<GenerationResponse> {
    try {
      console.log(i18next.t('log.generatingResume'), data);
      
      // Simulate API call
      await mockApiDelay();
      
      // Mock enhancement of the user's data (in a real app, this would come from OpenAI or similar)
      const enhancedData = {
        ...data,
        summary: data.summary || i18next.t('defaults.resumeSummary'),
        skills: data.skills.length > 0 ? data.skills : [
          { category: i18next.t('defaults.technicalSkillsCategory'), skills: i18next.t('defaults.technicalSkillsList') },
          { category: i18next.t('defaults.softSkillsCategory'), skills: i18next.t('defaults.softSkillsList') }
        ]
      };
      
      return {
        success: true,
        data: enhancedData
      };
    } catch (error) {
      console.error(i18next.t('apierror.generatingResume'), error);
      return {
        success: false,
        error: error instanceof Error ? error.message : i18next.t('error.unknown')
      };
    }
  }
  
  // Generate a cover letter using AI
  async generateCoverLetter(data: CoverLetterGenerationRequest): Promise<GenerationResponse> {
    try {
      console.log(i18next.t('log.generatingCoverLetter'), data);
      
      // Simulate API call
      await mockApiDelay();
      
      // Mock enhancement of the user's data (in a real app, this would come from OpenAI or similar)
      const enhancedData = {
        ...data,
        experience: data.experience || i18next.t('defaults.coverLetterExperience'),
        skills: data.skills || i18next.t('defaults.coverLetterSkills'),
        motivation: data.motivation || i18next.t('defaults.coverLetterMotivation', {
          company: data.recipientInfo.company || i18next.t('defaults.yourCompany'),
          position: data.jobInfo.title || i18next.t('defaults.position')
        }),
        closing: data.closing || i18next.t('defaults.coverLetterClosing')
      };
      
      return {
        success: true,
        data: enhancedData
      };
    } catch (error) {
      console.error(i18next.t('apierror.generatingCoverLetter'), error);
      return {
        success: false,
        error: error instanceof Error ? error.message : i18next.t('apierror.unknown')
      };
    }
  }
  
  // Save a resume to the database
  async saveResume(userId: string, resumeData: any): Promise<GenerationResponse> {
    try {
      console.log(i18next.t('log.savingResume'), userId);
      
      // Simulate API call
      await mockApiDelay();
      
      // In a real application, this would save to a database
      const savedResume = {
        resumeId: `resume_${Date.now()}`,
        userId,
        resumeData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Simulate storing to localStorage for demo purposes
      const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
      savedResumes.push(savedResume);
      localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
      
      return {
        success: true,
        data: savedResume
      };
    } catch (error) {
      console.error(i18next.t('apierror.savingResume'), error);
      return {
        success: false,
        error: error instanceof Error ? error.message : i18next.t('apierror.unknown')
      };
    }
  }
  
  // Save a cover letter to the database
  async saveCoverLetter(userId: string, coverLetterData: any): Promise<GenerationResponse> {
    try {
      console.log(i18next.t('log.savingCoverLetter'), userId);
      
      // Simulate API call
      await mockApiDelay();
      
      // In a real application, this would save to a database
      const savedCoverLetter = {
        coverLetterId: `cover_letter_${Date.now()}`,
        userId,
        coverLetterData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Simulate storing to localStorage for demo purposes
      const savedCoverLetters = JSON.parse(localStorage.getItem('savedCoverLetters') || '[]');
      savedCoverLetters.push(savedCoverLetter);
      localStorage.setItem('savedCoverLetters', JSON.stringify(savedCoverLetters));
      
      return {
        success: true,
        data: savedCoverLetter
      };
    } catch (error) {
      console.error(i18next.t('apierror.savingCoverLetter'), error);
      return {
        success: false,
        error: error instanceof Error ? error.message : i18next.t('apierror.unknown')
      };
    }
  }
}

// Export a singleton instance of the API service
export const apiService = new ApiService();
