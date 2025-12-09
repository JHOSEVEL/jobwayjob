# 🧪 Exemplo de Teste Prático

## Cenário: Candidato de Florianópolis

### Step 1: Preencher Cadastro

```
Nome: João Silva
Email: joao@example.com
Celular: (47) 99999-9999
CEP: 88010-500
```

**O que acontece:**
1. Usuário digita `88010-500`
2. Função `processLocationFromCep()` é chamada
3. ViaCEP API retorna:
```json
{
  "cep": "88010-500",
  "logradouro": "Rua Felipe Schmidt",
  "bairro": "Centro",
  "localidade": "Florianópolis",
  "uf": "SC"
}
```

4. Validação:
   - ✅ CEP é válido? SIM
   - ✅ Estado é SC? SIM
   - ✅ Cidade em SC_CITIES? SIM

5. Resultado:
```typescript
{
  city: "Florianópolis",
  state: "SC",
  coordinates: {
    latitude: -27.5949,
    longitude: -48.5482
  }
}
```

6. UI exibe:
```
Cidade: Florianópolis ✓
Estado: SC ✓
Mensagem: "📍 Florianópolis, SC localizado com sucesso!" (Verde)
```

### Step 2: Ir para Dashboard

Usuário clica "Próximo" → Clica "Finalizar Cadastro"

**candidateData agora é:**
```typescript
{
  name: "João Silva",
  email: "joao@example.com",
  phone: "(47) 99999-9999",
  address: {
    cep: "88010-500",
    city: "Florianópolis",
    state: "SC",
    neighborhood: ""
  },
  coordinates: {
    latitude: -27.5949,
    longitude: -48.5482
  },
  areaOfInterest: "Tecnologia",
  skills: []
}
```

### Step 3: Dashboard Carrega Vagas

**userCoords** = `{ latitude: -27.5949, longitude: -48.5482 }` (Florianópolis)

**Cálculo de Distância para cada vaga:**

#### Job 101 - "Desenvolvedor React Senior"
```
Localização: Florianópolis (-27.5954, -48.5480)
Fórmula Haversine:
  Δlat = -27.5949 - (-27.5954) = 0.0005
  Δlon = -48.5482 - (-48.5480) = -0.0002
  Resultado: ≈ 0.00 km
```

#### Job 102 - "Analista de Suporte"
```
Localização: São José (-27.5900, -48.6150)
Fórmula Haversine:
  Δlat = -27.5949 - (-27.5900) = -0.0049
  Δlon = -48.5482 - (-48.6150) = 0.0668
  Resultado: ≈ 7.25 km ← 🔥 MUITO PRÓXIMO!
```

#### Job 103 - "Engenheiro de Dados"
```
Localização: Blumenau (-26.9194, -49.0661)
Fórmula Haversine:
  Δlat = -27.5949 - (-26.9194) = -0.6755
  Δlon = -48.5482 - (-49.0661) = 0.5179
  Resultado: ≈ 82.30 km
```

#### Job 104 - "Full Stack Canada"
```
Localização: Vancouver (49.2827, -123.1207)
Filtro: isCanadianOpportunity = true
Resultado: Não aparece na aba "Próximo a Mim"
           (Só na aba "Vagas Canadá")
```

### Step 4: Exibição na Dashboard

**Após cálculo, filtro e ordenação:**

```
═══════════════════════════════════════════════════════════
📍 Baseado em Florianópolis, SC

[List View]

┌─────────────────────────────────────────────────────────┐
│ 🔥 Muito Próximo!                     [Badge Verde]   │
│                                                          │
│ Desenvolvedor React Senior                              │
│ 🏢 Empresa Confidencial                                 │
│                                                          │
│ 🎯 Hibrido • 📍 Florianópolis, SC • 🟢 0.00 km         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔥 Muito Próximo!                     [Badge Verde]   │
│                                                          │
│ Analista de Suporte Bilíngue                            │
│ 🏢 Empresa Confidencial                                 │
│                                                          │
│ 👥 Presencial • 📍 São José, SC • 🟢 7.25 km           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                          │
│ Engenheiro de Dados                                     │
│ 🏢 Empresa Confidencial                                 │
│                                                          │
│ 🏠 Remoto • 📍 Blumenau, SC • 🟡 82.30 km             │
└─────────────────────────────────────────────────────────┘

[Map View]

Mapa renderizado com:
- 🔵 Marcador azul: Você (João) em Florianópolis
- 🟢 Marcadores verdes: Vagas SC
- Distâncias exibidas nos marcadores
```

---

## 🚨 Cenário 2: CEP INVÁLIDO (Fora de SC)

### Input: São Paulo

```
CEP: 01234-900 (São Paulo)
```

**O que acontece:**

1. `processLocationFromCep()` chamada
2. ViaCEP retorna:
```json
{
  "localidade": "São Paulo",
  "uf": "SP"  ← ⚠️ NÃO É SC
}
```

3. Validação:
   - ✅ CEP é válido? SIM
   - ❌ Estado é SC? **NÃO** → PARAR

4. Resultado:
```typescript
null
```

5. UI exibe:
```
Cidade: [VAZIO]
Estado: [VAZIO]
Mensagem: "⚠️ CEP não encontrado em Santa Catarina. Verifique o CEP informado."
          (Em fundo vermelho)
```

---

## 🎯 Cenário 3: CEP INVÁLIDO (Sintaxe)

### Input: Número errado

```
CEP: 123 (apenas 3 dígitos)
```

**O que acontece:**

1. Usuário digita `123`
2. Validação comprimento: `123`.replace(/\D/g, '').length = 3
3. Condição: `if (cleanCep.length !== 8)` → TRUE
4. Retorna `null` sem fazer request

5. UI exibe:
```
Nada acontece até ter 8 dígitos
```

---

## 📊 Tabela Comparativa: Antes vs Depois

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| CEP | Validação mínima | Validação completa com ViaCEP |
| Localização | Hardcoded SP | Coordenadas reais por CEP |
| Vagas Proximidade | Aleatória | Ordenada por distância |
| Estado | Qualquer um | Apenas SC |
| Mensagem Usuário | Nenhuma | Sucesso/Erro clara |
| Auto-preenchimento | Parcial | 100% automático |
| Destaque Proximidade | Nenhum | 🔥 Badge + Cores |

---

## 🔍 Debug - Ver Logs

**Abra DevTools (F12) e veja Console:**

```javascript
// Quando CEP é processado com sucesso:
"CEP processado: { city: 'Florianópolis', state: 'SC', coordinates: {...} }"

// Quando CEP é inválido:
"⚠️ CEP não encontrado em Santa Catarina"

// Quando há erro na API:
"Erro ao buscar CEP: [error object]"
```

---

## 🎬 Gravação Esperada

### Tela 1: Signup
```
[User types 88010-500]
↓
[Real-time validation]
↓
[Success message + auto-filled fields]
↓
[Button "Próximo" becomes enabled]
```

### Tela 2: Dashboard
```
[Page loads with candidate location]
↓
[Distances calculated]
↓
[Vagas sorted by distance]
↓
[First job pre-selected]
↓
[Map shows all locations]
```

---

## ✅ Checklist de Teste

- [ ] CEP de Florianópolis (88010-500) funciona
- [ ] Mensagem de sucesso aparece
- [ ] Vagas aparecem ordenadas por distância
- [ ] Badge "🔥 Muito Próximo!" aparece para vagas < 15 km
- [ ] CEP de São Paulo (01234-900) mostra erro
- [ ] Erro é em português claro
- [ ] Mapa renderiza com vagas
- [ ] Distâncias em formato XX.XX km
- [ ] Auto-seleção de primeira vaga funciona
- [ ] Candidato consegue se candidatar

---

**Pronto para testar! 🚀**

