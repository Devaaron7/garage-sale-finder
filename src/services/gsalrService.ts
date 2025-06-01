import axios from 'axios';
import { GarageSale } from '../types';

// This should point to your backend API that will handle the web scraping
// In development, this will proxy to http://localhost:3001
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

interface GSALRResponse {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  description: string;
  distance: string;
  items?: string[];
  url: string;
}

export const searchGarageSales = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
  try {
    // Call our backend API which will handle the web scraping
    const response = await axios.get(`${API_BASE_URL}/gsalr/search`, {
      params: { zipCode },  // Removed radius as it's fixed in the backend
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    // The backend now returns a direct array of sales
    const sales: GarageSale[] = response.data.map((sale: GSALRResponse) => ({
      id: sale.id,
      title: sale.title,
      address: sale.address,
      city: sale.city,
      state: sale.state,
      zipCode: sale.zip,
      startDate: sale.start_date,
      endDate: sale.end_date,
      startTime: sale.start_time,
      endTime: sale.end_time,
      description: sale.description,
      source: 'GSALR',
      distance: parseFloat(sale.distance.replace(/[^0-9.]/g, '') || '0'),
      distanceUnit: sale.distance.includes('mi') ? 'mi' : 'km',
      preview: sale.items ? sale.items.join(', ') : '',
      url: sale.url.startsWith('http') ? sale.url : `https://www.gsalr.com${sale.url}`,
      imageUrl: '' // Added missing imageUrl field required by the GarageSale interface
    }));

    return sales;
  } catch (error) {
    console.error('Error fetching garage sales from GSALR:', error);
    // Return empty array on error to prevent breaking the UI
    return [];
  }
};
