
import React, { useState, useMemo } from 'react';
import { MatchScore, Candidate, VisaStatus, LanguageLevel, JobPosition } from '../types';
import { analyzeCandidateMatch, getDistanceFromLatLonInKm } from '../services/geminiService';
import { Globe, MapPin, Search, SlidersHorizontal, ArrowRight, ChevronDown, ChevronUp, User, X, Mail, Plus, Trash2, Edit2, Briefcase, Zap } from 'lucide-react';
import { Button, InputField, Card, CardHeader, CardTitle, CardContent } from '../components/UIComponents';

// --- Santa Catarina Cities Coordinates (Real Coordinates) ---
const SC_CITIES = {
  'Florianópolis': { latitude: -27.5954, longitude: -48.5480 },
  'São José': { latitude: -27.6136, longitude: -48.6366 },
  'Joinville': { latitude: -26.3044, longitude: -48.8464 },
  'Blumenau': { latitude: -26.9194, longitude: -49.0661 },
  'Itajaí': { latitude: -26.9144, longitude: -48.6577 },
  'Brusque': { latitude: -27.1040, longitude: -48.9282 },
  'Chapecó': { latitude: -27.0996, longitude: -49.3301 },
  'Criciúma': { latitude: -28.6818, longitude: -49.3732 },
  'Jaraguá do Sul': { latitude: -26.4845, longitude: -49.0637 },
  'Lages': { latitude: -27.8134, longitude: -50.3279 },
};

// --- Mock Data (Santa Catarina Context Only) ---
const MOCK_JOBS_COMPANY = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    description: 'Liderar projetos React em nossa sede em Florianópolis. Procuramos um desenvolvedor experiente para arquitetar soluções escaláveis.',
    seniority: 'Senior',
    hardSkills: ['React', 'TypeScript', 'Node.js'],
    softSkills: ['Liderança', 'Mentoria'],
    locationName: 'Florianópolis, SC (Centro)',
    location: { latitude: -27.5954, longitude: -48.5480 },
    modality: 'Hibrido',
    isCanadianOpportunity: false,
    cultureTags: ['Colaborativo', 'Inovador', 'Flexibilidade'],
    requiredSkills: ['React', 'TypeScript']
  },
  {
    id: 'job-2',
    title: 'Backend Developer Pleno',
    description: 'Desenvolvimento de APIs REST em Java/Spring. Time colaborativo na região de Blumenau.',
    seniority: 'Pleno',
    hardSkills: ['Java', 'Spring Boot', 'SQL'],
    softSkills: ['Comunicação', 'Resolução de Problemas'],
    locationName: 'Blumenau, SC',
    location: { latitude: -26.9194, longitude: -49.0661 },
    modality: 'Presencial',
    isCanadianOpportunity: false,
    cultureTags: ['Qualidade', 'Inovação'],
    requiredSkills: ['Java', 'Spring']
  }
];

const MOCK_CANDIDATES_SC: Candidate[] = [
  {
    id: 'c1',
    name: 'Alex Silva',
    role: 'Senior Full Stack Developer',
    locationName: 'Florianópolis, SC (Trindade)',
    location: { latitude: -27.5855, longitude: -48.5173 },
    experienceYears: 7,
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
    cultureTags: ['Colaborativo', 'Inovador'],
    bio: 'Desenvolvedor apaixonado por tecnologia e arquitetura de software.',
    resumeText: 'Especialista em React e Node.js com 7 anos de experiência em startups e empresas consolidadas.',
    visaStatus: VisaStatus.CITIZEN,
    englishLevel: LanguageLevel.ADVANCED,
    softSkills: ['Mentoria', 'Liderança técnica', 'Comunicação'],
    email: 'alex.silva@email.com'
  },
  {
    id: 'c2',
    name: 'Carla Dias',
    role: 'Product Manager / Tech Lead',
    locationName: 'São José, SC',
    location: { latitude: -27.6136, longitude: -48.6366 },
    experienceYears: 6,
    skills: ['JavaScript', 'React', 'Figma'],
    cultureTags: ['Colaborativo', 'Inovador'],
    bio: 'Profissional versátil que atua na interseção de produto e tecnologia.',
    resumeText: 'Gerenciei ciclo de vida de produtos digitais e liderou equipes de desenvolvimento.',
    visaStatus: VisaStatus.CITIZEN,
    englishLevel: LanguageLevel.FLUENT,
    softSkills: ['Comunicação', 'Gestão de Projetos', 'Visão Estratégica'],
    email: 'carla.dias@email.com'
  },
  {
    id: 'c3',
    name: 'Bruno Souza',
    role: 'Backend Engineer',
    locationName: 'Joinville, SC',
    location: { latitude: -26.3044, longitude: -48.8464 },
    experienceYears: 4,
    skills: ['Java', 'Spring Boot', 'SQL', 'Docker'],
    cultureTags: ['Focado', 'Qualidade'],
    bio: 'Engenheiro de software focado em escalabilidade e boas práticas.',
    resumeText: 'Experiência com microsserviços, Docker e padrões de arquitetura limpa.',
    visaStatus: VisaStatus.CITIZEN,
    englishLevel: LanguageLevel.INTERMEDIATE,
    softSkills: ['Resolução de Problemas', 'Trabalho em Equipe'],
    email: 'bruno.souza@email.com'
  },
  {
    id: 'c4',
    name: 'Marina Costa',
    role: 'Full Stack Developer',
    locationName: 'Blumenau, SC',
    location: { latitude: -26.9194, longitude: -49.0661 },
    experienceYears: 5,
    skills: ['React', 'Node.js', 'JavaScript', 'SQL'],
    cultureTags: ['Inovação', 'Colaborativo'],
    bio: 'Desenvolvedora com paixão por criar experiências web incríveis.',
    resumeText: 'Especialista em full stack JavaScript com foco em performance e UX.',
    visaStatus: VisaStatus.CITIZEN,
    englishLevel: LanguageLevel.FLUENT,
    softSkills: ['Criatividade', 'Atenção aos Detalhes', 'Proatividade'],
    email: 'marina.costa@email.com'
  },
  {
    id: 'c5',
    name: 'Felipe Santos',
    role: 'Senior Backend Developer',
    locationName: 'Chapecó, SC',
    location: { latitude: -27.0996, longitude: -49.3301 },
    experienceYears: 8,
    skills: ['Java', 'Spring', 'AWS', 'Kubernetes'],
    cultureTags: ['Qualidade', 'Excelência'],
    bio: 'Arquiteto de software com experiência em sistemas de alta escala.',
    resumeText: 'Desenvolveu soluções em cloud para empresas do varejo e fintech.',
    visaStatus: VisaStatus.CITIZEN,
    englishLevel: LanguageLevel.ADVANCED,
    softSkills: ['Arquitetura', 'Mentorado', 'Documentação'],
    email: 'felipe.santos@email.com'
  },
  {
    id: 'c6',
    name: 'Luciana Ferreira',
    role: 'Frontend Developer',
    locationName: 'Itajaí, SC',
    location: { latitude: -26.9144, longitude: -48.6577 },
    experienceYears: 3,
    skills: ['React', 'Vue.js', 'TypeScript', 'Tailwind'],
    cultureTags: ['Aprendizado', 'Inovação'],
    bio: 'Desenvolvedora criativa focada em interfaces responsivas e acessíveis.',
    resumeText: 'Especialista em frontend moderno com foco em acessibilidade web.',
    visaStatus: VisaStatus.CITIZEN,
    englishLevel: LanguageLevel.INTERMEDIATE,
    softSkills: ['Design Thinking', 'Colaboração', 'Curiosidade'],
    email: 'luciana.ferreira@email.com'
  }
];

export const CompanyDashboard: React.FC<any> = ({ companyData }) => {
  const [canadaMode, setCanadaMode] = useState(false);
  const [scores, setScores] = useState<Record<string, MatchScore>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [visaFilter, setVisaFilter] = useState<string>('ALL');
  const [langFilter, setLangFilter] = useState<string>('ALL');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [jobs, setJobs] = useState<JobPosition[]>(MOCK_JOBS_COMPANY);
  const [selectedJobForCandidates, setSelectedJobForCandidates] = useState<string | null>(null);

  const activeJob = jobs.find(j => {
    if (selectedJobForCandidates) return j.id === selectedJobForCandidates;
    return canadaMode ? j.isCanadianOpportunity : !j.isCanadianOpportunity;
  }) || jobs[0];

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    const newScores: Record<string, MatchScore> = {};
    for (const candidate of MOCK_CANDIDATES_SC) {
      const score = await analyzeCandidateMatch(candidate as any, activeJob as any);
      newScores[candidate.id] = score;
    }
    setScores(newScores);
    setAnalyzing(false);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
      setJobs(jobs.filter(j => j.id !== jobId));
      if (selectedJobForCandidates === jobId) {
        setSelectedJobForCandidates(null);
        setScores({});
      }
    }
  };

  const handlePublishJob = (newJob: JobPosition) => {
    setJobs([...jobs, newJob]);
    setShowPublishModal(false);
    setSelectedJobForCandidates(newJob.id);
  };

  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES_SC.filter(c => {
      if (!canadaMode) return true;
      if (visaFilter !== 'ALL' && c.visaStatus !== visaFilter) return false;
      if (langFilter !== 'ALL' && c.englishLevel !== langFilter) return false;
      return true;
    }).sort((a, b) => {
        const scoreA = scores[a.id]?.overallScore || 0;
        const scoreB = scores[b.id]?.overallScore || 0;
        return scoreB - scoreA;
    });
  }, [canadaMode, visaFilter, langFilter, scores]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Painel de Recrutamento</h2>
            <p className="text-slate-500 text-sm mt-1">Gerencie suas vagas e analise candidatos</p>
          </div>
          
          <Button onClick={() => setShowPublishModal(true)} className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 flex items-center gap-2">
            <Plus size={18} /> Publicar Vaga
          </Button>
        </div>

        {/* Vagas Publicadas */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Briefcase size={16} /> Vagas Publicadas ({jobs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJobForCandidates(job.id);
                  setCanadaMode(job.isCanadianOpportunity);
                  setScores({});
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedJobForCandidates === job.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{job.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={12} /> {job.locationName}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job.id);
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-white rounded border border-slate-200">{job.seniority}</span>
                  <span className="text-xs px-2 py-1 bg-white rounded border border-slate-200">{job.modality}</span>
                  {job.isCanadianOpportunity && <span className="text-xs px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded font-mono">🍁 CA</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaga Ativa para Análise */}
        {activeJob && (
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-500 text-sm">Vaga Selecionada para Análise:</span>
              <span className="font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded">{activeJob.title}</span>
              <button onClick={() => setShowJobDetails(!showJobDetails)} className="ml-2 text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1 underline">
                {showJobDetails ? 'Ocultar' : 'Ver'} Detalhes
                {showJobDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {showJobDetails && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-600 text-sm mb-3">{activeJob.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">Hard Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeJob.hardSkills.map(s => <span key={s} className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Soft Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeJob.softSkills.map(s => <span key={s} className="text-xs bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Controls */}
        <div className="mt-6 flex items-center gap-4">
          <button onClick={handleRunAnalysis} disabled={analyzing} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2">
            {analyzing ? 'Analisando...' : <>Calcular Match <Search size={16}/></>}
          </button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCandidates.map(candidate => {
            const score = scores[candidate.id];
            const distanceKm = getDistanceFromLatLonInKm(activeJob.location.latitude, activeJob.location.longitude, candidate.location.latitude, candidate.location.longitude);

            return (
              <div key={candidate.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                 <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start min-w-[220px]">
                        <div className="flex items-center gap-4 mb-3">
                           <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white">{candidate.name.charAt(0)}</div>
                           <div>
                              <h3 className="text-lg font-bold text-slate-900 leading-tight">{candidate.name}</h3>
                              <div className="text-sm text-slate-500">{candidate.role}</div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-slate-500 mb-3 w-full">
                          <div className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {candidate.locationName}</div>
                          <div className={`flex items-center gap-1 font-bold px-2 py-1 rounded-full text-xs w-fit ${
                            distanceKm < 30 ? 'bg-green-100 text-green-700' : 
                            distanceKm < 60 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                             <Zap size={10} /> {distanceKm.toFixed(2)} km
                          </div>
                        </div>
                    </div>

                    <div className="flex-grow border-l border-r border-slate-100 px-0 md:px-6 py-4 md:py-0">
                        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                           <div className="text-slate-500">Exp: <span className="text-slate-900 font-medium">{candidate.experienceYears} Anos</span></div>
                           <div className="text-slate-500">Skills: <span className="text-slate-900 font-medium">{candidate.skills.slice(0,3).join(', ')}...</span></div>
                        </div>
                        {score && (
                           <div className="mt-4">
                              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Match Breakdown</span><span>{score.overallScore}% Total</span></div>
                              <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                                 <div className="bg-green-500 h-full" style={{ width: `${score.technicalFit * 0.35}%` }} title="Tech (35%)"></div>
                                 <div className="bg-purple-500 h-full" style={{ width: `${score.softSkillsMatch * 0.25}%` }} title="Soft (25%)"></div>
                                 <div className="bg-yellow-500 h-full" style={{ width: `${score.culturalFit * 0.25}%` }} title="Culture (25%)"></div>
                                 <div className="bg-blue-500 h-full" style={{ width: `${score.locationScore * 0.15}%` }} title="Geo (15%)"></div>
                              </div>
                           </div>
                        )}
                    </div>

                    <div className="flex-shrink-0 min-w-[120px] flex flex-col items-center justify-center">
                       {score ? (
                           <div className="text-center">
                              <div className="text-3xl font-bold text-slate-900 mb-1">{score.overallScore}%</div>
                              <button onClick={() => setSelectedCandidate(candidate as any)} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">Ver Perfil <ArrowRight size={14}/></button>
                           </div>
                       ) : (
                           <div className="text-slate-300 text-center"><Search size={32} className="mx-auto mb-2"/><span className="text-xs">Calcular</span></div>
                       )}
                    </div>
                 </div>
              </div>
            )
        })}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && scores[selectedCandidate.id] && (
        <CandidateDetailModal 
          candidate={selectedCandidate} 
          score={scores[selectedCandidate.id]}
          activeJob={activeJob}
          onClose={() => setSelectedCandidate(null)} 
        />
      )}

      {/* Modal de Publicar Vaga */}
      {showPublishModal && <PublishJobModal onClose={() => setShowPublishModal(false)} onPublish={handlePublishJob} />}
    </div>
  );
};

// --- Componente de Detalhes do Candidato ---

interface CandidateDetailModalProps {
  candidate: Candidate;
  score: MatchScore;
  activeJob: JobPosition;
  onClose: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
};

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({ candidate, score, activeJob, onClose }) => {
  const distanceKm = getDistanceFromLatLonInKm(activeJob.location.latitude, activeJob.location.longitude, candidate.location.latitude, candidate.location.longitude);
  const visaCompatible = candidate.visaStatus === VisaStatus.CITIZEN || candidate.visaStatus === VisaStatus.WORK_PERMIT;
  const englishGood = candidate.englishLevel === LanguageLevel.NATIVE || candidate.englishLevel === LanguageLevel.FLUENT || candidate.englishLevel === LanguageLevel.ADVANCED;

  // Análise de por que é um bom candidato
  const analysisReasons = [];
  
  if (score.technicalFit >= 75) analysisReasons.push({ title: '✅ Experiência Técnica', desc: `${score.technicalFit}% de compatibilidade técnica - possui as skills necessárias`, icon: '🛠️' });
  if (score.softSkillsMatch >= 70) analysisReasons.push({ title: '✅ Soft Skills Alinhadas', desc: `${score.softSkillsMatch}% de fit em soft skills - tem o perfil comportamental que buscamos`, icon: '🤝' });
  if (score.culturalFit >= 75) analysisReasons.push({ title: '✅ Alinhamento Cultural', desc: `${score.culturalFit}% de fit cultural - valores alinhados com nossa empresa`, icon: '🎯' });
  if (score.locationScore >= 70) analysisReasons.push({ title: '✅ Proximidade Geográfica', desc: `${distanceKm.toFixed(2)} km de distância - pronto para começar logo`, icon: '📍' });
  if (candidate.experienceYears >= 5) analysisReasons.push({ title: '✅ Experiência Consolidada', desc: `${candidate.experienceYears} anos de experiência - profissional maduro e confiável`, icon: '📚' });
  if (score.overallScore >= 80) analysisReasons.push({ title: '🌟 Excelente Candidato', desc: `Score geral de ${score.overallScore}% - um dos melhores para esta posição`, icon: '⭐' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start`}>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-1">{candidate.name}</h2>
            <p className="text-blue-100">{candidate.role}</p>
          </div>
          <div className={`text-center px-6 py-3 rounded-xl ${score.overallScore >= 80 ? 'bg-green-500' : score.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'} font-bold`}>
            <div className="text-2xl">{score.overallScore}%</div>
            <div className="text-xs mt-1">Match Score</div>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white ml-4"><X size={28} /></button>
        </div>

        <div className="p-8 space-y-6">

          {/* Informações Básicas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-medium mb-1">Localização</div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <div className="text-sm font-medium text-slate-900">{candidate.locationName}</div>
              </div>
                <div className={`text-xs mt-2 ${distanceKm < 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {distanceKm.toFixed(2)} km da vaga
                </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-medium mb-1">Experiência</div>
              <div className="text-2xl font-bold text-slate-900">{candidate.experienceYears}</div>
              <div className="text-xs text-slate-500">Anos no mercado</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-medium mb-1">Status Visa</div>
              <div className={`text-sm font-medium ${visaCompatible ? 'text-green-600' : 'text-yellow-600'}`}>
                {candidate.visaStatus}
              </div>
              <div className="text-xs text-slate-500 mt-1">{visaCompatible ? '✅ Pronto' : '⚠️ Verificar'}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-medium mb-1">Inglês</div>
              <div className={`text-sm font-medium ${englishGood ? 'text-green-600' : 'text-orange-600'}`}>
                {candidate.englishLevel}
              </div>
              <div className="text-xs text-slate-500 mt-1">{englishGood ? '✅ Fluente' : '⚠️ Básico'}</div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border-2 ${getScoreBg(score.technicalFit)}`}>
              <div className="text-xs text-slate-600 font-medium mb-2">Hard Skills</div>
              <div className={`text-3xl font-bold ${getScoreColor(score.technicalFit)}`}>{score.technicalFit}%</div>
              <div className="w-full bg-slate-200 rounded-full h-1 mt-3">
                <div className={`h-1 rounded-full ${score.technicalFit >= 75 ? 'bg-green-500' : score.technicalFit >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score.technicalFit}%` }}></div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${getScoreBg(score.softSkillsMatch)}`}>
              <div className="text-xs text-slate-600 font-medium mb-2">Soft Skills</div>
              <div className={`text-3xl font-bold ${getScoreColor(score.softSkillsMatch)}`}>{score.softSkillsMatch}%</div>
              <div className="w-full bg-slate-200 rounded-full h-1 mt-3">
                <div className={`h-1 rounded-full ${score.softSkillsMatch >= 70 ? 'bg-green-500' : score.softSkillsMatch >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score.softSkillsMatch}%` }}></div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${getScoreBg(score.culturalFit)}`}>
              <div className="text-xs text-slate-600 font-medium mb-2">Fit Cultural</div>
              <div className={`text-3xl font-bold ${getScoreColor(score.culturalFit)}`}>{score.culturalFit}%</div>
              <div className="w-full bg-slate-200 rounded-full h-1 mt-3">
                <div className={`h-1 rounded-full ${score.culturalFit >= 75 ? 'bg-green-500' : score.culturalFit >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score.culturalFit}%` }}></div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${getScoreBg(score.locationScore)}`}>
              <div className="text-xs text-slate-600 font-medium mb-2">Localização</div>
              <div className={`text-3xl font-bold ${getScoreColor(score.locationScore)}`}>{score.locationScore}%</div>
              <div className="w-full bg-slate-200 rounded-full h-1 mt-3">
                <div className={`h-1 rounded-full ${score.locationScore >= 70 ? 'bg-green-500' : score.locationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score.locationScore}%` }}></div>
              </div>
            </div>
          </div>

          {/* Por que é um bom candidato */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              🎯 Por que é um bom candidato para esta vaga
            </h3>
            <div className="space-y-3">
              {analysisReasons.length > 0 ? (
                analysisReasons.map((reason, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-white rounded-lg border border-blue-100">
                    <div className="text-xl flex-shrink-0">{reason.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-slate-900">{reason.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{reason.desc}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600">Este candidato tem potencial para a vaga. Verifique os detalhes abaixo.</div>
              )}
            </div>
          </div>

          {/* Resumo Profissional */}
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              📝 Resumo Profissional
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed italic">"{candidate.resumeText}"</p>
            <p className="text-sm text-slate-600 mt-3">💬 {candidate.bio}</p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</span>
                Hard Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map(skill => (
                  <div key={skill} className="px-3 py-1.5 bg-white border-2 border-green-300 text-green-700 rounded-full text-xs font-medium hover:shadow-md transition-shadow">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</span>
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.softSkills.map(skill => (
                  <div key={skill} className="px-3 py-1.5 bg-white border-2 border-purple-300 text-purple-700 rounded-full text-xs font-medium hover:shadow-md transition-shadow">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alinhamento com a Vaga */}
          <div className="p-6 bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl border-2 border-brand-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              🎯 Alinhamento com a vaga: {activeJob.title}
            </h3>
            
            <div className="space-y-3 mb-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Skills Requeridas vs Candidato</div>
                <div className="flex flex-wrap gap-2">
                  {activeJob.requiredSkills.map(skill => {
                    const hasSkill = candidate.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <div key={skill} className={`px-2 py-1 rounded text-xs font-medium ${hasSkill ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                        {skill} {hasSkill ? '✓' : '✗'}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Valores Culturais Compartilhados</div>
                <div className="flex flex-wrap gap-2">
                  {activeJob.cultureTags.map(tag => {
                    const hasTag = candidate.cultureTags.includes(tag);
                    return (
                      <div key={tag} className={`px-2 py-1 rounded text-xs font-medium ${hasTag ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                        {tag} {hasTag ? '✓' : '·'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700">
              <strong>Análise:</strong> {score.reasoning}
            </p>
          </div>

          {/* Contato */}
          <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">Entrar em Contato</div>
              <div className="text-sm text-slate-600">{candidate.email || 'email@candidato.com'}</div>
            </div>
            <Button className="bg-brand-600 hover:bg-brand-700 text-white">
              Enviar Mensagem
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Modal de Publicar Vaga ---

interface PublishJobModalProps {
  onClose: () => void;
  onPublish: (job: JobPosition) => void;
}

const PublishJobModal: React.FC<PublishJobModalProps> = ({ onClose, onPublish }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    seniority: 'Pleno' as const,
    hardSkills: [] as string[],
    softSkills: [] as string[],
    locationName: 'Florianópolis',
    modality: 'Hibrido' as const,
    cultureTags: [] as string[],
  });

  const [skillInput, setSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');
  const [cultureInput, setCultureInput] = useState('');

  const selectedLocation = SC_CITIES[formData.locationName as keyof typeof SC_CITIES] || SC_CITIES['Florianópolis'];

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        hardSkills: [...prev.hardSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleAddSoftSkill = () => {
    if (softSkillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        softSkills: [...prev.softSkills, softSkillInput.trim()]
      }));
      setSoftSkillInput('');
    }
  };

  const handleAddCultureTag = () => {
    if (cultureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        cultureTags: [...prev.cultureTags, cultureInput.trim()]
      }));
      setCultureInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      hardSkills: prev.hardSkills.filter(s => s !== skill)
    }));
  };

  const handleRemoveSoftSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter(s => s !== skill)
    }));
  };

  const handleRemoveCultureTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      cultureTags: prev.cultureTags.filter(t => t !== tag)
    }));
  };

  const handlePublish = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Preencha todos os campos obrigatórios: Título e Descrição');
      return;
    }

    const newJob: JobPosition = {
      id: `job-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      seniority: formData.seniority,
      hardSkills: formData.hardSkills,
      softSkills: formData.softSkills,
      locationName: formData.locationName,
      location: selectedLocation,
      modality: formData.modality,
      isCanadianOpportunity: false,
      cultureTags: formData.cultureTags,
      requiredSkills: formData.hardSkills,
      createdAt: new Date(),
    };

    onPublish(newJob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="text-brand-600" /> Publicar Nova Vaga</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Título */}
          <InputField
            label="Título da Vaga *"
            placeholder="Ex: Desenvolvedor React Senior"
            value={formData.title}
            onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
          />

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição *</label>
            <textarea
              placeholder="Descreva a vaga, responsabilidades e diferencial da empresa..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          {/* Grid 2 colunas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senioridade</label>
              <select
                value={formData.seniority}
                onChange={(e) => setFormData({ ...formData, seniority: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Junior">Junior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Senior</option>
                <option value="Especialista">Especialista</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Modalidade</label>
              <select
                value={formData.modality}
                onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Presencial">Presencial</option>
                <option value="Hibrido">Híbrido</option>
                <option value="Remoto">Remoto</option>
              </select>
            </div>
          </div>

          {/* Localização - Cidades de SC */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Localização em Santa Catarina *</label>
            <select
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {Object.keys(SC_CITIES).map(city => (
                <option key={city} value={city}>{city}, SC</option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin size={12} /> Coordenadas: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </div>
          </div>

          {/* Hard Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hard Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: React, TypeScript"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <button onClick={handleAddSkill} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 flex items-center gap-1">
                <Plus size={16} /> Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.hardSkills.map(skill => (
                <div key={skill} className="bg-brand-50 border border-brand-200 text-brand-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="text-brand-500 hover:text-brand-700">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Soft Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: Liderança, Comunicação"
                value={softSkillInput}
                onChange={(e) => setSoftSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSoftSkill()}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <button onClick={handleAddSoftSkill} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-1">
                <Plus size={16} /> Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.softSkills.map(skill => (
                <div key={skill} className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button onClick={() => handleRemoveSoftSkill(skill)} className="text-purple-500 hover:text-purple-700">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Culture Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tags de Cultura</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: Inovação, Colaborativo"
                value={cultureInput}
                onChange={(e) => setCultureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCultureTag()}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <button onClick={handleAddCultureTag} className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 flex items-center gap-1">
                <Plus size={16} /> Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.cultureTags.map(tag => (
                <div key={tag} className="bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  #{tag}
                  <button onClick={() => handleRemoveCultureTag(tag)} className="text-slate-500 hover:text-slate-700">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <Briefcase size={16} /> Publicar Vaga
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
