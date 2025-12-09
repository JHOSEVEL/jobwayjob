
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { JobPosition } from '../types';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '../components/UIComponents';
import { List, Map as MapIcon, Briefcase, X, Sparkles, Brain, Heart, MapPin, Search, ArrowRight, CheckCircle, Building2, Globe } from 'lucide-react';
import { getDistanceFromLatLonInKm } from '../services/geminiService';
import { getJobs } from '../services/supabaseClient';

// --- Mock Data (Santa Catarina Context) ---
const MOCK_JOBS_SC: JobPosition[] = [
  {
    id: 'job-101',
    title: 'Desenvolvedor React Senior',
    description: 'Buscamos um especialista em React para liderar nossa migração de legado. Ambiente inovador no parque tecnológico.',
    seniority: 'Senior',
    hardSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    softSkills: ['Liderança', 'Mentoria', 'Resolução de Problemas'],
    locationName: 'Florianópolis, SC (Centro)',
    location: { latitude: -27.5954, longitude: -48.5480 },
    modality: 'Hibrido',
    isCanadianOpportunity: false,
    cultureTags: ['Inovação', 'Flexibilidade', 'Autonomia'],
    requiredSkills: ['React', 'TypeScript'],
    createdAt: new Date()
  },
  {
    id: 'job-102',
    title: 'Analista de Suporte Bilíngue',
    description: 'Suporte técnico para clientes internacionais. Necessário inglês fluente.',
    seniority: 'Junior',
    hardSkills: ['Suporte', 'Linux', 'Redes'],
    softSkills: ['Comunicação', 'Empatia', 'Paciência'],
    locationName: 'São José, SC (Kobrasol)',
    location: { latitude: -27.5900, longitude: -48.6150 }, // Approx São José
    modality: 'Presencial',
    isCanadianOpportunity: false,
    cultureTags: ['Processos', 'Cliente em Primeiro'],
    requiredSkills: ['Inglês', 'Linux'],
    createdAt: new Date()
  },
  {
    id: 'job-103',
    title: 'Engenheiro de Dados',
    description: 'Trabalhar com grandes volumes de dados no setor têxtil.',
    seniority: 'Pleno',
    hardSkills: ['Python', 'SQL', 'Spark'],
    softSkills: ['Analítico', 'Organização'],
    locationName: 'Blumenau, SC',
    location: { latitude: -26.9194, longitude: -49.0661 },
    modality: 'Remoto',
    isCanadianOpportunity: false,
    cultureTags: ['Tradição', 'Qualidade'],
    requiredSkills: ['Python', 'SQL'],
    createdAt: new Date()
  },
  {
    id: 'job-104',
    title: 'Full Stack Developer (Visa Sponsor)',
    description: 'Opportunity to move to Vancouver. We help with the visa process.',
    seniority: 'Senior',
    hardSkills: ['Node.js', 'React', 'AWS'],
    softSkills: ['Adaptability', 'English'],
    locationName: 'Vancouver, Canada',
    location: { latitude: 49.2827, longitude: -123.1207 },
    modality: 'Presencial',
    isCanadianOpportunity: true,
    cultureTags: ['Multicultural', 'Fast-paced'],
    requiredSkills: ['Node.js', 'English'],
    createdAt: new Date()
  }
];

// --- Map Component ---
const JobMap: React.FC<{ jobs: JobPosition[], userLocation: {lat: number, lng: number} | null, onSelectJob: (j: JobPosition) => void }> = ({ jobs, userLocation, onSelectJob }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    if (typeof (window as any).L === 'undefined') return;
    const L = (window as any).L;

    // Default to User Location or Floripa Center
    const initialLat = (userLocation && typeof userLocation.lat === 'number') ? userLocation.lat : -27.5949;
    const initialLng = (userLocation && typeof userLocation.lng === 'number') ? userLocation.lng : -48.5482;

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 12);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    if (userLocation && typeof userLocation.lat === 'number') {
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#3b82f6; width:16px; height:16px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup("Você está aqui");
    }

    leafletMapRef.current = map;
    return () => { if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!leafletMapRef.current) return;
    const L = (window as any).L;
    const map = leafletMapRef.current;

    // Clear existing markers (except user)
    map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker && layer.getPopup()?.getContent() !== "Você está aqui") {
            map.removeLayer(layer);
        }
    });

    jobs.forEach(job => {
        const isSelected = false; // Could add state for this
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${job.isCanadianOpportunity ? '#ef4444' : '#22c55e'}; color:white; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; border:1px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2); width: max-content; white-space:nowrap; cursor:pointer;">${job.distance ? job.distance.toFixed(1) + 'km' : 'Vaga'}</div>`,
            iconSize: [40, 20],
            iconAnchor: [20, 10]
        });
        const marker = L.marker([job.location.latitude, job.location.longitude], { title: job.title, icon }).addTo(map);
        marker.on('click', () => onSelectJob(job));
    });
  }, [jobs, userLocation]);

  return <div ref={mapRef} className="w-full h-full z-0 rounded-xl overflow-hidden shadow-inner" />;
};

// --- Job Detail View ---
const JobDetailView: React.FC<{ job: JobPosition; onClose: () => void }> = ({ job, onClose }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const handleApply = () => {
        setIsApplying(true);
        setTimeout(() => {
            setIsApplying(false);
            setHasApplied(true);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-full flex flex-col overflow-y-auto relative animate-in slide-in-from-right-4">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10">
                <X size={20} className="text-slate-600" />
            </button>
            
            <div className="bg-gradient-to-r from-brand-50 to-white p-8 border-b border-brand-100">
                <div className="flex items-start gap-4 mb-4">
                    <div className="h-16 w-16 bg-white rounded-xl shadow-sm border border-brand-100 flex items-center justify-center text-2xl font-bold text-brand-600">
                       <Building2 />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {job.isCanadianOpportunity ? 
                                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200"><Globe size={10} className="mr-1"/> Canada</Badge> : 
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Brasil</Badge>
                            }
                            <span className="text-xs text-slate-400 font-medium">#{job.id}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{job.title}</h2>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                            <MapPin size={14} />
                            <span>{job.locationName}</span>
                            {job.distance && <span className="text-brand-600 font-medium">• {job.distance.toFixed(1)} km de você</span>}
                        </div>
                    </div>
                </div>
                
                <p className="text-slate-600 text-lg leading-relaxed">{job.description}</p>
            </div>

            <div className="p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Modalidade</div>
                        <div className="font-semibold text-slate-900">{job.modality}</div>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Senioridade</div>
                        <div className="font-semibold text-slate-900">{job.seniority}</div>
                    </div>
                </div>

                {/* Hard Skills */}
                {job.hardSkills && job.hardSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Brain size={18} className="text-blue-500"/> Hard Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {job.hardSkills.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Soft Skills */}
                {job.softSkills && job.softSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles size={18} className="text-purple-500"/> Soft Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {job.softSkills.map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="px-3 py-1 text-sm border-purple-200 text-purple-700 bg-purple-50">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                 {/* Culture */}
                {job.cultureTags && job.cultureTags.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Heart size={18} className="text-red-500"/> Cultura & Valores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {job.cultureTags.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Apply Button */}
                <div className="flex justify-center pt-4">
                    {hasApplied ? (
                        <Button disabled size="lg" className="bg-green-600 text-white w-full h-14 text-lg shadow-none">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Candidatura Enviada!
                        </Button>
                    ) : (
                        <Button
                            onClick={handleApply}
                            disabled={isApplying}
                            size="lg"
                            className="w-full h-14 text-lg bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-200"
                        >
                            {isApplying ? "Enviando Candidatura..." : "Candidatar-se Agora"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const CandidateDashboard: React.FC<any> = ({ candidateData }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeTab, setActiveTab] = useState<'nearby' | 'canada'>('nearby');
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
    const [jobs, setJobs] = useState<JobPosition[]>(MOCK_JOBS_SC);

  // Use candidate coordinates from signup, or default to Florianópolis Center
  const userCoords = useMemo(() => {
    return candidateData?.coordinates || { latitude: -27.5949, longitude: -48.5482 };
  }, [candidateData]);

    // Load jobs from Supabase once and whenever user reloads. Fallback to mocks.
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data, error } = await getJobs();
                if (error) {
                    console.warn('Erro ao buscar vagas do Supabase:', error);
                    return;
                }
                if (!data) return;

                // Map DB rows to JobPosition shape
                const mapped: JobPosition[] = data.map((j: any) => ({
                    id: j.id || j.job_id || String(Math.random()),
                    title: j.title,
                    description: j.description,
                    seniority: j.seniority || 'Pleno',
                    hardSkills: j.hard_skills || [],
                    softSkills: j.soft_skills || [],
                    locationName: j.location_name || j.locationName || '',
                    location: { latitude: j.latitude || (j.location && j.location.latitude) || 0, longitude: j.longitude || (j.location && j.location.longitude) || 0 },
                    modality: j.modality || 'Presencial',
                    isCanadianOpportunity: !!j.isCanadianOpportunity,
                    cultureTags: j.culture_tags || [],
                    requiredSkills: j.required_skills || [],
                    createdAt: j.created_at ? new Date(j.created_at) : new Date()
                }));

                if (mounted && mapped.length > 0) setJobs(mapped);
            } catch (err) {
                console.error('Erro ao carregar vagas:', err);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Process Jobs: Calculate Distance
    const processedJobs = useMemo(() => {
        return jobs.map(job => {
            const lat = job.location?.latitude ?? 0;
            const lng = job.location?.longitude ?? 0;
            const dist = getDistanceFromLatLonInKm(
                userCoords.latitude, userCoords.longitude,
                lat, lng
            );
            return { ...job, distance: dist };
        });
    }, [userCoords, jobs]);

  // Filter Jobs based on Tab
  const filteredJobs = useMemo(() => {
    if (activeTab === 'canada') {
      return processedJobs.filter(j => j.isCanadianOpportunity);
    }
    // Nearby: Sort by distance (closest first)
    return processedJobs
      .filter(j => !j.isCanadianOpportunity)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [activeTab, processedJobs]);

  // Auto-select first nearby job for better UX
  useEffect(() => {
    if (activeTab === 'nearby' && filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [activeTab, filteredJobs, selectedJob]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 z-10">
        <div className="mb-6 px-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explorar Vagas</h2>
            <div className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('nearby'); setViewMode('list'); setSelectedJob(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'nearby' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <MapPin size={18} /> Próximo a Mim
                </button>
                <button 
                  onClick={() => { setActiveTab('canada'); setViewMode('list'); setSelectedJob(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'canada' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <Globe size={18} /> Vagas Canadá
                </button>
            </div>
        </div>
        
        {/* User Stats Tiny Widget */}
        <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                    {candidateData?.name?.charAt(0) || 'U'}
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{candidateData?.name || 'Usuário'}</div>
                    <div className="text-xs text-slate-500">{candidateData?.address?.city || 'Florianópolis'}</div>
                </div>
            </div>
            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 w-[70%]"></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span>Perfil 70% completo</span>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden relative">
         {/* Top Bar inside content */}
         <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
             <div>
               <h1 className="text-xl font-bold text-slate-800">
                  {activeTab === 'nearby' ? 'Vagas em Santa Catarina' : 'Oportunidades Internacionais'}
               </h1>
               {activeTab === 'nearby' && candidateData?.address?.city && (
                 <p className="text-xs text-slate-500">
                   📍 Baseado em {candidateData.address.city}, {candidateData.address.state}
                 </p>
               )}
             </div>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <MapIcon size={18} />
                </button>
             </div>
         </div>

         {/* Content View */}
         <div className="flex-1 relative overflow-hidden flex">
            
            {/* List/Map Container */}
            <div className={`flex-1 overflow-y-auto transition-all duration-300 ${selectedJob ? 'w-1/2 hidden md:block' : 'w-full'}`}>
                {viewMode === 'list' ? (
                    <div className="p-6 space-y-4 max-w-3xl mx-auto">
                        {filteredJobs.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <Search className="mx-auto h-12 w-12 mb-2 opacity-50"/>
                                <p>Nenhuma vaga encontrada nesta categoria.</p>
                            </div>
                        )}
                        {filteredJobs.map((job, idx) => {
                          // Highlight badges based on distance
                          const isVeryClose = job.distance && job.distance < 15;
                          const isCloseby = job.distance && job.distance < 50;
                          
                          return (
                            <div 
                                key={job.id} 
                                onClick={() => setSelectedJob(job)}
                                className={`relative bg-white p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md group ${
                                  selectedJob?.id === job.id 
                                    ? 'border-brand-500 ring-1 ring-brand-500 shadow-md' 
                                    : 'border-slate-200 hover:border-brand-200'
                                } ${
                                  isVeryClose ? 'border-l-4 border-l-green-500' : ''
                                }`}
                            >
                                {isVeryClose && (
                                  <div className="absolute top-3 right-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                                      🔥 Muito Próximo!
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-start mb-2 pr-24">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                            <Building2 size={14} /> <span>Empresa Confidencial</span>
                                        </div>
                                    </div>
                                    {job.isCanadianOpportunity && <Badge className="bg-red-50 text-red-600 border-red-100">Canada</Badge>}
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                                    <div className="flex items-center gap-1">
                                        <Briefcase size={12} /> {job.modality}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} /> {job.locationName}
                                    </div>
                                    {job.distance && (
                                        <div className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-full ${
                                          isVeryClose 
                                            ? 'bg-green-100 text-green-700' 
                                            : isCloseby 
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'text-slate-400'
                                        }`}>
                                            <MapPin size={10} /> {job.distance.toFixed(2)} km
                                        </div>
                                    )}
                                </div>
                            </div>
                          );
                        })}
                    </div>
                ) : (
                    <div className="w-full h-full">
                        <JobMap 
                            jobs={filteredJobs} 
                            userLocation={{lat: userCoords.latitude, lng: userCoords.longitude}}
                            onSelectJob={(j) => setSelectedJob(j)}
                        />
                    </div>
                )}
            </div>

            {/* Detail Panel Overlay (Mobile) or Side Panel (Desktop) */}
            {selectedJob && (
                <div className="absolute inset-0 md:static md:w-[500px] md:border-l md:border-slate-200 bg-white z-20 md:z-auto">
                    <JobDetailView job={selectedJob} onClose={() => setSelectedJob(null)} />
                </div>
            )}
         </div>
      </main>
    </div>
  );
};
