import axios from 'axios';
import { GarageSale } from '../types';

// This should point to your backend API that will handle the Craigslist scraping
const API_BASE_URL = 'http://localhost:3001/api';

interface CraigslistListing {
  pid?: string;
  id?: string;
  title?: string;
  price?: string;
  date?: string;
  location?: string;
  url?: string;
  description?: string;
  images?: string[];
  imageUrl?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
}

export const searchCraigslistGarageSales = async (city: string): Promise<GarageSale[]> => {
  try {
    // Call our backend API which will handle the Craigslist scraping
    const response = await axios.get(`${API_BASE_URL}/craigslist/search`, {
      params: { city },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    // Transform the Craigslist data to match our GarageSale interface
    const sales: GarageSale[] = response.data.map((sale: CraigslistListing) => {
      // Extract location parts if available
      let address = '';
      let extractedCity = city;
      let state = '';
      
      if (sale.location) {
        // Craigslist locations are often in format "neighborhood / city" or just "city"
        const locationParts = sale.location.split('/');
        address = locationParts[0].trim();
        if (locationParts.length > 1) {
          extractedCity = locationParts[1].trim();
        }
      }
      
      return {
        id: sale.id || sale.pid || `cl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: sale.title || 'Garage Sale',
        address: address || sale.location || 'Address not provided',
        city: extractedCity,
        state: state,
        zipCode: '',  // Craigslist doesn't provide zip code
        startDate: sale.date || new Date().toISOString().split('T')[0],
        endDate: sale.date || new Date().toISOString().split('T')[0],
        startTime: '',  // Craigslist doesn't provide specific times
        endTime: '',
        description: sale.description || '',
        source: 'Craigslist',
        distance: 0,  // Craigslist doesn't provide distance
        distanceUnit: 'mi',
        preview: sale.description ? 
          (sale.description.length > 100 ? sale.description.substring(0, 100) + '...' : sale.description) : 
          '',
        url: sale.url || '',
        imageUrl: sale.imageUrl || (sale.images && sale.images.length > 0 ? sale.images[0] : ''),
        price: sale.price || '',
        photoCount: sale.images ? sale.images.length : 0
      };
    });

    return sales;
  } catch (error) {
    console.error('Error fetching garage sales from Craigslist:', error);
    // Return empty array on error to prevent breaking the UI
    return [];
  }
};
