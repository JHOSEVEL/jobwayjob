
import React, { useState, useEffect } from 'react';
import { ViewState, UserType, CandidateProfile, CompanyProfile } from './types';
import { Header, Footer } from './components/Layout';
import { Button } from './components/UIComponents';
import { 
  Users, Zap, CheckCircle2, Sparkles, Brain, Target, 
  TrendingUp, BarChart3, Upload, Gauge, Calendar, Bell, 
  Clock, DollarSign, ArrowRight, Heart, Globe 
} from 'lucide-react';
import { supabase, getCurrentUserProfile } from './services/supabaseClient';

// Import Pages
import { Login } from './pages/Login';
import { CandidateSignup } from './pages/CandidateSignup';
import { CompanySignup } from './pages/CompanySignup';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';

// --- Helper Components for Landing ---

const FeatureCard = ({ icon: Icon, title, description, iconBg }: any) => {
  let bgClass = "bg-slate-100 text-brand-600";
  if (iconBg === "gradient-primary") bgClass = "bg-gradient-to-br from-brand-500 to-brand-600 text-white";
  else if (iconBg === "gradient-secondary") bgClass = "bg-gradient-to-br from-blue-500 to-blue-600 text-white";
  else if (iconBg === "bg-primary") bgClass = "bg-brand-100 text-brand-600";
  else if (iconBg === "bg-secondary") bgClass = "bg-blue-100 text-blue-600";
  else if (iconBg === "bg-tertiary") bgClass = "bg-purple-100 text-purple-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${bgClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

// --- Views ---

const LandingView = ({ setView }: { setView: (view: ViewState) => void }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-50/30 to-blue-50/30 py-20 md:py-32">
        <div className="container  max-w-[80%] mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" />
              Plataforma de Recrutamento com IA
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl text-slate-900">
              Conectamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Talentos</span> às{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Oportunidades Certas</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-500 md:text-xl">
              A plataforma de recrutamento que usa IA para fazer matches perfeitos entre profissionais e empresas,
              baseado em cultura, habilidades e compatibilidade.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => setView(ViewState.CANDIDATE_SIGNUP)} className="text-base h-12 px-8">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView(ViewState.ABOUT)} className="text-base h-12 px-8">
                Assistir Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className=" border-y border-slate-200 bg-slate-50/50 py-12">
        <div className="container  max-w-[80%] mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-brand-600">85%</div>
              <div className="text-sm text-slate-500">Taxa de Match Assertivo</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">3x</div>
              <div className="text-sm text-slate-500">Mais Rápido que Processos Tradicionais</div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-slate-500">Transparência no Processo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container  max-w-[80%] mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl text-slate-900">
              Tecnologia que <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Revoluciona</span> o Recrutamento
            </h2>
            <p className="text-lg text-slate-500">
              Utilizamos inteligência artificial avançada para encontrar os matches perfeitos
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="IA de Matching"
              description="Algoritmo inteligente que analisa cultura, habilidades e compatibilidade para encontrar o match perfeito."
              iconBg="gradient-primary"
            />
            <FeatureCard
              icon={Target}
              title="Termômetro de Compatibilidade"
              description="Veja em tempo real o quanto você se encaixa em cada vaga, com explicação detalhada de cada critério."
              iconBg="gradient-secondary"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Gestão Visual de Processos"
              description="Acompanhe todas as suas candidaturas em um painel intuitivo, do envio até a contratação."
              iconBg="bg-primary"
            />
            <FeatureCard
              icon={Users}
              title="Comunicação Integrada"
              description="Chat com recrutadores e notificações proativas sobre cada etapa do processo."
              iconBg="bg-secondary"
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Sourcing Automático"
              description="Para empresas: receba automaticamente os melhores candidatos assim que publicar uma vaga."
              iconBg="gradient-primary"
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics Completo"
              description="Dashboard com métricas e insights para otimizar seu processo de recrutamento."
              iconBg="bg-tertiary"
            />
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-20 md:py-32">
        <div className="container  max-w-[80%] mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-14 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-5xl text-slate-900">
                Seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Agente de Carreira</span> Pessoal
              </h2>
              <p className="mb-8 text-lg text-slate-500">
                Deixe a tecnologia trabalhar por você. A JOBWAY encontra as melhores oportunidades com base no seu
                perfil e cultura, automaticamente.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Upload, title: "Upload de Currículo Inteligente", desc: "Nossa IA extrai e organiza automaticamente todas as suas informações.", bg: "bg-gradient-to-br from-brand-500 to-brand-600 text-white" },
                  { icon: Gauge, title: "Termômetro de Compatibilidade", desc: "Veja em tempo real o quanto você combina com cada vaga.", bg: "bg-blue-100 text-blue-600" },
                  { icon: Calendar, title: "Evolução de Processos", desc: "Acompanhe todas as suas candidaturas de forma visual.", bg: "bg-purple-100 text-purple-600" },
                  { icon: Bell, title: "Notificações Proativas", desc: "Receba alertas em tempo real sobre cada avanço.", bg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button onClick={() => setView(ViewState.CANDIDATE_SIGNUP)} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12 px-8">
                  Começar como Profissional
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
               <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="mb-6 flex items-center gap-4">
                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-400" />
                     <div className="space-y-2">
                        <div className="h-3 w-32 rounded bg-slate-100" />
                        <div className="h-3 w-24 rounded bg-slate-100" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-slate-50">
                        <span className="text-sm font-medium text-slate-600">Match Score</span>
                        <span className="text-2xl font-bold text-blue-600">94%</span>
                     </div>
                     <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-slate-50">
                        <span className="text-sm font-medium text-slate-600">Processos</span>
                        <span className="text-2xl font-bold text-brand-600">5</span>
                     </div>
                     <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-slate-50">
                        <span className="text-sm font-medium text-slate-600">Força do Perfil</span>
                        <span className="text-2xl font-bold text-orange-500">Alta</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container  max-w-[80%] mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* Stats Card (Left on Desktop) */}
            <div className="order-2 lg:order-1 relative hidden lg:block">
               <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="mb-6">
                    <div className="mb-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
                      5 Matches
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-all hover:border-brand-200 bg-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400" />
                          <div className="space-y-1">
                             <div className="h-2.5 w-24 rounded bg-slate-200" />
                             <div className="h-2 w-16 rounded bg-slate-200" />
                          </div>
                       </div>
                       <span className="text-sm font-bold text-blue-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-all hover:border-brand-200 bg-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-400" />
                          <div className="space-y-1">
                             <div className="h-2.5 w-24 rounded bg-slate-200" />
                             <div className="h-2 w-16 rounded bg-slate-200" />
                          </div>
                       </div>
                       <span className="text-sm font-bold text-brand-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-all hover:border-brand-200 bg-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400" />
                          <div className="space-y-1">
                             <div className="h-2.5 w-24 rounded bg-slate-200" />
                             <div className="h-2 w-16 rounded bg-slate-200" />
                          </div>
                       </div>
                       <span className="text-sm font-bold text-orange-500">89%</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                     <div className="rounded-lg bg-slate-50 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-600">7 dias</div>
                        <div className="text-xs text-slate-500">Tempo Médio</div>
                     </div>
                     <div className="rounded-lg bg-slate-50 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">R$ 2.4k</div>
                        <div className="text-xs text-slate-500">Custo por Hire</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-3xl font-bold md:text-5xl text-slate-900">
                Contrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Mais Rápido</span> e com{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Assertividade</span>
              </h2>
              <p className="mb-8 text-lg text-slate-500">
                Esqueça processos demorados e caros. Nossa IA encontra, ranqueia e entrega os candidatos perfeitos para
                você.
              </p>

              <div className="space-y-6">
                {[
                    { icon: Sparkles, title: "Sourcing Automático com IA", desc: "Receba os melhores candidatos ranqueados automaticamente assim que publicar uma vaga.", bg: "bg-gradient-to-br from-brand-500 to-brand-600 text-white" },
                    { icon: Users, title: "ATS Completo Integrado", desc: "Gerencie todo o processo seletivo em um só lugar, do match à contratação.", bg: "bg-blue-100 text-blue-600" },
                    { icon: Clock, title: "Reduza o Time-to-Hire em 70%", desc: "Contrate mais rápido com candidatos pré-qualificados e filtrados pela IA.", bg: "bg-purple-100 text-purple-600" },
                    { icon: DollarSign, title: "Custo Muito Menor", desc: "Economize em consultorias de RH e ferramentas caras de recrutamento.", bg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white" },
                ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="mb-1 font-semibold text-slate-900">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    </div>
                ))}
              </div>

              <Button size="lg" onClick={() => setView(ViewState.COMPANY_SIGNUP)} className="mt-8 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 h-12 px-8">
                  Começar como Empresa
                  <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-600 via-brand-500 to-blue-600 py-20 text-white">
        <div className="container  max-w-[80%] mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Pronto para Revolucionar seu Recrutamento?</h2>
            <p className="mb-8 text-lg text-white/95">
              Junte-se a milhares de profissionais e empresas que já encontraram seus matches perfeitos
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="outerHeight"
                onClick={() => setView(ViewState.CANDIDATE_SIGNUP)}
                className="bg-white text-base h-12 px-8 border-white text-green-600 hover:bg-white/30"
              >
                  Cadastre-se Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView(ViewState.ABOUT)}
                className="text-base h-12 px-8 border-white text-white hover:bg-white/20"
              >
                Assistir Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AboutView: React.FC = () => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <section className="bg-gradient-to-br from-brand-50 via-white to-blue-50 py-20 md:py-32">
      <div className="container  max-w-[80%] mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl text-slate-900">
            Sobre a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">JOBWAY</span>
          </h1>
          <p className="text-lg text-slate-500 md:text-xl">
            Nossa missão é revolucionar a forma como pessoas e empresas se conectam, 
            criando matches perfeitos baseados em cultura, habilidades e compatibilidade.
          </p>
        </div>
      </div>
    </section>

    {/* Mission Section */}
    <section className="py-20 md:py-32 bg-white">
      <div className="container  max-w-[80%] mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold md:text-5xl text-slate-900">
              Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Missão</span>
            </h2>
            <p className="mb-4 text-lg text-slate-500">
              A JOBWAY nasceu da necessidade de tornar o processo de recrutamento mais humano, 
              eficiente e justo para todos os envolvidos.
            </p>
            <p className="mb-4 text-lg text-slate-500">
              Acreditamos que encontrar o emprego certo não deveria ser uma questão de sorte, 
              mas sim de compatibilidade real entre profissionais e empresas.
            </p>
            <p className="text-lg text-slate-500">
              Utilizando inteligência artificial de ponta, analisamos não apenas habilidades técnicas, 
              mas também fit cultural, valores compartilhados e proximidade geográfica para criar 
              conexões que realmente fazem sentido.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: "Precisão", desc: "Matches assertivos baseados em dados.", bg: "bg-gradient-to-br from-brand-500 to-brand-600 text-white" },
              { icon: Heart, title: "Humanização", desc: "Tecnologia a serviço de conexões humanas.", bg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white" },
              { icon: Zap, title: "Agilidade", desc: "Processos 3x mais rápidos.", bg: "bg-blue-100 text-blue-600" },
              { icon: Globe, title: "Impacto", desc: "Transformando carreiras no Brasil.", bg: "bg-purple-100 text-purple-600" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section className="bg-slate-50/50 py-20 md:py-32">
      <div className="container  max-w-[80%] mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl text-slate-900">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Valores</span>
          </h2>
          <p className="text-lg text-slate-500">
            Princípios que guiam tudo o que fazemos
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
           {[
             { title: "Transparência Total", desc: "Decisões explicáveis. Você sempre saberá por que recebeu um match." },
             { title: "Diversidade & Inclusão", desc: "Tecnologia projetada para eliminar vieses inconscientes." },
             { title: "Inovação Contínua", desc: "Sempre evoluindo nossa IA para oferecer a melhor experiência." },
             { title: "Foco no Resultado", desc: "Nosso sucesso é medido pelo sucesso das conexões que criamos." },
             { title: "Privacidade & Segurança", desc: "Seus dados são sagrados e protegidos com as melhores práticas." },
             { title: "Suporte Humanizado", desc: "Nosso time está sempre pronto para ajudar com um toque humano." },
           ].map((val, i) => (
             <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8 hover:border-brand-200 transition-colors">
               <h3 className="mb-3 text-xl font-bold text-slate-900">{val.title}</h3>
               <p className="text-slate-500">{val.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>

    {/* Impact Section */}
    <section className="py-20 md:py-32 bg-white">
      <div className="container  max-w-[80%] mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl text-slate-900">
            Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Impacto</span>
          </h2>
          <p className="mb-12 text-lg text-slate-500">
            Números que refletem nosso compromisso com a excelência
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-brand-600">95%</div>
              <div className="text-sm text-slate-500">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-blue-600">70%</div>
              <div className="text-sm text-slate-500">Redução Time-to-Hire</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-purple-600">3x</div>
              <div className="text-sm text-slate-500">Mais Rápido</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>(UserType.CANDIDATE);
  const [isLoading, setIsLoading] = useState(true);

  // Global State (Lifted up from pages for persistence)
  const [candidateData, setCandidateData] = useState<CandidateProfile>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: { cep: '', city: '', state: '', neighborhood: '' },
    linkedInUrl: '',
    areaOfInterest: '',
    skills: []
  });

  const [companyData, setCompanyData] = useState<CompanyProfile>({
    name: '',
    cnpj: '',
    email: '',
    phone: ''
  });

  // Check Supabase Session on Mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        // Fetch User Profile to determine type (Candidate/Company)
        const profile = await getCurrentUserProfile();
        if (profile) {
            setUserType(profile.user_type as UserType);
            if (profile.user_type === 'CANDIDATE') {
                setCandidateData(prev => ({ ...prev, ...profile }));
                setCurrentView(ViewState.CANDIDATE_DASHBOARD);
            } else {
                setCompanyData(prev => ({ ...prev, ...profile }));
                setCurrentView(ViewState.COMPANY_DASHBOARD);
            }
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        const profile = await getCurrentUserProfile();
        if (profile) {
             setUserType(profile.user_type as UserType);
             // Stay on current view if already set (prevent redirect loops)
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentView(ViewState.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentView(ViewState.LANDING);
  };

  const renderView = () => {
    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-brand-600 text-4xl">⚡</div></div>;

    switch (currentView) {
      case ViewState.LOGIN:
        return <Login setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />;
      case ViewState.CANDIDATE_SIGNUP:
        return <CandidateSignup candidateData={candidateData} setCandidateData={setCandidateData} setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />;
      case ViewState.COMPANY_SIGNUP:
        return <CompanySignup companyData={companyData} setCompanyData={setCompanyData} setCurrentView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />;
      case ViewState.CANDIDATE_DASHBOARD:
        return <CandidateDashboard candidateData={candidateData} />;
      case ViewState.COMPANY_DASHBOARD:
        return <CompanyDashboard companyData={companyData} />;
      case ViewState.ABOUT:
        return <AboutView />;
      case ViewState.LANDING:
      default:
        return <LandingView setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-slate-900">
      <Header
        currentView={currentView}
        setView={setCurrentView}
        isLoggedIn={isLoggedIn}
        userType={userType}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
