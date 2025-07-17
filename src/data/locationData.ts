export interface LocationData {
  countries: Country[];
}

export interface Country {
  name: string;
  states: State[];
}

export interface State {
  name: string;
  cities: string[];
}

export const locationData: LocationData = {
  countries: [
    {
      name: "India",
      states: [
        {
          name: "Gujarat",
          cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand"]
        },
        {
          name: "Maharashtra",
          cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Sangli"]
        },
        {
          name: "Karnataka",
          cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Shimoga"]
        },
        {
          name: "Tamil Nadu",
          cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"]
        },
        {
          name: "Delhi",
          cities: ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"]
        },
        {
          name: "Rajasthan",
          cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur"]
        },
        {
          name: "Uttar Pradesh",
          cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Ghaziabad"]
        },
        {
          name: "West Bengal",
          cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur"]
        }
      ]
    },
    {
      name: "United States",
      states: [
        {
          name: "California",
          cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Oakland", "Long Beach"]
        },
        {
          name: "New York",
          cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon"]
        },
        {
          name: "Texas",
          cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi"]
        }
      ]
    },
    {
      name: "United Kingdom",
      states: [
        {
          name: "England",
          cities: ["London", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Newcastle"]
        },
        {
          name: "Scotland",
          cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling", "Perth", "Inverness", "Paisley"]
        }
      ]
    }
  ]
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
  if (!country) return [];
  
  const state = country.states.find(s => s.name === stateName);
  return state ? state.cities : [];
};