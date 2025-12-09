import React from 'react';
import { ViewState } from '../types';
import { Menu, X, User, Briefcase, ChevronRight, LogIn } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn: boolean;
  userType?: 'CANDIDATE' | 'COMPANY';
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, isLoggedIn, userType, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLink = ({ view, label }: { view: ViewState; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`text-sm font-medium transition-colors hover:text-brand-600 ${
        currentView === view ? 'text-brand-600 font-bold' : 'text-slate-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="container max-w-[80%] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView(isLoggedIn ? (userType === 'COMPANY' ? ViewState.COMPANY_DASHBOARD : ViewState.CANDIDATE_DASHBOARD) : ViewState.LANDING)}
        >
           <div className="bg-brand-500 text-white font-bold text-xl px-3 py-1 rounded-lg tracking-tight">
             JOBWAY
           </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {!isLoggedIn && (
            <>
              <NavLink view={ViewState.LANDING} label="Início" />
              <NavLink view={ViewState.ABOUT} label="Sobre Nós" />
            </>
          )}
          
          {isLoggedIn ? (
             <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">Olá, {userType === 'COMPANY' ? 'Recrutador' : 'Candidato'}</span>
                <button 
                  onClick={onLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Sair
                </button>
             </div>
          ) : (
            <div className="flex items-center gap-4">
               
              <div className="h-4 w-px bg-slate-300"></div>
              <button 
                onClick={() => setView(ViewState.CANDIDATE_SIGNUP)}
                className="text-sm font-medium text-slate-600 hover:text-brand-600"
              >
                Sou Profissional
              </button>
              <button 
                onClick={() => setView(ViewState.COMPANY_SIGNUP)}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm shadow-brand-200"
              >
                Sou Empresa
              </button>

              <button 
                onClick={() => setView(ViewState.LOGIN)}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-4 shadow-lg">
           {!isLoggedIn && (
            <>
              <NavLink view={ViewState.LANDING} label="Início" />
              <NavLink view={ViewState.ABOUT} label="Sobre Nós" />
              <hr className="border-slate-100" />
              <button onClick={() => { setView(ViewState.LOGIN); setIsMobileMenuOpen(false); }} className="text-left text-slate-600 font-medium">Entrar</button>
              <button onClick={() => { setView(ViewState.CANDIDATE_SIGNUP); setIsMobileMenuOpen(false); }} className="text-left text-brand-600 font-medium">Sou Profissional</button>
              <button onClick={() => { setView(ViewState.COMPANY_SIGNUP); setIsMobileMenuOpen(false); }} className="text-left text-slate-600 font-medium">Sou Empresa</button>
            </>
          )}
          {isLoggedIn && (
             <button onClick={onLogout} className="text-left text-red-500 font-medium">Sair</button>
          )}
        </div>
      )}
    </header>
  );
};

export const Footer = () => (
  <footer className=" bg-slate-900 text-slate-400 py-12 mt-auto">
    <div className="container max-w-[80%] mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-white font-bold text-xl mb-4">JOBWAY</div>
          <p className="text-sm">Revolucionando o recrutamento no Brasil com Inteligência Artificial e Geolocalização.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Plataforma</h4>
          <ul className="space-y-3 text-sm">
            <li>Para Candidatos</li>
            <li>Para Empresas</li>
            <li>Vagas no Canadá</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Sobre</h4>
          <ul className="space-y-3 text-sm">
            <li>Nossa História</li>
            <li>Termos de Uso</li>
            <li>Privacidade</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contato</h4>
          <p className="text-sm">contato@jobway.com.br</p>
          <p className="text-sm">São Paulo, SP</p>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs">
        © 2024 JOBWAY. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);
