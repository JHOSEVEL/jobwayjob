# Teste rápido da conexão Supabase

## Pré-requisitos
- Ter as variáveis de ambiente definidas (ou editar `scripts/testSupabase.js` para incluir chaves)
- Node.js instalado

## Rodar script de teste
No terminal (Windows PowerShell):

```powershell
$env:VITE_SUPABASE_URL = 'https://xrqidloohnexqisxzoxa.supabase.co'
$env:VITE_SUPABASE_ANON_KEY = '<SUA_ANON_KEY>'
node scripts/testSupabase.js
```

No terminal (bash/cmd):

```bash
VITE_SUPABASE_URL='https://xrqidloohnexqisxzoxa.supabase.co' VITE_SUPABASE_ANON_KEY='<SUA_ANON_KEY>' node scripts/testSupabase.js
```

O script tentará:
- Fazer upsert de um `profile` de teste
- Listar até 3 vagas da tabela `jobs`

Se as tabelas não existirem, crie-as rodando o SQL em `migrations/001_init.sql` no SQL editor do Supabase.

## Observações
- Use apenas a `ANON_KEY` em ambiente de desenvolvimento. Para operações administrativas use a `SERVICE_ROLE_KEY` apenas no servidor.
- Se receber erros de permissão ao tentar inserir profiles, revise as policies RLS (veja `migrations/002_rls_policies.sql`).
