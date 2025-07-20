import data from '../data/countries.json';

export interface LocationData {
  countries: Country[];
}

export interface Country {
  name: string;
  states: State[];
}

export interface State {
  name: string;
  cities: { name: string }[];
}

export const locationData: LocationData = {
  countries: data as Country[]
};

export const getCountries = (): string[] => {
  return locationData.countries.map(country => country.name);
};

export const getStates = (countryName: string): string[] => {
  const country = locationData.countries.find(c => c.name === countryName);
  return country ? country.states.map(state => state.name) : [];
};

export const getCities = (countryName: string, stateName: string): string[] => {
  const country = locationData.countries.find(c => c.name === countryName);
  const state = country?.states.find(s => s.name === stateName);
  return state ? state.cities.map(c => c.name) : [];
};

// New functions for validation
export const hasStates = (countryName: string): boolean => {
  const country = locationData.countries.find(c => c.name === countryName);
  return country ? country.states.length > 0 : false;
};

export const hasCities = (countryName: string, stateName: string): boolean => {
  const country = locationData.countries.find(c => c.name === countryName);
  const state = country?.states.find(s => s.name === stateName);
  return state ? state.cities.length > 0 : false;
};

// Function to get cities directly from country (for countries without states)
export const getCitiesFromCountry = (countryName: string): string[] => {
  const country = locationData.countries.find(c => c.name === countryName);
  if (!country || country.states.length === 0) {
    return [];
  }
  
  // If country has states but user wants to bypass, return empty
  // This function is mainly for countries that naturally have no states
  return [];
};

// Helper function to check if state/city fields are required
export const isStateRequired = (countryName: string): boolean => {
  return hasStates(countryName);
};

export const isCityRequired = (countryName: string, stateName: string): boolean => {
  // If country has no states, city is required directly from country
  if (!hasStates(countryName)) {
    return true;
  }
  
  // If state has cities, city is required
  return hasCities(countryName, stateName);
};
