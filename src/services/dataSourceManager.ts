import { GarageSale, DataSource } from '../types';
import { searchGarageSales as searchGSALR } from './gsalrService';
import { searchCraigslistGarageSales } from './craigslistService';
import { searchMercariSales } from './mercariService';
import { searchEbayLocalSales } from './ebayLocalService';
import { searchOfferUpSales } from './offerUpService';

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
  // Filter sources by both enabled status and selected sources
  const sourcesToSearch = DATA_SOURCES.filter(source => 
    source.enabled && 
    (selectedSourceIds.length === 0 || selectedSourceIds.includes(source.id))
  );
  const results: GarageSale[] = [];
  
  for (const source of sourcesToSearch) {
    try {
      let sourceResults: GarageSale[] = [];
      
      switch (source.id) {
        case 'gsalr':
          console.log(`Searching GSALR with location: ${location}`);
          sourceResults = await searchGSALR(location, radius);
          break;
        case 'craigslist':
          console.log(`Searching Craigslist with city: ${location}`);
          sourceResults = await searchCraigslistGarageSales(location);
          break;
        case 'mercari':
          console.log(`Searching Mercari with location: ${location}`);
          sourceResults = await searchMercariSales(location, radius);
          break;
        case 'ebay-local':
          console.log(`Searching eBay Local with location: ${location}`);
          sourceResults = await searchEbayLocalSales(location, radius);
          break;
        case 'offerup':
          console.log(`Searching OfferUp with location: ${location}`);
          sourceResults = await searchOfferUpSales(location, radius);
          break;
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
