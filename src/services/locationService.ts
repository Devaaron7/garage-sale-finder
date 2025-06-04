interface LocationData {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Array<{
    'place name': string;
    longitude: string;
    latitude: string;
    state: string;
    'state abbreviation': string;
  }>;
}

export async function getLocationByZipCode(zipCode: string): Promise<{ city: string; state: string; zipCode: string } | null> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch location data: ${response.statusText}`);
    }
    
    const data: LocationData = await response.json();
    
    if (!data.places || data.places.length === 0) {
      throw new Error('No location data found for the provided zip code');
    }
    
    const place = data.places[0];
    return {
      city: place['place name'],
      state: place['state abbreviation'],
      zipCode: data['post code']
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}
