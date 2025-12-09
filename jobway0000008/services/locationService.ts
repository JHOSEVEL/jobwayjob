import { LocationCoordinates } from '../types';

// SC Cities with Real GPS Coordinates
export const SC_CITIES = {
  'Florianópolis': { latitude: -27.5949, longitude: -48.5482 },
  'São José': { latitude: -27.5900, longitude: -48.6150 },
  'Joinville': { latitude: -26.3054, longitude: -48.8764 },
  'Blumenau': { latitude: -26.9194, longitude: -49.0661 },
  'Itajaí': { latitude: -26.9144, longitude: -48.6617 },
  'Brusque': { latitude: -27.0069, longitude: -48.9263 },
  'Chapecó': { latitude: -27.0969, longitude: -52.6157 },
  'Criciúma': { latitude: -28.6816, longitude: -49.3831 },
  'Jaraguá do Sul': { latitude: -26.4834, longitude: -49.0639 },
  'Lages': { latitude: -27.8142, longitude: -50.3277 },
};

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // City
  uf: string; // State (SC, SP, etc)
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

/**
 * Fetch location data from ViaCEP API
 * Returns city and state from CEP
 */
export const fetchLocationFromCep = async (cep: string): Promise<ViaCepResponse | null> => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

/**
 * Get coordinates from city name in Santa Catarina
 * Returns null if city not found
 */
export const getCoordinatesFromCity = (cityName: string): LocationCoordinates | null => {
  // Try exact match first
  if (SC_CITIES[cityName as keyof typeof SC_CITIES]) {
    return SC_CITIES[cityName as keyof typeof SC_CITIES];
  }

  // Try case-insensitive match
  const city = Object.keys(SC_CITIES).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );

  if (city) {
    return SC_CITIES[city as keyof typeof SC_CITIES];
  }

  return null;
};

/**
 * Validate if city is in Santa Catarina
 */
export const isSantaCatarinaCity = (state: string): boolean => {
  return state.toUpperCase() === 'SC';
};

/**
 * Process CEP and return location data with coordinates
 * Returns null if CEP is not from SC or invalid
 */
export const processLocationFromCep = async (
  cep: string
): Promise<{
  city: string;
  state: string;
  coordinates: LocationCoordinates;
} | null> => {
  const viacepData = await fetchLocationFromCep(cep);

  if (!viacepData) {
    return null;
  }

  // Only process SC locations
  if (!isSantaCatarinaCity(viacepData.uf)) {
    console.warn(`CEP is from ${viacepData.uf}, not SC`);
    return null;
  }

  const coordinates = getCoordinatesFromCity(viacepData.localidade);

  if (!coordinates) {
    console.warn(`City ${viacepData.localidade} not found in SC cities list`);
    return null;
  }

  return {
    city: viacepData.localidade,
    state: viacepData.uf,
    coordinates,
  };
};

/**
 * Get approximate center coordinate between two locations
 * Useful for map centering
 */
export const getCenterPoint = (
  locations: LocationCoordinates[]
): LocationCoordinates => {
  if (locations.length === 0) {
    return { latitude: -27.5949, longitude: -48.5482 }; // Default to Florianópolis
  }

  const avgLat =
    locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
  const avgLng =
    locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

  return {
    latitude: avgLat,
    longitude: avgLng,
  };
};

/**
 * List all available SC cities
 */
export const getSCCitiesList = (): string[] => {
  return Object.keys(SC_CITIES).sort();
};
