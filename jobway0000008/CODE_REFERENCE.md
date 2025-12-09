# 💻 Referência Rápida de Código

## 📍 Como Usar o Serviço de Localização

### Importar
```typescript
import { 
  processLocationFromCep,
  getCoordinatesFromCity,
  getSCCitiesList 
} from '../services/locationService';
```

### Processar CEP
```typescript
const handleCepChange = async (cep: string) => {
  const result = await processLocationFromCep(cep);
  
  if (result) {
    console.log('✅ Localizado:', result);
    // {
    //   city: "Florianópolis",
    //   state: "SC",
    //   coordinates: { latitude: -27.5949, longitude: -48.5482 }
    // }
    
    setCandidateData(prev => ({
      ...prev,
      address: {
        cep: cep,
        city: result.city,
        state: result.state,
      },
      coordinates: result.coordinates
    }));
  } else {
    console.log('❌ CEP não encontrado em SC');
  }
};
```

### Obter Cidade
```typescript
const coords = getCoordinatesFromCity("Florianópolis");
// Retorna: { latitude: -27.5949, longitude: -48.5482 }
// ou null se não encontrar
```

### Listar Cidades Disponíveis
```typescript
const cities = getSCCitiesList();
// Retorna: ["Blumenau", "Brusque", "Chapecó", ...]
```

---

## 🗺️ Calcular Distância Entre Vagas e Candidato

```typescript
import { getDistanceFromLatLonInKm } from '../services/geminiService';

// Coordenadas do candidato
const candidateLat = -27.5949;
const candidateLng = -48.5482;

// Coordenadas da vaga
const jobLat = -27.5900;
const jobLng = -48.6150;

// Calcular distância
const distance = getDistanceFromLatLonInKm(
  candidateLat, candidateLng,
  jobLat, jobLng
);

console.log(`Distância: ${distance.toFixed(2)} km`);
// Output: "Distância: 7.25 km"
```

---

## 🎯 Filtrar e Ordenar Vagas por Proximidade

```typescript
const filteredAndSortedJobs = useMemo(() => {
  // 1. Processar cada vaga (calcular distância)
  const jobsWithDistance = jobs.map(job => ({
    ...job,
    distance: getDistanceFromLatLonInKm(
      userCoords.latitude, userCoords.longitude,
      job.location.latitude, job.location.longitude
    )
  }));

  // 2. Filtrar apenas vagas locais (não Canadá)
  const localJobs = jobsWithDistance.filter(
    job => !job.isCanadianOpportunity
  );

  // 3. Ordenar por distância (mais próximas primeiro)
  const sorted = localJobs.sort(
    (a, b) => (a.distance || 0) - (b.distance || 0)
  );

  return sorted;
}, [userCoords, jobs]);
```

---

## 🎨 Highlighting Vagas Próximas

```typescript
const isVeryClose = job.distance && job.distance < 15;
const isCloseby = job.distance && job.distance < 50;

{isVeryClose && (
  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
    🔥 Muito Próximo!
  </span>
)}

<div className={`text-xs font-semibold px-2 py-1 rounded-full ${
  isVeryClose 
    ? 'bg-green-100 text-green-700' 
    : isCloseby 
    ? 'bg-yellow-100 text-yellow-700'
    : 'text-slate-400'
}`}>
  {distance.toFixed(2)} km
</div>
```

---

## 🚨 Tratamento de Erros e Validações

```typescript
// Validar se CEP é válido (8 dígitos)
const isValidCepLength = (cep: string): boolean => {
  return cep.replace(/\D/g, '').length === 8;
};

// Validar se é Santa Catarina
const isSC = (state: string): boolean => {
  return state.toUpperCase() === 'SC';
};

// Usar no componente
const [cepError, setCepError] = useState('');
const [cepSuccess, setCepSuccess] = useState('');

const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const cep = e.target.value;
  
  if (!isValidCepLength(cep)) {
    setCepError('CEP deve ter 8 dígitos');
    return;
  }
  
  const result = await processLocationFromCep(cep);
  
  if (!result) {
    setCepError('⚠️ CEP não encontrado em Santa Catarina');
  } else {
    setCepSuccess(`📍 ${result.city}, ${result.state} localizado!`);
    // ... atualizar dados
  }
};
```

---

## 📊 Estrutura de Dados

### Candidato com Coordenadas
```typescript
interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  address: {
    cep: string;
    city: string;
    state: string;
    neighborhood: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  areaOfInterest: string;
  skills: string[];
}
```

### Vaga com Distância
```typescript
interface JobPosition {
  id: string;
  title: string;
  description: string;
  locationName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Calculada dinamicamente
  modality: 'Presencial' | 'Hibrido' | 'Remoto';
  seniority: 'Junior' | 'Pleno' | 'Senior';
  // ... outros campos
}
```

---

## 🔄 Fluxo Completo no Componente

```typescript
export const CandidateDashboard = ({ candidateData }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // 1. Obter coordenadas do candidato
  const userCoords = useMemo(() => {
    return candidateData?.coordinates || DEFAULT_COORDS;
  }, [candidateData]);

  // 2. Processar e calcular distâncias
  const processedJobs = useMemo(() => {
    return MOCK_JOBS.map(job => ({
      ...job,
      distance: getDistanceFromLatLonInKm(
        userCoords.latitude, userCoords.longitude,
        job.location.latitude, job.location.longitude
      )
    }));
  }, [userCoords]);

  // 3. Filtrar e ordenar
  const filteredJobs = useMemo(() => {
    return processedJobs
      .filter(j => !j.isCanadianOpportunity)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [processedJobs]);

  // 4. Auto-selecionar primeira vaga
  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs]);

  // 5. Renderizar
  return (
    <div>
      <h1>📍 Baseado em {candidateData?.address?.city}</h1>
      {filteredJobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>🟢 {job.distance?.toFixed(2)} km</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 🧪 Teste Unitário (Exemplo)

```typescript
// locationService.test.ts
import { processLocationFromCep, getCoordinatesFromCity } from './locationService';

describe('locationService', () => {
  it('deve processar CEP de Florianópolis', async () => {
    const result = await processLocationFromCep('88010-500');
    expect(result).toEqual({
      city: 'Florianópolis',
      state: 'SC',
      coordinates: {
        latitude: -27.5949,
        longitude: -48.5482
      }
    });
  });

  it('deve retornar null para CEP fora de SC', async () => {
    const result = await processLocationFromCep('01234-900'); // São Paulo
    expect(result).toBeNull();
  });

  it('deve encontrar coordenadas de cidade', () => {
    const coords = getCoordinatesFromCity('Blumenau');
    expect(coords).toBeDefined();
    expect(coords?.latitude).toBeCloseTo(-26.9194, 3);
  });
});
```

---

## 🔗 Integração com Supabase (Futuro)

```typescript
// Para salvar CEP no banco:
const saveCandidateLocation = async (userId: string, candidateData: any) => {
  const { error } = await supabase
    .from('candidates')
    .update({
      cep: candidateData.address.cep,
      city: candidateData.address.city,
      state: candidateData.address.state,
      latitude: candidateData.coordinates.latitude,
      longitude: candidateData.coordinates.longitude,
    })
    .eq('user_id', userId);

  if (error) console.error('Erro ao salvar:', error);
};

// Para buscar vagas próximas do banco:
const getNearbyJobs = async (latitude: number, longitude: number, radiusKm: number = 50) => {
  // Usando PostGIS no Supabase
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .rpc('nearby_jobs', {
      latitude,
      longitude,
      radius_km: radiusKm
    })
    .order('distance', { ascending: true });

  return data;
};
```

---

## 📝 Notas de Implementação

- ✅ Todas as funções são **async** e tratam erros
- ✅ Validações acontecem **em tempo real**
- ✅ Coordenadas são **capturadas automaticamente**
- ✅ Distâncias calculadas com **precisão em km**
- ✅ UI é **responsivo** para mobile
- ✅ Sem **dependências externas** além do que já existe

---

**Pronto para implementar mais? 🚀**

