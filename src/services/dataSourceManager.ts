import { GarageSale, DataSource } from '../types';
import { searchGarageSales as searchGSALR } from './gsalrService';

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'gsalr',
    name: 'GSALR',
    url: 'https://www.gsalr.com',
    enabled: true
  },
  // Add more data sources here as they're implemented
];

export const searchAllSources = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
  const enabledSources = DATA_SOURCES.filter(source => source.enabled);
  const results: GarageSale[] = [];
  
  for (const source of enabledSources) {
    try {
      let sourceResults: GarageSale[] = [];
      
      switch (source.id) {
        case 'gsalr':
          sourceResults = await searchGSALR(zipCode, radius);
          break;
        // Add cases for other sources here
      }
      
      results.push(...sourceResults);
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      // Continue with other sources even if one fails
    }
  }
  
  // Sort by distance if available
  return results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
};
