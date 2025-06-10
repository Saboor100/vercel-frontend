
import { ReactNode } from "react";

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    photo?: string;
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
  projects: Array<{
    name: string;
    description: string;
    link?: string;
    technologies?: string;
    date?: string;
  }>;
  skills: Array<{
    category: string;
    skills: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: number;
  }>;
  interests?: Array<string>;
  certifications?: Array<{
    title: ReactNode;
    name: string;
    date: string;
  }>;
  qualities?: Array<string>;
  template?: string;
  customSections?: Array<{
    title: string;
    content: string;
  }>;
}


export interface CoverLetterData {
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
  template?: string;
  
}