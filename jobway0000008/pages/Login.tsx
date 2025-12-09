
import React, { useState } from 'react';
import { ViewState, UserType } from '../types';
import { Button, InputField } from '../components/UIComponents';
import { LogIn, User, Building, AlertCircle } from 'lucide-react';
import { supabase, getCurrentUserProfile } from '../services/supabaseClient';

interface LoginProps {
  setCurrentView: (view: ViewState) => void;
  setIsLoggedIn: (value: boolean) => void;
  setUserType: (type: UserType) => void;
}

export const Login: React.FC<LoginProps> = ({ setCurrentView, setIsLoggedIn, setUserType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Login successful, fetch profile to know UserType
      const profile = await getCurrentUserProfile();
      
      if (profile) {
        setIsLoggedIn(true);
        setUserType(profile.user_type as UserType);
        setCurrentView(profile.user_type === 'COMPANY' ? ViewState.COMPANY_DASHBOARD : ViewState.CANDIDATE_DASHBOARD);
      } else {
        setErrorMsg('Perfil não encontrado. Contate o suporte.');
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao entrar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
          <p className="text-slate-500">Acesse sua conta para continuar</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <InputField 
            label="E-mail" 
            type="email" 
            placeholder="seu@email.com" 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
          />
          <InputField 
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
          />
          
          <Button onClick={handleLogin} isLoading={isLoading} className="w-full">
            Entrar
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Não tem uma conta?{' '}
          <button 
            onClick={() => setCurrentView(ViewState.CANDIDATE_SIGNUP)}
            className="text-brand-600 font-medium hover:underline"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
};
