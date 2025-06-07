const axios = require('axios');

// Cache for zip code lookups to reduce API calls
const zipCodeCache = new Map();

// Default location data if API call fails
const defaultLocation = { 
  city: 'Miami', 
  state: 'FL', 
  stateAbbreviation: 'FL',
  lat: 25.7617, 
  lng: -80.1918 
};

/**
 * Fetches location data from Zippopotam API
 * @param {string} zipCode - 5-digit US zip code
 * @returns {Promise<Object>} Location data object
 */
const fetchLocationFromAPI = async (zipCode) => {
  try {
    const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
    
    if (response.data && response.data.places && response.data.places.length > 0) {
      const place = response.data.places[0];
      return {
        city: place['place name'],
        state: place.state,
        stateAbbreviation: place['state abbreviation'],
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude),
        country: response.data.country,
        countryAbbreviation: response.data['country abbreviation'],
        postCode: response.data['post code']
      };
    }
  } catch (error) {
    console.error(`Error fetching location for zip code ${zipCode}:`, error.message);
  }
  
  return null;
};

/**
 * Gets location data for a zip code, using cache if available
 * @param {string} zipCode - 5-digit US zip code
 * @returns {Promise<Object>} Location data object
 */
const getLocationByZipCode = async (zipCode) => {
  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    console.warn(`Invalid zip code format: ${zipCode}`);
    return { ...defaultLocation };
  }
  
  // Check cache first
  if (zipCodeCache.has(zipCode)) {
    return { ...zipCodeCache.get(zipCode) };
  }
  
  // Fetch from API
  const locationData = await fetchLocationFromAPI(zipCode);
  
  // If API call failed, return default
  if (!locationData) {
    console.warn(`Could not find location data for zip code: ${zipCode}`);
    return { ...defaultLocation };
  }
  
  // Cache the result
  zipCodeCache.set(zipCode, locationData);
  return { ...locationData };
};

module.exports = {
  getLocationByZipCode
};
