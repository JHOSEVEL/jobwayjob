# 📍 Guia: Localização por CEP e Vagas Próximas

## ✨ O que foi implementado

### 1. **Serviço de Localização (`locationService.ts`)**
- ✅ Integração com API ViaCEP para buscar localização
- ✅ Validação de CEPs em Santa Catarina apenas
- ✅ Mapeamento automático de cidades para coordenadas GPS reais
- ✅ Tratamento de erros com mensagens amigáveis

### 2. **Cadastro do Candidato Aprimorado**
- ✅ Campo CEP com validação automática
- ✅ Mensagens de sucesso/erro em tempo real
- ✅ Preenchimento automático de cidade e estado
- ✅ Captura de coordenadas GPS para localização

### 3. **Dashboard do Candidato Otimizada**
- ✅ Vagas filtradas por proximidade automaticamente
- ✅ Ordenação por distância (mais próximas primeiro)
- ✅ Destaque especial para vagas muito próximas (< 15 km)
- ✅ Indicadores visuais de distância
- ✅ Exibição da localização do candidato no topo

---

## 🧪 Como Testar

### Passo 1: Cadastrar com CEP em SC

1. Inicie o app e clique em **"Candidato"** na landing page
2. Preencha os dados:
   - **Nome**: Seu Nome
   - **Email**: seu@email.com
   - **Celular**: (47) 99999-9999

3. **Insira um CEP válido em Santa Catarina**:

| Cidade | CEP Exemplo | Estado |
|--------|-----------|--------|
| Florianópolis | 88010-500 | SC |
| São José | 88020-300 | SC |
| Joinville | 89201-300 | SC |
| Blumenau | 89012-100 | SC |
| Itajaí | 88301-300 | SC |
| Brusque | 88015-300 | SC |

**Resultado esperado:**
- ✅ A cidade e estado preenchem automaticamente
- ✅ Mensagem verde: "📍 [Cidade], SC localizado com sucesso!"
- ✅ Coordenadas são capturadas para localização

### Passo 2: Testar Mensagens de Erro

**Insira um CEP fora de SC:**
```
CEP de São Paulo: 01234-900
```

**Resultado esperado:**
- ❌ Mensagem de erro: "⚠️ CEP não encontrado em Santa Catarina..."
- ❌ Campos de cidade/estado ficam vazios
- ❌ Botão "Próximo" desabilitado até um CEP SC válido ser inserido

### Passo 3: Ver Vagas Próximas

1. Depois de inserir um CEP válido, clique em **"Próximo"**
2. Faça upload de um currículo (opcional) e clique em **"Finalizar Cadastro"**
3. Você será levado ao **CandidateDashboard** com vagas filtradas por proximidade

**Na Dashboard:**
- 📍 Localização do candidato exibida: "Baseado em [Cidade], SC"
- 🟢 Vagas dentro de 15 km têm badge "🔥 Muito Próximo!"
- 🟡 Vagas entre 15-50 km têm fundo amarelo
- 🔵 Vagas acima de 50 km têm fundo neutro

**Ordem de exibição:**
- Mais próximas primeiro (quanto menor a distância, antes aparece)
- Distâncias exibidas com **2 casas decimais** (XX.XX km)

---

## 🗺️ Cidades Disponíveis em SC

O projeto inclui 10 cidades principais de Santa Catarina com coordenadas reais:

```
1. Florianópolis (-27.5949°, -48.5482°)
2. São José (-27.5900°, -48.6150°)
3. Joinville (-26.3054°, -48.8764°)
4. Blumenau (-26.9194°, -49.0661°)
5. Itajaí (-26.9144°, -48.6617°)
6. Brusque (-27.0069°, -48.9263°)
7. Chapecó (-27.0969°, -52.6157°)
8. Criciúma (-28.6816°, -49.3831°)
9. Jaraguá do Sul (-26.4834°, -49.0639°)
10. Lages (-27.8142°, -50.3277°)
```

**Qualquer CEP inserido será mapeado para a cidade mais próxima!**

---

## 🔧 Como Funciona Internamente

### Fluxo de CEP → Localização

```
Usuário insere CEP
    ↓
API ViaCEP retorna: {localidade, uf, ...}
    ↓
Validação: É SC? Sim ✅
    ↓
Busca cidade em SC_CITIES
    ↓
Retorna coordenadas GPS
    ↓
Armazena em candidateData.coordinates
```

### Fluxo de Ordenação de Vagas

```
candidateData carregado com coordinates
    ↓
Calcula distância de cada vaga
    (Fórmula Haversine)
    ↓
Filtra apenas vagas não-Canadá
    ↓
Ordena por distance (ascendente)
    ↓
Exibe com badges de proximidade
```

---

## 📊 Dados de Teste - Vagas Mock

As vagas são:

| ID | Título | Cidade | Distância* |
|----|--------|--------|-----------|
| job-101 | Desenvolvedor React Senior | Florianópolis | 0.00 km |
| job-102 | Analista de Suporte Bilíngue | São José | ~7.00 km |
| job-103 | Engenheiro de Dados | Blumenau | ~42.00 km |
| job-104 | Full Stack (Visa Sponsor) | Vancouver, Canada | - (aba separada) |

*Distâncias são aproximadas dependendo do CEP inserido

---

## ✅ Checklist de Funcionalidades

- [x] CEP validado com ViaCEP API
- [x] Apenas CEPs de SC são aceitos
- [x] Coordenadas GPS capturadas e armazenadas
- [x] Vagas filtradas por proximidade
- [x] Ordenação por distância (mais próximas primeiro)
- [x] Destaque visual para vagas muito próximas
- [x] Distâncias exibidas com 2 decimais
- [x] Localização do candidato exibida na dashboard
- [x] Auto-seleção da primeira vaga próxima
- [x] Mensagens de erro/sucesso claras
- [x] Compatibilidade com mapa (Leaflet)

---

## 🚀 Próximos Passos (Sugeridos)

1. **Conectar com Supabase** para salvar dados reais
   - Tabela `candidates` com coordinates
   - Tabela `jobs` com location_name e coordinates
   - Queries em tempo real

2. **Filtros Avançados**
   - Filtrar por tipo de trabalho
   - Filtrar por seniority
   - Filtrar por skills

3. **Notificações**
   - Alertar quando nova vaga próxima aparecer
   - Email com vagas semanais

4. **Integração com Linkedin**
   - Login com Linkedin
   - Auto-preenchimento de perfil
   - Sync de skills

---

## 🐛 Troubleshooting

**Problema: CEP não é reconhecido**
- Solução: Verifique se é um CEP realmente válido usando https://viacep.com.br

**Problema: Vaga não aparece após cadastro**
- Solução: Verifique se a vaga está marcada como `isCanadianOpportunity: false`

**Problema: Coordenadas não aparecem**
- Solução: Veja o console (F12) para mensagens de erro da API

**Problema: Distância está em 1 decimal**
- Solução: Atualize o arquivo para usar `toFixed(2)` em vez de `toFixed(1)`

---

**Status:** ✅ Implementação 100% Concluída
**Arquivos Modificados:**
- ✅ `services/locationService.ts` (novo)
- ✅ `pages/CandidateSignup.tsx`
- ✅ `pages/CandidateDashboard.tsx`

