import { GarageSale } from '../types';
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://garage-finder-app-production.up.railway.app'
    : 'http://localhost:3001');

/**
 * Search for garage sales from a specific source
 * @param zipCode The zip code to search in
 * @param source The data source to search (gsalr, craigslist, mercari, ebay-local, offerup)
 * @param radius The search radius in miles
 * @returns Promise<GarageSale[]> Array of garage sales
 */
export const searchBySource = async (zipCode: string, source: string, radius: number = 10): Promise<GarageSale[]> => {
  try {
    console.log(`Searching ${source} for garage sales in ${zipCode} with radius ${radius}`);
    const response = await axios.get(`${API_BASE_URL}/api/search`, {
      params: {
        zipcode: zipCode,
        source: source,
        radius: radius
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error searching ${source}:`, error);
    return [];
  }
};

/**
 * Search for garage sales from all sources
 * @param zipCode The zip code to search in
 * @param radius The search radius in miles
 * @returns Promise<GarageSale[]> Array of garage sales
 */
export const searchAllSources = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
  try {
    console.log(`Searching all sources for garage sales in ${zipCode} with radius ${radius}`);
    const response = await axios.get(`${API_BASE_URL}/api/search`, {
      params: {
        zipcode: zipCode,
        radius: radius
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching all sources:', error);
    return [];
  }
};
