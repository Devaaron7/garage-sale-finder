import axios from 'axios';
import { GarageSale } from '../types';

const GSALR_API_BASE = 'https://www.gsalr.com';

export const searchGarageSales = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
  try {
    // Note: GSALR doesn't have a public API, so this is a placeholder
    // In a real implementation, you would need to use a web scraping solution
    // or find if they provide an API for partners
    
    // For now, we'll return mock data
    return [
      {
        id: '1',
        title: 'Estate Sale - Everything Must Go!',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode,
        startDate: '2023-06-01',
        endDate: '2023-06-02',
        startTime: '08:00',
        endTime: '15:00',
        description: 'Moving sale! Furniture, electronics, tools, and more.',
        source: 'GSALR',
        distance: 0.5,
        distanceUnit: 'mi',
        price: 'Free',
        preview: 'Furniture, Electronics, Tools',
        url: `${GSALR_API_BASE}/sale/1`
      },
      {
        id: '2',
        title: 'Community Garage Sale',
        address: '456 Oak Ave',
        city: 'Anytown',
        state: 'CA',
        zipCode,
        startDate: '2023-06-02',
        endDate: '2023-06-02',
        startTime: '09:00',
        endTime: '14:00',
        description: 'Multiple families participating. Something for everyone!',
        source: 'GSALR',
        distance: 1.2,
        distanceUnit: 'mi',
        price: 'Free',
        preview: 'Clothing, Toys, Household Items',
        url: `${GSALR_API_BASE}/sale/2`
      }
    ];
  } catch (error) {
    console.error('Error searching GSALR:', error);
    throw new Error('Failed to fetch garage sales from GSALR');
  }
};
