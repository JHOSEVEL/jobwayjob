
import React, { useState } from 'react';
import { ViewState, UserType } from '../types';
import { Button, InputField } from '../components/UIComponents';
import { ArrowLeft, Building2 } from 'lucide-react';

export const CompanySignup: React.FC<any> = ({ companyData, setCompanyData, setCurrentView, setIsLoggedIn, setUserType }) => {
  const [step, setStep] = useState(1);

  const handleFinish = () => {
    // Here you would implement real validation and API call
    setIsLoggedIn(true);
    setUserType(UserType.COMPANY);
    setCurrentView(ViewState.COMPANY_DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setCurrentView(ViewState.LANDING)} className="text-slate-400 hover:text-slate-600"><ArrowLeft /></button>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-brand-500" />
                Cadastre sua Empresa
            </h2>
        </div>

        <div className="space-y-4">
            <InputField 
                label="Razão Social" 
                placeholder="Ex: Tech Solutions LTDA" 
                value={companyData.name} 
                onChange={(e: any) => setCompanyData({...companyData, name: e.target.value})} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                    label="CNPJ" 
                    placeholder="00.000.000/0000-00" 
                    value={companyData.cnpj} 
                    onChange={(e: any) => setCompanyData({...companyData, cnpj: e.target.value})} 
                />
                <InputField 
                    label="Telefone / WhatsApp" 
                    placeholder="(00) 0000-0000" 
                    value={companyData.phone} 
                    onChange={(e: any) => setCompanyData({...companyData, phone: e.target.value})} 
                />
            </div>

            <InputField 
                label="E-mail Corporativo" 
                type="email" 
                placeholder="rh@suaempresa.com.br" 
                value={companyData.email} 
                onChange={(e: any) => setCompanyData({...companyData, email: e.target.value})} 
            />

            <InputField 
                label="Senha de Acesso" 
                type="password" 
                placeholder="••••••••" 
            />

            <div className="pt-6">
                <Button onClick={handleFinish} className="w-full h-12 text-lg">
                    Cadastrar Empresa
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4">
                    Ao cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
