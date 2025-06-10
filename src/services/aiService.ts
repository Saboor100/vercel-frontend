import axios from 'axios';
import { ResumeData, CoverLetterData } from '@/types/documents';
import { toast } from 'sonner';
import i18n from '@/i18n';

/**
 * Service to handle OpenAI API interactions directly from the frontend
 */
class AIService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!this.apiKey) {
      console.error('OpenAI API key is missing. Please set VITE_OPENAI_API_KEY in your environment variables.');
    }
  }

  /**
   * Map i18n code to human-readable language name for the prompt
   */
  private getLanguageName(code: string) {
    const map: Record<string, string> = {
      en: "English",
      fr: "French",
      es: "Spanish",
      de: "German",
      ar: "Arabic",
      it: "Italian",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
      hi: "Hindi",
      ur: "Urdu",
      tr: "Turkish",
      // Add more as needed
    };
    return map[code] || "English";
  }

  /**
   * Generate enhanced content using OpenAI
   * @param {string} prompt - The prompt to send to OpenAI
   * @param {string} systemPrompt - The system prompt to set context
   * @returns {Promise<string>} - Generated content
   */
  async generateContent(prompt: string, systemPrompt = "You are a helpful assistant."): Promise<string> {
    try {
      console.log('Generating content...');
      console.log('System prompt:', systemPrompt);
      console.log('User prompt:', prompt);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log('OpenAI response received');
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      toast.error(`AI error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('AI generation failed.');
    }
  }

  /**
   * Enhance a resume using OpenAI
   * @param {ResumeData} resumeData - The resume data to enhance
   * @returns {Promise<{success: boolean, data?: ResumeData, error?: string}>} - Enhanced resume data
   */
  async enhanceResume(resumeData: ResumeData): Promise<{ success: boolean, data?: ResumeData, error?: string }> {
    const langCode = i18n.language || 'en';
    const langName = this.getLanguageName(langCode);

    const systemPrompt = `You are a professional resume writer with expertise in creating compelling and effective resumes. Your task is to enhance the provided resume summary to be more professional, impactful, and tailored to the individual's experience and skills. Respond in ${langName}. Be specific and highlight key achievements.`;

    let prompt = `Please enhance the following resume to make it more professional and impactful. Respond in ${langName}.`;

    // Add personal info
    prompt += `\n\nAbout the person:`;
    if (resumeData.personalInfo) {
      if (resumeData.personalInfo.name) prompt += `\nName: ${resumeData.personalInfo.name}`;
      if (resumeData.personalInfo.location) prompt += `\nLocation: ${resumeData.personalInfo.location}`;
    }
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      prompt += `\n\nEducation:`;
      resumeData.education.forEach(edu => {
        if (edu.degree || edu.institution) {
          prompt += `\n- ${edu.degree || ''} from ${edu.institution || ''} (${edu.date || 'No date'})`;
          if (edu.description) prompt += `\n  ${edu.description}`;
        }
      });
    }
    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      prompt += `\n\nWork Experience:`;
      resumeData.experience.forEach(exp => {
        if (exp.position || exp.company) {
          prompt += `\n- ${exp.position || ''} at ${exp.company || ''} (${exp.date || 'No date'})`;
          if (exp.description) prompt += `\n  ${exp.description}`;
        }
      });
    }
    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      prompt += `\n\nSkills:`;
      resumeData.skills.forEach(skill => {
        if (skill.category || skill.skills) {
          prompt += `\n- ${skill.category || 'Skills'}: ${skill.skills || ''}`;
        }
      });
    }
    // Current summary if available
    if (resumeData.summary) {
      prompt += `\n\nCurrent Summary:\n${resumeData.summary}\n\nPlease enhance the summary to be more professional and highlight key strengths. Respond in ${langName}.`;
    } else {
      prompt += `\n\nPlease generate a professional summary based on the information provided above. The summary should be concise (3-5 sentences) and highlight key strengths and qualifications. Respond in ${langName}.`;
    }

    try {
      console.log('Sending resume data to OpenAI for enhancement');
      const enhancedSummary = await this.generateContent(prompt, systemPrompt);
      return {
        success: true,
        data: {
          ...resumeData,
          summary: enhancedSummary
        }
      };
    } catch (error) {
      console.error('Resume enhancement error:', error);
      return {
        success: false,
        error: `Resume enhancement failed: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        data: resumeData
      };
    }
  }

  /**
   * Enhance a cover letter using OpenAI
   * @param {CoverLetterData} coverLetterData - The cover letter data to enhance
   * @returns {Promise<{success: boolean, data?: CoverLetterData, error?: string}>} - Enhanced cover letter data
   */
  async enhanceCoverLetter(coverLetterData: CoverLetterData): Promise<{ success: boolean, data?: CoverLetterData, error?: string }> {
    const langCode = i18n.language || 'en';
    const langName = this.getLanguageName(langCode);

    const systemPrompt = `You are a professional cover letter writer with expertise in creating compelling job application letters. Your task is to create or enhance a cover letter that effectively showcases the applicant's experience, skills, and motivation for the position. Respond in ${langName}.`;

    let prompt = `Create a professional cover letter based on the following details. Respond in ${langName}:`;

    // Personal and recipient info
    if (coverLetterData.personalInfo) {
      prompt += `\n\nApplicant Information:`;
      if (coverLetterData.personalInfo.name) prompt += `\nName: ${coverLetterData.personalInfo.name}`;
      if (coverLetterData.personalInfo.location) prompt += `\nLocation: ${coverLetterData.personalInfo.location}`;
    }
    if (coverLetterData.recipientInfo) {
      prompt += `\n\nRecipient Information:`;
      if (coverLetterData.recipientInfo.name) prompt += `\nName: ${coverLetterData.recipientInfo.name}`;
      if (coverLetterData.recipientInfo.title) prompt += `\nTitle: ${coverLetterData.recipientInfo.title}`;
      if (coverLetterData.recipientInfo.company) prompt += `\nCompany: ${coverLetterData.recipientInfo.company}`;
    }
    if (coverLetterData.jobInfo) {
      prompt += `\n\nJob Information:`;
      if (coverLetterData.jobInfo.title) prompt += `\nPosition: ${coverLetterData.jobInfo.title}`;
      if (coverLetterData.jobInfo.reference) prompt += `\nReference: ${coverLetterData.jobInfo.reference}`;
    }
    // Existing sections
    if (coverLetterData.experience) {
      prompt += `\n\nExisting Experience Section:\n${coverLetterData.experience}`;
    }
    if (coverLetterData.skills) {
      prompt += `\n\nExisting Skills Section:\n${coverLetterData.skills}`;
    }
    if (coverLetterData.motivation) {
      prompt += `\n\nExisting Motivation Section:\n${coverLetterData.motivation}`;
    }
    if (coverLetterData.closing) {
      prompt += `\n\nExisting Closing Section:\n${coverLetterData.closing}`;
    }
    // Request format with clear sections
    prompt += `\n\nPlease format the response with four clearly labeled sections:
1) Experience: Highlight relevant work experience and accomplishments
2) Skills: Emphasize key skills relevant to the position
3) Motivation: Explain why the applicant is interested in the position and company
4) Closing: A professional closing statement

Each section should be 1-3 paragraphs. Keep the tone professional yet personable. Respond in ${langName}.`;

    try {
      console.log('Sending cover letter data to OpenAI for enhancement');
      const generatedContent = await this.generateContent(prompt, systemPrompt);

      // Parse the AI response to extract sections (simple heuristic)
      const sectionHeaders = [/Experience[:\.]/i, /Skills[:\.]/i, /Motivation[:\.]/i, /Closing[:\.]/i];
      const enhancedData = { ...coverLetterData };
      let matches: { header: string, index: number }[] = [];
      sectionHeaders.forEach((regex, i) => {
        const match = generatedContent.match(regex);
        if (match) {
          matches.push({ header: match[0], index: generatedContent.indexOf(match[0]) });
        }
      });
      matches.sort((a, b) => a.index - b.index);
      // Extract content between headers
      for (let i = 0; i < matches.length; i++) {
        const sectionName = matches[i].header.split(':')[0].trim().toLowerCase();
        const start = matches[i].index + matches[i].header.length;
        const end = i + 1 < matches.length ? matches[i + 1].index : undefined;
        const content = generatedContent.slice(start, end).trim();
        if (sectionName.includes("experience")) enhancedData.experience = content;
        if (sectionName.includes("skills")) enhancedData.skills = content;
        if (sectionName.includes("motivation")) enhancedData.motivation = content;
        if (sectionName.includes("closing")) enhancedData.closing = content;
      }
      // Fallback if not found
      enhancedData.experience = enhancedData.experience || '';
      enhancedData.skills = enhancedData.skills || '';
      enhancedData.motivation = enhancedData.motivation || '';
      enhancedData.closing = enhancedData.closing || 'Thank you for considering my application.';

      return {
        success: true,
        data: enhancedData
      };
    } catch (error) {
      console.error('Cover letter enhancement error:', error);
      return {
        success: false,
        error: `Cover letter enhancement failed: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
        data: coverLetterData
      };
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();