# 🔐 Guia Completo: Conectar com Supabase

## 📋 Status Atual

✅ **Supabase já está configurado no projeto!**

- **URL**: `https://xrqidloohnexqisxzoxa.supabase.co`
- **Chave Anônima**: Configurada em `services/supabaseClient.ts`
- **Cliente**: Inicializado e pronto para usar

---

## 🚀 Como Usar o Supabase no Projeto

### 1️⃣ **Autenticação de Usuários**

#### Registrar Novo Usuário
```typescript
import { supabase } from '@/services/supabaseClient';

const handleSignup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Erro ao registrar:', error);
    return false;
  }
  
  return true;
};
```

#### Login
```typescript
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Erro ao fazer login:', error);
    return false;
  }
  
  return true;
};
```

#### Logout
```typescript
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Erro ao logout:', error);
};
```

#### Obter Usuário Atual
```typescript
const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
```

---

### 2️⃣ **Gerenciar Perfis de Usuário**

#### Criar Perfil
```typescript
const createProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        ...profileData,
        created_at: new Date(),
      },
    ]);
  
  return { data, error };
};
```

#### Atualizar Perfil
```typescript
const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};
```

#### Obter Perfil do Usuário Logado
```typescript
import { getCurrentUserProfile } from '@/services/supabaseClient';

const profile = await getCurrentUserProfile();
```

---

### 3️⃣ **Gerenciar Vagas (Jobs)**

#### Criar Vaga
```typescript
const createJob = async (jobData: any) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData]);
  
  return { data, error };
};
```

#### Listar Vagas
```typescript
const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};
```

#### Atualizar Vaga
```typescript
const updateJob = async (jobId: string, updates: any) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId);
  
  return { data, error };
};
```

#### Deletar Vaga
```typescript
const deleteJob = async (jobId: string) => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);
  
  return { error };
};
```

---

### 4️⃣ **Gerenciar Candidatos**

#### Criar/Atualizar Candidato
```typescript
const upsertCandidate = async (candidateData: any) => {
  const { data, error } = await supabase
    .from('candidates')
    .upsert([candidateData]);
  
  return { data, error };
};
```

#### Listar Candidatos por Vaga
```typescript
const getCandidatesByJob = async (jobId: string) => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('job_id', jobId);
  
  return { data, error };
};
```

---

### 5️⃣ **Real-time Listeners (Em Tempo Real)**

#### Escutar Mudanças em Vagas
```typescript
const subscribeToJobs = (callback: any) => {
  return supabase
    .from('jobs')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();
};
```

#### Escutar Mudanças em Candidatos
```typescript
const subscribeToMatches = (jobId: string, callback: any) => {
  return supabase
    .from('matches')
    .on('INSERT', (payload) => {
      if (payload.new.job_id === jobId) {
        callback(payload.new);
      }
    })
    .subscribe();
};
```

---

## 🗄️ **Estrutura das Tabelas Recomendadas**

### Tabela: `profiles`
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  user_type VARCHAR(20), -- 'CANDIDATE' ou 'COMPANY'
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: `jobs`
```sql
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES profiles(id),
  title VARCHAR(255),
  description TEXT,
  seniority VARCHAR(50),
  hard_skills TEXT[],
  soft_skills TEXT[],
  location_name VARCHAR(255),
  latitude DECIMAL,
  longitude DECIMAL,
  modality VARCHAR(50),
  culture_tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: `candidates`
```sql
CREATE TABLE candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  name VARCHAR(255),
  role VARCHAR(255),
  location_name VARCHAR(255),
  latitude DECIMAL,
  longitude DECIMAL,
  experience_years INTEGER,
  skills TEXT[],
  soft_skills TEXT[],
  culture_tags TEXT[],
  bio TEXT,
  resume_text TEXT,
  visa_status VARCHAR(50),
  english_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: `matches`
```sql
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id),
  candidate_id uuid REFERENCES candidates(id),
  overall_score INTEGER,
  technical_fit INTEGER,
  cultural_fit INTEGER,
  soft_skills_match INTEGER,
  location_score INTEGER,
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 **Configuração do Supabase Dashboard**

### Passo 1: Acessar o Dashboard
1. Vá para [supabase.com](https://supabase.com)
2. Faça login com sua conta
3. Selecione o projeto `xrqidloohnexqisxzoxa`

### Passo 2: Criar Tabelas
1. Vá para **SQL Editor**
2. Execute os scripts SQL acima
3. Ou use a interface de **Table Editor**

### Passo 3: Configurar RLS (Row Level Security)
1. Vá para **Authentication** → **Policies**
2. Configure permissões por tabela:

```sql
-- Profiles: Usuários veem apenas seu próprio perfil
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Jobs: Qualquer um pode ver, apenas company pode criar
CREATE POLICY "Jobs are viewable by everyone" 
ON jobs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create jobs" 
ON jobs 
FOR INSERT 
WITH CHECK (auth.uid() = company_id);
```

### Passo 4: Configurar CORS
1. Vá para **Project Settings** → **API**
2. Em **CORS Configuration**, adicione:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - Seu domínio de produção

---

## 🚨 **Segurança: Chaves do Projeto**

### ⚠️ **NUNCA coloque a chave SECRET em código público!**

**Chaves Públicas (Seguras):**
- ✅ `SUPABASE_URL` - Pode estar no código
- ✅ `SUPABASE_ANON_KEY` - Pode estar no código

**Chaves Privadas (Confidenciais):**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Guarde no servidor apenas!

Para variáveis de ambiente:
```bash
# .env.local (NÃO COMMITAR!)
VITE_SUPABASE_URL=https://xrqidloohnexqisxzoxa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔗 **Conectar Autenticação com Profiles**

Quando um usuário se registra, criar automaticamente um perfil:

```typescript
const handleSignupWithProfile = async (
  email: string,
  password: string,
  profileData: any
) => {
  // 1. Registrar usuário
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    console.error('Erro ao registrar:', authError);
    return false;
  }

  // 2. Criar perfil associado
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: authData.user.id,
        email,
        ...profileData,
      },
    ]);

  if (profileError) {
    console.error('Erro ao criar perfil:', profileError);
    return false;
  }

  return true;
};
```

---

## 📊 **Exemplo Completo: Fluxo de Publicar Vaga**

```typescript
import { supabase, getCurrentUserProfile } from '@/services/supabaseClient';

const publishJob = async (jobData: any) => {
  try {
    // 1. Obter usuário logado
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('Usuário não autenticado');
    }

    // 2. Inserir vaga no banco
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          company_id: user.data.user.id,
          title: jobData.title,
          description: jobData.description,
          seniority: jobData.seniority,
          hard_skills: jobData.hardSkills,
          soft_skills: jobData.softSkills,
          location_name: jobData.locationName,
          latitude: jobData.location.latitude,
          longitude: jobData.location.longitude,
          modality: jobData.modality,
          culture_tags: jobData.cultureTags,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) {
      throw new Error(`Erro ao publicar vaga: ${error.message}`);
    }

    console.log('Vaga publicada com sucesso:', data);
    return data[0];
  } catch (err) {
    console.error('Erro:', err);
    throw err;
  }
};
```

---

## 🆘 **Troubleshooting**

### Erro: "Chave anônima inválida"
**Solução:** Verifique se `SUPABASE_ANON_KEY` está correta no arquivo `.env.local`

### Erro: "Tabela não existe"
**Solução:** Crie as tabelas no SQL Editor do Supabase Dashboard

### Erro: "Sem permissão de acesso"
**Solução:** Configure RLS policies no dashboard

### Erro: "CORS bloqueado"
**Solução:** Adicione seu domínio em **Project Settings** → **API** → **CORS**

---

## 📚 **Recursos Úteis**

- 📖 [Documentação Supabase](https://supabase.com/docs)
- 🔐 [Autenticação Supabase](https://supabase.com/docs/guides/auth)
- 🗄️ [Banco de Dados Supabase](https://supabase.com/docs/guides/database)
- 🔄 [Real-time Supabase](https://supabase.com/docs/guides/realtime)

---

**Pronto para começar! 🎉** O projeto está 100% conectado com Supabase!
