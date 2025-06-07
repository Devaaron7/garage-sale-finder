import { GarageSale, DataSource } from '../types';
import { searchBySource, searchAllSources as searchAllAPI } from './apiService';

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'gsalr',
    name: 'GSALR',
    url: 'https://www.gsalr.com',
    enabled: true
  },
  {
    id: 'craigslist',
    name: 'Craigslist',
    url: 'https://www.craigslist.org',
    enabled: true
  },
  {
    id: 'mercari',
    name: 'Mercari',
    url: 'https://www.mercari.com',
    enabled: true
  },
  {
    id: 'ebay-local',
    name: 'eBay Local',
    url: 'https://www.ebay.com/local',
    enabled: true
  },
  {
    id: 'offerup',
    name: 'OfferUp',
    url: 'https://www.offerup.com',
    enabled: true
  }
  // Add more data sources here as they're implemented
];

export const searchAllSources = async (location: string, radius: number = 10, selectedSourceIds: string[] = []): Promise<GarageSale[]> => {
  console.log(`Searching with location: ${location}, radius: ${radius}, selected sources:`, selectedSourceIds);
  
  try {
    // If specific sources are selected, fetch them individually and combine the results
    if (selectedSourceIds.length > 0) {
      const sourcesToSearch = DATA_SOURCES.filter(source => 
        source.enabled && selectedSourceIds.includes(source.id)
      );
      
      const results: GarageSale[] = [];
      
      // Make parallel API calls for each selected source
      const promises = sourcesToSearch.map(source => 
        searchBySource(location, source.id, radius)
          .then(sourceResults => {
            console.log(`Received ${sourceResults.length} results from ${source.name}`);
            return sourceResults;
          })
          .catch(error => {
            console.error(`Error fetching from ${source.name}:`, error);
            return [] as GarageSale[];
          })
      );
      
      const allResults = await Promise.all(promises);
      
      // Combine all results
      allResults.forEach(sourceResults => {
        results.push(...sourceResults);
      });
      
      // Sort by distance if available
      return results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else {
      // If no specific sources are selected, fetch all sources at once
      const results = await searchAllAPI(location, radius);
      console.log(`Received ${results.length} total results from all sources`);
      
      // Sort by distance if available
      return results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
  } catch (error) {
    console.error('Error searching all sources:', error);
    return [];
  }
};
