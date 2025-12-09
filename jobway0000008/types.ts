
export enum ViewState {
  LANDING = 'LANDING',
  ABOUT = 'ABOUT',
  LOGIN = 'LOGIN',
  CANDIDATE_SIGNUP = 'CANDIDATE_SIGNUP',
  COMPANY_SIGNUP = 'COMPANY_SIGNUP',
  COMPANY_ONBOARDING = 'COMPANY_ONBOARDING',
  COMPANY_DASHBOARD = 'COMPANY_DASHBOARD',
  CANDIDATE_DASHBOARD = 'CANDIDATE_DASHBOARD',
}

export enum UserType {
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

export enum VisaStatus {
  CITIZEN = 'Citizen/PR',
  WORK_PERMIT = 'Work Permit',
  STUDENT = 'Student Visa',
  NO_VISA = 'No Visa',
}

export enum LanguageLevel {
  NATIVE = 'Native',
  FLUENT = 'Fluent',
  ADVANCED = 'Advanced',
  INTERMEDIATE = 'Intermediate',
  BASIC = 'Basic',
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface CandidateProfile {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: {
    cep: string;
    city: string;
    state: string;
    neighborhood: string;
  };
  linkedInUrl: string;
  areaOfInterest: string;
  skills: string[];
  resumeText?: string;
  experienceLevel?: string;
  coordinates?: LocationCoordinates; // For map
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  locationName: string;
  location: LocationCoordinates;
  experienceYears: number;
  skills: string[];
  cultureTags: string[];
  bio: string;
  resumeText: string;
  // Canada specific
  visaStatus: VisaStatus;
  englishLevel: LanguageLevel;
  softSkills: string[];
  email?: string;
}

export interface CompanyProfile {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  culture?: {
    description: string;
    tags: string[];
  };
}

export interface JobPosition {
  id: string;
  title: string;
  description: string;
  seniority: 'Junior' | 'Pleno' | 'Senior' | 'Especialista';
  hardSkills: string[];
  softSkills: string[];
  locationName: string; // Display name
  location: LocationCoordinates; // GPS
  modality: 'Presencial' | 'Hibrido' | 'Remoto';
  isCanadianOpportunity: boolean;
  createdAt: Date;
  distance?: number;
  
  // Extra fields for detailed view
  cultureTags: string[];
  requiredSkills: string[];
  nocCode?: string; // For Canada
}

export interface MatchScores {
  geo: number;      
  experience: number;
  softSkills: number;
  culture: number;   
  total: number;      
}

export interface MatchScore {
  overallScore: number;
  technicalFit: number;
  culturalFit: number;
  softSkillsMatch: number;
  locationScore: number;
  reasoning: string;
}

export interface CandidateMatch extends Candidate {
  scores: MatchScores;
  summary: string; // Short summary
}
