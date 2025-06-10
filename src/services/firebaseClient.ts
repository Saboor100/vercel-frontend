
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { ResumeData, CoverLetterData } from '@/types/documents';
import axios from 'axios';
import { 
  resumeService as realtimeResumeService, 
  coverLetterService as realtimeCoverLetterService, 
  userService 
} from './firebaseRealtimeDb';

// Auth services
export const authService = {
  // Register new user
  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        data: {
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email,
          },
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register'
      };
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        data: {
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email,
          },
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      };
    }
  },

  // Google Sign In
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        data: {
          user: {
            id: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
          },
        }
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in with Google'
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await firebaseSignOut(auth);
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to logout'
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve({
            success: true,
            data: {
              user: {
                id: user.uid,
                email: user.email,
              }
            }
          });
        } else {
          resolve({
            success: false,
            data: null
          });
        }
      });
    });
  }
};

// OpenAI service for AI enhancements and ATS optimization
export const aiService = {
  enhanceResume: async (resumeData: ResumeData) => {
    try {
      const systemPrompt = "You are a professional resume writer with expertise in creating compelling and effective resumes.";
      const prompt = `Enhance the following resume summary to make it more professional and impactful: ${resumeData.summary || ""}. Context about the person: ${JSON.stringify(resumeData)}`;
      
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
          max_tokens: 800,
          temperature: 0.7
        },
        {
          headers: { 
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json" 
          }
        }
      );
      
      const enhancedSummary = response.data.choices[0].message.content.trim();
      
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
        error: error instanceof Error ? error.message : 'Failed to enhance resume'
      };
    }
  },
  
  enhanceCoverLetter: async (coverLetterData: CoverLetterData) => {
    const systemPrompt = "You are a professional cover letter writer with expertise in creating compelling job application letters.";
    const prompt = `Create a professional cover letter based on these details: ${JSON.stringify(coverLetterData)}. Format the response in four sections: 1) Experience, 2) Skills, 3) Motivation, and 4) Closing.`;
    
    try {
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
          max_tokens: 800,
          temperature: 0.7
        },
        {
          headers: { 
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json" 
          }
        }
      );
      
      const generatedContent = response.data.choices[0].message.content.trim();
      
      // Parse the AI response to extract different sections
      const contentParts = generatedContent.split('\n\n');
      
      // Create an enhanced cover letter
      const enhancedData = { ...coverLetterData };
      
      if (contentParts.length >= 3) {
        enhancedData.experience = enhancedData.experience || contentParts[0].trim();
        enhancedData.skills = enhancedData.skills || contentParts[1].trim();
        enhancedData.motivation = enhancedData.motivation || contentParts[2].trim();
        enhancedData.closing = enhancedData.closing || (contentParts[3] ? contentParts[3].trim() : 'Thank you for considering my application.');
      }
      
      return {
        success: true,
        data: enhancedData
      };
    } catch (error) {
      console.error('Cover letter enhancement error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enhance cover letter'
      };
    }
  },

  // ATS optimization function
// Updated getAtsOptimization function in your aiService

getAtsOptimization: async (resumeData: ResumeData, jobDescription: string, language: string = 'en') => {
  try {
    // Language mapping for better OpenAI understanding
    const languageMap: { [key: string]: { name: string, code: string } } = {
      'en': { name: 'English', code: 'en' },
      'fr': { name: 'French', code: 'fr' },
      'es': { name: 'Spanish', code: 'es' },
      'de': { name: 'German', code: 'de' },
      'it': { name: 'Italian', code: 'it' },
      'pt': { name: 'Portuguese', code: 'pt' },
      'nl': { name: 'Dutch', code: 'nl' },
      'ru': { name: 'Russian', code: 'ru' },
      'zh': { name: 'Chinese', code: 'zh' },
      'ja': { name: 'Japanese', code: 'ja' },
      'ko': { name: 'Korean', code: 'ko' },
      'ar': { name: 'Arabic', code: 'ar' }
    };

    // Get language info, fallback to English
    const langCode = language.toLowerCase().split('-')[0]; // Handle cases like 'en-US'
    const selectedLang = languageMap[langCode] || languageMap['en'];

    // Enhanced system prompt with explicit language instruction
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. You must provide specific, actionable feedback to help this resume pass ATS filters and match the job description. 

CRITICAL: You MUST respond entirely in ${selectedLang.name}. All analysis, suggestions, keywords, and content must be written in ${selectedLang.name}. Do not mix languages.

Your analysis should be professional, detailed, and culturally appropriate for ${selectedLang.name}-speaking job markets.`;
    
    // Language-specific prompts
    const languagePrompts: { [key: string]: string } = {
      'en': `
Analyze this resume against the following job description and provide ATS optimization suggestions:

JOB DESCRIPTION:
${jobDescription}

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Please provide the following in English:
1. Keywords Analysis: Identify key terms from the job description that should be included in the resume.
2. Missing Skills: List important skills mentioned in the job description that are missing from the resume.
3. Format Improvements: Suggest any formatting changes that would improve ATS readability.
4. Content Suggestions: Recommend specific content additions or modifications to better match the job requirements.
5. Overall Score: Rate the resume's current ATS compatibility from 1-10.

Format your response as JSON with the following structure:
{
  "keywordsAnalysis": [
    {"keyword": "string", "included": boolean, "importance": "high/medium/low"}
  ],
  "missingSkills": ["skill1", "skill2"],
  "formatImprovements": ["suggestion1", "suggestion2"],
  "contentSuggestions": ["suggestion1", "suggestion2"],
  "overallScore": number,
  "summary": "string"
}`,

      'fr': `
Analysez ce CV par rapport à la description de poste suivante et fournissez des suggestions d'optimisation ATS :

DESCRIPTION DU POSTE :
${jobDescription}

DONNÉES DU CV :
${JSON.stringify(resumeData, null, 2)}

Veuillez fournir les éléments suivants en français :
1. Analyse des mots-clés : Identifiez les termes clés de la description du poste qui devraient être inclus dans le CV.
2. Compétences manquantes : Listez les compétences importantes mentionnées dans la description du poste qui sont absentes du CV.
3. Améliorations de format : Suggérez des changements de formatage qui amélioreraient la lisibilité ATS.
4. Suggestions de contenu : Recommandez des ajouts ou modifications de contenu spécifiques pour mieux correspondre aux exigences du poste.
5. Score global : Évaluez la compatibilité ATS actuelle du CV de 1 à 10.

Formatez votre réponse en JSON avec la structure suivante :
{
  "keywordsAnalysis": [
    {"keyword": "chaîne", "included": booléen, "importance": "high/medium/low"}
  ],
  "missingSkills": ["compétence1", "compétence2"],
  "formatImprovements": ["suggestion1", "suggestion2"],
  "contentSuggestions": ["suggestion1", "suggestion2"],
  "overallScore": nombre,
  "summary": "chaîne"
}`,

      'es': `
Analice este currículum en comparación con la siguiente descripción del trabajo y proporcione sugerencias de optimización ATS:

DESCRIPCIÓN DEL TRABAJO:
${jobDescription}

DATOS DEL CURRÍCULUM:
${JSON.stringify(resumeData, null, 2)}

Por favor proporcione lo siguiente en español:
1. Análisis de palabras clave: Identifique términos clave de la descripción del trabajo que deberían incluirse en el currículum.
2. Habilidades faltantes: Liste habilidades importantes mencionadas en la descripción del trabajo que faltan en el currículum.
3. Mejoras de formato: Sugiera cambios de formato que mejorarían la legibilidad ATS.
4. Sugerencias de contenido: Recomiende adiciones o modificaciones de contenido específicas para coincidir mejor con los requisitos del trabajo.
5. Puntuación general: Califique la compatibilidad ATS actual del currículum del 1 al 10.

Formatee su respuesta como JSON con la siguiente estructura:
{
  "keywordsAnalysis": [
    {"keyword": "cadena", "included": booleano, "importance": "high/medium/low"}
  ],
  "missingSkills": ["habilidad1", "habilidad2"],
  "formatImprovements": ["sugerencia1", "sugerencia2"],
  "contentSuggestions": ["sugerencia1", "sugerencia2"],
  "overallScore": número,
  "summary": "cadena"
}`
    };

    // Default to English if language not found
    const prompt = languagePrompts[langCode] || languagePrompts['en'];
    
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
        max_tokens: 1200, // Increased for multilingual responses
        temperature: 0.7
      },
      {
        headers: { 
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json" 
        }
      }
    );
    
    let content = response.data.choices[0].message.content.trim();
    
    // Clean up JSON response
    if (content.startsWith("```json")) {
      content = content.replace(/```json\n?/, "").replace(/```$/, "").trim();
    }
    if (content.startsWith("```")) {
      content = content.replace(/```\n?/, "").replace(/```$/, "").trim();
    }

    try {
      const atsAnalysis = JSON.parse(content);
      
      return {
        success: true,
        data: atsAnalysis
      };
    } catch (parseError) {
      console.error('Failed to parse ATS analysis JSON:', parseError);
      console.error('Raw content:', content);
      
      // Fallback response in the user's language
      const fallbackResponse = langCode === 'fr' ? {
        keywordsAnalysis: [],
        missingSkills: [],
        formatImprovements: ["Erreur d'analyse - veuillez réessayer"],
        contentSuggestions: ["Erreur d'analyse - veuillez réessayer"],
        overallScore: 5,
        summary: "Une erreur s'est produite lors de l'analyse. Veuillez réessayer."
      } : {
        keywordsAnalysis: [],
        missingSkills: [],
        formatImprovements: ["Analysis error - please try again"],
        contentSuggestions: ["Analysis error - please try again"],
        overallScore: 5,
        summary: "An error occurred during analysis. Please try again."
      };
      
      return {
        success: true,
        data: fallbackResponse
      };
    }
  } catch (error) {
    console.error('ATS optimization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate ATS optimization'
    };
  }
}
}
// Resume services - now using RealTime DB only
export const resumeService = {
  // Generate resume with AI enhancement
  generate: async (resumeData: ResumeData) => {
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }
      
      // Enhance resume with AI if summary is empty
      let enhancedData = resumeData;
      if (!resumeData.summary || resumeData.summary.trim() === '') {
        const enhanceResult = await aiService.enhanceResume(resumeData);
        if (enhanceResult.success) {
          enhancedData = enhanceResult.data;
        }
      }
      
      // Use the Realtime DB service to save the resume
      return await realtimeResumeService.create(enhancedData);
    } catch (error) {
      console.error('Resume generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate resume'
      };
    }
  },

  // Get resume by ID
  getById: async (resumeId: string) => {
    return await realtimeResumeService.getById(resumeId);
  },

  // Get all resumes for current user
  getAll: async () => {
    return await realtimeResumeService.getAll();
  }
};

// Cover Letter services - now using RealTime DB only
export const coverLetterService = {
  // Generate cover letter with AI enhancement
  generate: async (coverLetterData: CoverLetterData) => {
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }
      
      // Enhance cover letter with AI if content sections are empty
      let enhancedData = coverLetterData;
      if (!coverLetterData.experience || !coverLetterData.skills || !coverLetterData.motivation) {
        const enhanceResult = await aiService.enhanceCoverLetter(coverLetterData);
        if (enhanceResult.success) {
          enhancedData = enhanceResult.data;
        }
      }
      
      // Use the Realtime DB service to save the cover letter
      return await realtimeCoverLetterService.create(enhancedData);
    } catch (error) {
      console.error('Cover letter generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate cover letter'
      };
    }
  },

  // Get cover letter by ID
  getById: async (coverLetterId: string) => {
    return await realtimeCoverLetterService.getById(coverLetterId);
  },

  // Get all cover letters for current user
  getAll: async () => {
    return await realtimeCoverLetterService.getAll();
  }
};
