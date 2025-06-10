import apiClient from './apiClient';
import emailjs from '@emailjs/browser';
import { getDatabase, ref, get } from 'firebase/database'; // or your Firebase SDK imports

interface OptimizationResponse {
  success: boolean;
  tips?: string;
  error?: string;
}

interface AtsScoreResponse {
  success: boolean;
  data?: {
    score: number;
    missedKeywords: string[];
    recommendations: string;
  };
  error?: string;
}

interface PaymentNotificationData {
  userId: string;
  sessionId: string;
  plan: string;
}

interface DocumentGenerationData {
  userId: string;
  documentType: 'resume' | 'coverLetter';
  documentId?: string;
  templateName?: string;
}

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
  name: string;
  title: string;
}

// Language translations for LinkedIn optimization tips
const linkedInTranslations = {
  en: {
    headline: "Headline",
    summary: "Summary",
    skills: "Skills", 
    experience: "Experience",
    projects: "Projects",
    opening: "Opening Line",
    closing: "Closing",
    unknownFormat: "Unknown format",
    expectedFields: "Expected fields",
    resume: "Resume",
    coverLetter: "Cover Letter",
    fixAndRetry: "Fix and retry",
    useHeadline: "Use something like",
    toClearlyShow: "to clearly show your role or value",
    considerExpanding: "Consider expanding it with goals and numbers",
    niceSummary: "Nice summary! Keep it results-focused",
    includeSkills: "Include in-demand skills. Current:",
    noSkillsListed: "No skills listed",
    highlightingWell: "You're highlighting accomplishments well!",
    useActionVerbs: "Use more action verbs and measurable wins",
    listInFeatured: "List them in LinkedIn's Featured section",
    addProjects: "Add projects to show applied skills",
    showEnthusiasm: "Show enthusiasm for the position/company",
    considerDetailing: "Consider detailing your motivations further",
    greatTone: "Great motivational tone",
    tailorExperience: "Tailor it directly to the job you're applying for",
    currentListed: "Current listed:",
    none: "None",
    addFromJobPost: "Add those from the job post!",
    endConfidently: "End confidently and thank the reader",
    cannotIdentify: "Cannot identify resume or cover letter structure",
    tryIncluding: "Try including personalInfo, education, or summary, experience, skills",
    shouldInclude: "Should include personalInfo, education, experience",
    shouldIncludeCL: "Should include summary, experience, skills (adapted)",
    letUsKnow: "Let us know if you'd like help formatting it"
  },
  es: {
    headline: "Titular",
    summary: "Resumen",
    skills: "Habilidades",
    experience: "Experiencia", 
    projects: "Proyectos",
    opening: "Línea de Apertura",
    closing: "Cierre",
    unknownFormat: "Formato desconocido",
    expectedFields: "Campos esperados",
    resume: "Currículum",
    coverLetter: "Carta de Presentación",
    fixAndRetry: "Corregir e intentar de nuevo",
    useHeadline: "Usa algo como",
    toClearlyShow: "para mostrar claramente tu rol o valor",
    considerExpanding: "Considera expandirlo con objetivos y números",
    niceSummary: "¡Buen resumen! Manténlo enfocado en resultados",
    includeSkills: "Incluye habilidades demandadas. Actuales:",
    noSkillsListed: "No hay habilidades listadas",
    highlightingWell: "¡Estás destacando los logros muy bien!",
    useActionVerbs: "Usa más verbos de acción y logros medibles",
    listInFeatured: "Lístalos en la sección Destacados de LinkedIn",
    addProjects: "Agrega proyectos para mostrar habilidades aplicadas",
    showEnthusiasm: "Muestra entusiasmo por el puesto/empresa",
    considerDetailing: "Considera detallar más tus motivaciones",
    greatTone: "Excelente tono motivacional",
    tailorExperience: "Ajústala directamente al trabajo al que postulas",
    currentListed: "Actualmente listadas:",
    none: "Ninguna",
    addFromJobPost: "¡Agrega las del anuncio de trabajo!",
    endConfidently: "Termina con confianza y agradece al lector",
    cannotIdentify: "No se puede identificar la estructura del currículum o carta de presentación",
    tryIncluding: "Intenta incluir personalInfo, education, o summary, experience, skills",
    shouldInclude: "Debería incluir personalInfo, education, experience",
    shouldIncludeCL: "Debería incluir summary, experience, skills (adaptado)",
    letUsKnow: "Déjanos saber si quieres ayuda para formatearlo"
  },
  fr: {
    headline: "Titre",
    summary: "Résumé",
    skills: "Compétences",
    experience: "Expérience",
    projects: "Projets", 
    opening: "Ligne d'Ouverture",
    closing: "Conclusion",
    unknownFormat: "Format inconnu",
    expectedFields: "Champs attendus",
    resume: "CV",
    coverLetter: "Lettre de Motivation",
    fixAndRetry: "Corriger et réessayer",
    useHeadline: "Utilisez quelque chose comme",
    toClearlyShow: "pour montrer clairement votre rôle ou valeur",
    considerExpanding: "Considérez l'élargir avec des objectifs et des chiffres",
    niceSummary: "Bon résumé! Gardez-le axé sur les résultats",
    includeSkills: "Incluez des compétences demandées. Actuelles:",
    noSkillsListed: "Aucune compétence listée",
    highlightingWell: "Vous mettez bien en valeur les accomplissements!",
    useActionVerbs: "Utilisez plus de verbes d'action et de gains mesurables",
    listInFeatured: "Listez-les dans la section En vedette de LinkedIn",
    addProjects: "Ajoutez des projets pour montrer les compétences appliquées",
    showEnthusiasm: "Montrez l'enthousiasme pour le poste/entreprise",
    considerDetailing: "Considérez détailler davantage vos motivations",
    greatTone: "Excellent ton motivationnel",
    tailorExperience: "Adaptez-la directement au poste pour lequel vous postulez",
    currentListed: "Actuellement listées:",
    none: "Aucune",
    addFromJobPost: "Ajoutez celles de l'offre d'emploi!",
    endConfidently: "Terminez avec confiance et remerciez le lecteur",
    cannotIdentify: "Impossible d'identifier la structure du CV ou de la lettre de motivation",
    tryIncluding: "Essayez d'inclure personalInfo, education, ou summary, experience, skills",
    shouldInclude: "Devrait inclure personalInfo, education, experience",
    shouldIncludeCL: "Devrait inclure summary, experience, skills (adapté)",
    letUsKnow: "Faites-nous savoir si vous voulez de l'aide pour le formater"
  },
  de: {
    headline: "Überschrift",
    summary: "Zusammenfassung",
    skills: "Fähigkeiten",
    experience: "Erfahrung",
    projects: "Projekte",
    opening: "Eröffnungszeile",
    closing: "Abschluss",
    unknownFormat: "Unbekanntes Format",
    expectedFields: "Erwartete Felder",
    resume: "Lebenslauf",
    coverLetter: "Anschreiben",
    fixAndRetry: "Korrigieren und erneut versuchen",
    useHeadline: "Verwenden Sie etwas wie",
    toClearlyShow: "um Ihre Rolle oder Ihren Wert klar zu zeigen",
    considerExpanding: "Erwägen Sie eine Erweiterung mit Zielen und Zahlen",
    niceSummary: "Gute Zusammenfassung! Bleiben Sie ergebnisorientiert",
    includeSkills: "Gefragte Fähigkeiten einbeziehen. Aktuell:",
    noSkillsListed: "Keine Fähigkeiten aufgelistet",
    highlightingWell: "Sie heben Erfolge gut hervor!",
    useActionVerbs: "Verwenden Sie mehr Aktionsverben und messbare Erfolge",
    listInFeatured: "Listen Sie sie in LinkedIns Featured-Bereich auf",
    addProjects: "Projekte hinzufügen, um angewandte Fähigkeiten zu zeigen",
    showEnthusiasm: "Zeigen Sie Begeisterung für die Position/das Unternehmen",
    considerDetailing: "Erwägen Sie, Ihre Motivationen weiter zu detaillieren",
    greatTone: "Großartiger motivierender Ton",
    tailorExperience: "Passen Sie sie direkt an den Job an, für den Sie sich bewerben",
    currentListed: "Derzeit aufgelistet:",
    none: "Keine",
    addFromJobPost: "Fügen Sie die aus der Stellenausschreibung hinzu!",
    endConfidently: "Enden Sie selbstbewusst und danken Sie dem Leser",
    cannotIdentify: "Kann Lebenslauf- oder Anschreibenstruktur nicht identifizieren",
    tryIncluding: "Versuchen Sie personalInfo, education oder summary, experience, skills einzubeziehen",
    shouldInclude: "Sollte personalInfo, education, experience enthalten",
    shouldIncludeCL: "Sollte summary, experience, skills (angepasst) enthalten",
    letUsKnow: "Lassen Sie uns wissen, wenn Sie Hilfe beim Formatieren möchten"
  }
};

// Helper function to get translations
const getTranslation = (language: string, key: keyof typeof linkedInTranslations.en): string => {
  const lang = language.toLowerCase().split('-')[0]; // Handle cases like 'en-US'
  const translations = linkedInTranslations[lang as keyof typeof linkedInTranslations] || linkedInTranslations.en;
  return translations[key] || linkedInTranslations.en[key];
};

// 🔧 Helper to get user's email from Firebase Realtime Database
const getUserEmailFromFirebase = async (userId: string): Promise<string | null> => {
  try {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}/email`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.warn(`No email found for user ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user email from Firebase:', error);
    return null;
  }
};

export const makeService = {
  EMAIL_JS_SERVICE_ID: 'service_h2cn09t',
  EMAIL_JS_PUBLIC_KEY: 'SvxGIwGTjoDVyPBRY',

  EMAIL_TEMPLATES: {
    PAYMENT_CONFIRMATION: 'template_mth5gr8',
    RESUME_GENERATED: 'template_9ae0fa8',
    COVER_LETTER_GENERATED: 'template_coverletter',
    DOCUMENT_DOWNLOADED: 'template_9ae0fa8',
  },

  sendEmail: async (
    templateParams: {
      email: string;         // {{email}}
      name: string;          // {{name}}
      title: string;         // {{title}} e.g., 'Payment Confirmation'
      user_email: string;    // Duplicate of {{email}} (just in case)
      subject: string;       // {{subject}}
      message: string;       // {{message}}
      html_message: string;  // {{html_message}}
      documentType?: string; // For 'resume' or 'coverLetter' in case of document download
      templateName?: string; // Template name for document download (optional)
      userId?: string;       // User ID (for payment confirmation)
      plan?: string;         // Plan name (for payment confirmation)
      sessionId?: string;    // Session ID (for payment confirmation)
    },
    templateId: string
  ) => {
    try {
      const response = await emailjs.send(
        makeService.EMAIL_JS_SERVICE_ID,
        templateId,
        templateParams,
        { publicKey: makeService.EMAIL_JS_PUBLIC_KEY }
      );
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: 'Failed to send email' };
    }
  },
  
  
  
  getLinkedInOptimizationTips: async (data: any, language: string = 'en'): Promise<OptimizationResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    // Basic detection: resume has personalInfo + education + experience
    const isResume =
      data?.personalInfo &&
      Array.isArray(data.education) &&
      Array.isArray(data.experience);
  
    const isCoverLetterLike =
      data?.summary &&
      Array.isArray(data.experience) &&
      Array.isArray(data.skills) &&
      !data.education;
  
    if (isResume) {
      const summaryLength = data.summary?.length || 0;
      const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
      const allSkills = data.skills.map((s: any) => s.skills).join(", ");
      const achievementsInExp = data.experience.some((exp: any) =>
        /achieved|improved|increased|reduced|led/i.test(exp.description)
      );
      
      const headlineSuggestion = (() => {
        const titleFromExperience = data.experience?.[0]?.position;
        const projectRole = data.projects?.[0]?.name;
        const fallback = "Professional Title";
      
        const title = titleFromExperience || projectRole || fallback;
      
        return `1. **${getTranslation(language, 'headline')}**: ${getTranslation(language, 'useHeadline')} "${title}" ${getTranslation(language, 'toClearlyShow')}.`;
      })();
      
      return {
        success: true,
        tips: `
${headlineSuggestion}
2. **${getTranslation(language, 'summary')}**: ${summaryLength < 100 ? getTranslation(language, 'considerExpanding') : getTranslation(language, 'niceSummary')}
3. **${getTranslation(language, 'skills')}**: ${getTranslation(language, 'includeSkills')} ${allSkills || getTranslation(language, 'noSkillsListed')}.
4. **${getTranslation(language, 'experience')}**: ${achievementsInExp ? getTranslation(language, 'highlightingWell') : getTranslation(language, 'useActionVerbs')}
5. **${getTranslation(language, 'projects')}**: ${hasProjects ? getTranslation(language, 'listInFeatured') : getTranslation(language, 'addProjects')}
`,
      };
    }
  
    if (isCoverLetterLike) {
      const summaryLength = data.summary?.length || 0;
      const allSkills = data.skills.map((s: any) => s.skills).join(", ");
  
      return {
        success: true,
        tips: `
1. **${getTranslation(language, 'opening')}**: ${getTranslation(language, 'showEnthusiasm')}
2. **${getTranslation(language, 'summary')}**: ${summaryLength < 50 ? getTranslation(language, 'considerDetailing') : getTranslation(language, 'greatTone')}
3. **${getTranslation(language, 'experience')}**: ${getTranslation(language, 'tailorExperience')}
4. **${getTranslation(language, 'skills')}**: ${getTranslation(language, 'currentListed')} ${allSkills || getTranslation(language, 'none')}. ${getTranslation(language, 'addFromJobPost')}
5. **${getTranslation(language, 'closing')}**: ${getTranslation(language, 'endConfidently')}`,
      };
    }
  
    return {
      success: true,
      tips: `
1. **${getTranslation(language, 'unknownFormat')}**: ${getTranslation(language, 'cannotIdentify')}
2. **${getTranslation(language, 'expectedFields')}**: ${getTranslation(language, 'tryIncluding')}
3. **${getTranslation(language, 'resume')}**: ${getTranslation(language, 'shouldInclude')}
4. **${getTranslation(language, 'coverLetter')}**: ${getTranslation(language, 'shouldIncludeCL')}
5. **${getTranslation(language, 'fixAndRetry')}**: ${getTranslation(language, 'letUsKnow')}`,
    };
  },
  
  

  getAtsScore: async (jobDescription: string, documentContent: string): Promise<AtsScoreResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const keywords = ['organized', 'leadership', 'teamwork', 'communication', 'excel', 'project management'];
    let matchCount = 0;

    keywords.forEach((keyword) => {
      if (documentContent.toLowerCase().includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });

    const score = Math.min(100, Math.round((matchCount / keywords.length) * 100));

    return {
      success: true,
      data: {
        score,
        missedKeywords: score < 100 ? ['innovative', 'strategic', 'analytical'] : [],
        recommendations: score < 100
          ? 'Try to include more industry-specific keywords from the job description.'
          : 'Your document is well-optimized for ATS systems!',
      },
    };
  },

  notifyPaymentConfirmed: async (data: PaymentNotificationData): Promise<any> => {
    const userEmail = await getUserEmailFromFirebase(data.userId);
    if (!userEmail) return { success: false, error: 'User email not found' };
  
    const templateParams = {
      email: userEmail,
      name: 'FlaronCV Support',
      title: 'Payment Confirmation',
      user_email: userEmail,
      subject: 'Payment Confirmation',
      message: `Payment confirmed for user ${data.userId}. Plan: ${data.plan}`,
      html_message: `
        <h1 style="color: #4F46E5;">Payment Confirmation</h1>
        <p>We've received your payment successfully!</p>
        <div>
          <p><strong>User ID:</strong> ${data.userId}</p>
          <p><strong>Plan:</strong> ${data.plan}</p>
          <p><strong>Session ID:</strong> ${data.sessionId}</p>
        </div>
        <p>Thank you for choosing FlaronCV!</p>
      `,
      userId: data.userId,
      plan: data.plan,
      sessionId: data.sessionId,
    };
  
    return makeService.sendEmail(templateParams, makeService.EMAIL_TEMPLATES.PAYMENT_CONFIRMATION);
  },  
  
  

  notifyDocumentDownloaded: async (data: DocumentGenerationData): Promise<any> => {
    const userEmail = await getUserEmailFromFirebase(data.userId);
    if (!userEmail) return { success: false, error: 'User email not found' };
  
    const templateParams = {
      email: userEmail,
      name: 'FlaronCV Support',
      title: `${data.documentType === 'resume' ? 'Resume' : 'Cover Letter'} Download`,
      user_email: userEmail,
      subject: `Your ${data.documentType === 'resume' ? 'Resume' : 'Cover Letter'} Download`,
      message: `Your ${data.documentType} has been successfully downloaded.`,
      html_message: `
        <h1 style="color: #4F46E5;">Document Downloaded</h1>
        <p>Your ${data.documentType} has been successfully downloaded.</p>
        <div>
          <p><strong>Document Type:</strong> ${data.documentType}</p>
          ${data.templateName ? `<p><strong>Template:</strong> ${data.templateName}</p>` : ''}
        </div>
        <p>Thank you for using FlaronCV!</p>
      `,
      documentType: data.documentType,
      templateName: data.templateName || '',
    };
  
    return makeService.sendEmail(templateParams, makeService.EMAIL_TEMPLATES.DOCUMENT_DOWNLOADED);
  },
  

  getJobRecommendations: async (resumeData: any): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      success: true,
      data: [
        {
          id: 'job1',
          title: 'Senior Software Engineer',
          company: 'Tech Solutions Inc.',
          location: 'Remote',
          description: 'Experienced developer needed with React and Node.js.',
          matchScore: 92,
          url: 'https://example.com/jobs/senior-software-engineer',
        },
        {
          id: 'job2',
          title: 'Frontend Developer',
          company: 'Digital Innovations',
          location: 'New York, NY',
          description: 'Modern web applications with latest tech.',
          matchScore: 87,
          url: 'https://example.com/jobs/frontend-developer',
        },
      ],
    };
  }
};