
import React, { useState } from 'react';
import { ViewState, UserType } from '../types';
import { Button, InputField } from '../components/UIComponents';
import { Upload, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseResume } from '../services/geminiService';
import { processLocationFromCep } from '../services/locationService';
import { createProfile } from '../services/backend';

export const CandidateSignup: React.FC<any> = ({ candidateData, setCandidateData, setCurrentView, setIsLoggedIn, setUserType }) => {
  const [step, setStep] = useState(1);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepSuccess, setCepSuccess] = useState('');

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCepError('');
    setCepSuccess('');
    
    setCandidateData({...candidateData, address: {...candidateData.address, cep: val}});
    
    // Only process when CEP has 8 digits
    if (val.replace(/\D/g, '').length === 8) {
      try {
        const result = await processLocationFromCep(val);
        
        if (result) {
          setCandidateData((prev: any) => ({
            ...prev, 
            address: {
              ...prev.address,
              cep: val,
              city: result.city,
              state: result.state,
              neighborhood: ''
            },
            coordinates: result.coordinates
          }));
          setCepSuccess(`📍 ${result.city}, ${result.state} localizado com sucesso!`);
        } else {
          setCepError('⚠️ CEP não encontrado em Santa Catarina. Verifique o CEP informado.');
          setCandidateData((prev: any) => ({
            ...prev,
            address: {
              ...prev.address,
              cep: val,
              city: '',
              state: '',
              neighborhood: ''
            },
            coordinates: undefined
          }));
        }
      } catch (e) {
        setCepError('Erro ao buscar localização. Tente novamente.');
        console.error('Erro ao processar CEP:', e);
      }
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsLoadingAI(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
          try {
              const base64Data = (reader.result as string).split(',')[1];
              const parsed = await parseResume(base64Data, file.type);
              if (parsed) setCandidateData((prev: any) => ({...prev, ...parsed}));
          } catch(e) { alert("Erro ao ler currículo."); } 
          finally { setIsLoadingAI(false); }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setCurrentView(ViewState.LANDING)} className="text-slate-400 hover:text-slate-600"><ArrowLeft /></button>
            <h2 className="text-2xl font-bold text-slate-900">Cadastro Profissional</h2>
        </div>
        
        {step === 1 && (
          <div className="space-y-4">
            <InputField label="Nome Completo" value={candidateData.name} onChange={(e:any)=>setCandidateData({...candidateData, name:e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Email" type="email" value={candidateData.email} onChange={(e:any)=>setCandidateData({...candidateData, email:e.target.value})} />
                <InputField label="Celular / WhatsApp" placeholder="(00) 00000-0000" value={candidateData.phone} onChange={(e:any)=>setCandidateData({...candidateData, phone:e.target.value})} />
            </div>
            
            <hr className="my-4 border-slate-100"/>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Endereço</h3>
            
            <InputField label="CEP" value={candidateData.address.cep} onChange={handleCepChange} placeholder="00000-000" />
            {cepError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{cepError}</span>
              </div>
            )}
            {cepSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{cepSuccess}</span>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1"><InputField label="Cidade" value={candidateData.address.city} disabled /></div>
              <div className="col-span-1"><InputField label="Estado" value={candidateData.address.state} disabled /></div>
              <div className="col-span-1"><InputField label="Bairro" value={candidateData.address.neighborhood} onChange={(e:any)=>setCandidateData({...candidateData, address: {...candidateData.address, neighborhood: e.target.value}})} /></div>
            </div>
             
             <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Área de Interesse</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white" value={candidateData.areaOfInterest} onChange={(e)=>setCandidateData({...candidateData, areaOfInterest:e.target.value})}>
                  <option value="">Selecione...</option>
                  <option>Tecnologia</option>
                  <option>Alimentação</option>
                  <option>Turismo e Hotelaria</option>
                  <option>Varejo</option>
                  <option>Construção</option>
                  <option>Serviços</option>
              </select>
            </div>
            <div className="flex justify-end pt-4"><Button onClick={()=>setStep(2)}>Próximo</Button></div>
          </div>
        )}
        {step === 2 && (
           <div className="space-y-6 text-center">
             <div className="text-left mb-4">
                <h3 className="font-bold text-lg">Upload Inteligente</h3>
                <p className="text-slate-500 text-sm">Nossa IA irá preencher seu perfil automaticamente.</p>
             </div>
             <div className="border-2 border-dashed border-brand-200 bg-brand-50 p-10 rounded-xl relative hover:bg-brand-100 transition-colors">
                <input type="file" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <div className="flex flex-col items-center">
                    <div className="bg-brand-100 p-4 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-brand-500"/>
                    </div>
                    <p className="font-medium text-slate-900">Clique para fazer upload do currículo (PDF)</p>
                    {isLoadingAI && <div className="flex items-center gap-2 mt-4 text-brand-600"><span className="animate-spin">⏳</span> Analisando seu perfil com IA...</div>}
                </div>
             </div>
             
             {candidateData.skills.length > 0 && (
                 <div className="text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm font-bold text-slate-700 mb-2">Skills Identificadas:</p>
                    <div className="flex flex-wrap gap-2">
                        {candidateData.skills.map((s: string) => <span key={s} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-600">{s}</span>)}
                    </div>
                 </div>
             )}
             
             <div className="flex justify-between pt-6">
                <Button variant="secondary" onClick={()=>setStep(1)}>Voltar</Button>
                <Button onClick={async () => {
                    try {
                      // save to neutral backend stub (no external DB)
                      await createProfile({
                        name: candidateData.name,
                        email: candidateData.email,
                        phone: candidateData.phone,
                        user_type: 'CANDIDATE',
                        address: candidateData.address,
                        coordinates: candidateData.coordinates
                      });
                    } catch(e) {
                      console.error('Erro ao salvar perfil:', e);
                    } finally {
                      setIsLoggedIn(true); setUserType(UserType.CANDIDATE); setCurrentView(ViewState.CANDIDATE_DASHBOARD);
                    }
                }}>Finalizar Cadastro</Button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};
