import React, { useState, useEffect } from 'react';
import { getCountries, getStates, getCities } from '../data/locationData';
import { Globe, MapPin } from 'lucide-react';

interface LocationSelectorProps {
  country: string;
  state: string;
  city: string;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  disabled = false
}) => {
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (country) {
      const states = getStates(country);
      setAvailableStates(states);
      if (!states.includes(state)) {
        onStateChange('');
        onCityChange('');
      }
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [country, state, onStateChange, onCityChange]);

  useEffect(() => {
    if (country && state) {
      const cities = getCities(country, state);
      setAvailableCities(cities);
      if (!cities.includes(city)) {
        onCityChange('');
      }
    } else {
      setAvailableCities([]);
    }
  }, [country, state, city, onCityChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Globe className="inline w-4 h-4 mr-1" />
          Country*
        </label>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          required
        >
          <option value="">Select Country</option>
          {getCountries().map(countryName => (
            <option key={countryName} value={countryName}>{countryName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline w-4 h-4 mr-1" />
          State*
        </label>
        <select
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          disabled={disabled || !country}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          required
        >
          <option value="">Select State</option>
          {availableStates.map(stateName => (
            <option key={stateName} value={stateName}>{stateName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline w-4 h-4 mr-1" />
          City*
        </label>
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled || !state}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          required
        >
          <option value="">Select City</option>
          {availableCities.map(cityName => (
            <option key={cityName} value={cityName}>{cityName}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;