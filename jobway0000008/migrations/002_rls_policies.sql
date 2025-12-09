-- RLS policies para Jobway
-- Habilitar row level security e criar policies básicas

-- Habilita extensão para gen_random_uuid caso necessário (Supabase usa pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles: apenas o dono pode ver/editar seu perfil
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: select own" 
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles: insert own" 
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.role() = 'anon');

CREATE POLICY "Profiles: update own" 
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Jobs: público pode ler, apenas empresa dona pode criar/editar/deletar
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs: public read" 
  ON jobs
  FOR SELECT
  USING (true);

CREATE POLICY "Jobs: insert by company" 
  ON jobs
  FOR INSERT
  WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Jobs: update by company" 
  ON jobs
  FOR UPDATE
  USING (auth.uid() = company_id)
  WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Jobs: delete by company"
  ON jobs
  FOR DELETE
  USING (auth.uid() = company_id);

-- Candidates: cada candidato pode ver seu registro; empresas não têm acesso por padrão
ALTER TABLE IF EXISTS candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates: select own"
  ON candidates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates: insert own"
  ON candidates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates: update own"
  ON candidates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Matches: apenas inserções pelo sistema/backend (usar service_role) ou policies a medida que evoluir
ALTER TABLE IF EXISTS matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches: public none"
  ON matches
  FOR ALL
  USING (false);

-- Nota: Para operações administrativas (inserir matches por AI, consultar todos), utilize a Service Role key (não no frontend)

-- Fim das policies
