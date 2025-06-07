// Server-side location service
const zipCodeData = {
  // Florida
  '33101': { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  '33130': { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  '33139': { city: 'Miami Beach', state: 'FL', lat: 25.7907, lng: -80.1300 },
  '33301': { city: 'Fort Lauderdale', state: 'FL', lat: 26.1224, lng: -80.1373 },
  '33401': { city: 'West Palm Beach', state: 'FL', lat: 26.7153, lng: -80.0534 },
  '33313': { city: 'Fort Lauderdale', state: 'FL', lat: 26.1457, lng: -80.2090 },
  
  // New York
  '10001': { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
  '10019': { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
  '11201': { city: 'Brooklyn', state: 'NY', lat: 40.6782, lng: -73.9442 },
  
  // California
  '90001': { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  '90210': { city: 'Beverly Hills', state: 'CA', lat: 34.0736, lng: -118.4004 },
  '94016': { city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
  
  // Default
  'default': { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 }
};

const getLocationByZipCode = (zipCode) => {
  // Return the location data for the zip code or the default if not found
  return zipCodeData[zipCode] || zipCodeData['default'];
};

module.exports = {
  getLocationByZipCode
};
