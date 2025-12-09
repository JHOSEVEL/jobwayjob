import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Candidate, JobPosition, MatchScore } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if key exists
const hasKey = () => !!apiKey;

// --- Utils ---

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); 
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

const deg2rad = (deg: number) => {
  return deg * (Math.PI/180)
}

// --- Analysis ---

export const analyzeCandidateMatch = async (candidate: Candidate, job: JobPosition): Promise<MatchScore> => {
  // Mock logic for demo purposes (real logic would use Gemini to compare resume text vs job description)
  
  // 1. Geo Score
  const distance = getDistanceFromLatLonInKm(
    job.location.latitude, job.location.longitude,
    candidate.location.latitude, candidate.location.longitude
  );
  
  let geoScore = 100;
  if (distance > 50) geoScore = 20;
  else if (distance > 20) geoScore = 50;
  else if (distance > 10) geoScore = 70;
  else if (distance > 5) geoScore = 85;

  // 2. Technical Score (Skill overlap)
  const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
  const candSkills = candidate.skills.map(s => s.toLowerCase());
  const overlap = jobSkills.filter(s => candSkills.some(cs => cs.includes(s) || s.includes(cs)));
  const techScore = Math.min(100, Math.round((overlap.length / jobSkills.length) * 100) + (candidate.experienceYears * 5));

  // 3. Culture (Tag overlap)
  const cultureOverlap = job.cultureTags.filter(t => candidate.cultureTags.includes(t));
  const cultureScore = Math.min(100, (cultureOverlap.length / Math.max(1, job.cultureTags.length)) * 100 + 40);

  // 4. Soft Skills
  const softScore = Math.floor(Math.random() * 30) + 60; // Random 60-90 for MVP

  // Total Weighted
  // Geo: 15%, Tech: 40%, Soft: 25%, Culture: 20%
  const overall = Math.round(
    (geoScore * 0.15) + (techScore * 0.40) + (softScore * 0.25) + (cultureScore * 0.20)
  );

  // Generate Reasoning
  const reasoning = `Candidate has ${overlap.length}/${jobSkills.length} required skills (${overlap.join(', ')}). Distance is ${distance.toFixed(1)}km. Cultural alignment on ${cultureOverlap.join(', ') || 'values'}.`;

  return {
    overallScore: overall,
    technicalFit: techScore,
    culturalFit: cultureScore,
    softSkillsMatch: softScore,
    locationScore: geoScore,
    reasoning: reasoning
  };
};

export const parseResume = async (base64Data: string, mimeType: string): Promise<any> => {
  if (!hasKey()) {
    console.warn("No API Key. Returning mock data.");
    return {
      name: "João da Silva",
      email: "joao.silva@example.com",
      phone: "(11) 99999-9999",
      skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
      experienceLevel: "Pleno",
      summary: "Desenvolvedor Full Stack com 5 anos de experiência."
    };
  }

  const model = "gemini-2.5-flash";
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      email: { type: Type.STRING },
      phone: { type: Type.STRING },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      experienceLevel: { type: Type.STRING, enum: ["Junior", "Pleno", "Senior", "Especialista"] },
      summary: { type: Type.STRING },
    },
    required: ["name", "skills", "experienceLevel"],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Extraia as informações deste currículo para preencher um perfil de candidato. Identifique as principais habilidades técnicas (hard skills), nível de senioridade estimado e um breve resumo.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
};

export const generateJobDescription = async (
  title: string,
  seniority: string,
  skills: string[],
  companyCulture: string
): Promise<{ description: string; suggestedSoftSkills: string[] }> => {
  if (!hasKey()) {
    return {
      description: `Esta é uma vaga gerada automaticamente para ${title} (${seniority}). Buscamos alguém apaixonado por tecnologia e inovação para se juntar ao nosso time.`,
      suggestedSoftSkills: ["Comunicação", "Trabalho em Equipe", "Proatividade"]
    };
  }

  const model = "gemini-2.5-flash";
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      description: { type: Type.STRING },
      suggestedSoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["description", "suggestedSoftSkills"],
  };

  const prompt = `Crie uma descrição de vaga atraente para a posição de ${title}, nível ${seniority}.
  Habilidades técnicas requeridas: ${skills.join(", ")}.
  Cultura da empresa: ${companyCulture}.
  A descrição deve ser profissional, convidativa e estruturada.
  Também sugira 3 a 5 soft skills que combinem com essa vaga e cultura.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    return text ? JSON.parse(text) : { description: "", suggestedSoftSkills: [] };
  } catch (error) {
    console.error("Error generating JD:", error);
    throw error;
  }
};

export const generateCultureProfile = async (
  answers: { question: string; answer: string }[]
): Promise<{ description: string; tags: string[] }> => {
  if (!hasKey()) {
    return {
      description: "Uma cultura focada em resultados e inovação, valorizando a autonomia dos colaboradores.",
      tags: ["#inovação", "#autonomia", "#resultados"]
    };
  }

  const prompt = `Analise as seguintes respostas sobre o ambiente de trabalho e defina a cultura da empresa em um parágrafo curto e gere 3 tags (hashtags).
  Respostas: ${JSON.stringify(answers)}`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      description: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["description", "tags"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    return text ? JSON.parse(text) : { description: "", tags: [] };
  } catch (error) {
    console.error("Error generating culture:", error);
    throw error;
  }
};