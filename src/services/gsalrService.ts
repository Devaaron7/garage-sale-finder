import { GarageSale } from '../types';
import { getLocationByZipCode } from './locationService';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface MockGSALRListing {
  title: string;
  price: string;
  date: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  url: string;
  description: string;
  imageUrl: string;
  startTime?: string;
  endTime?: string;
}

// Mock data for GSALR listings
const mockGSALRListings: Omit<MockGSALRListing, 'city' | 'state' | 'zipCode'>[] = [
  {
    title: "Massive Neighborhood Garage Sale",
    price: "$1 - $50",
    date: "2025-06-04",
    address: "1887 SW 122nd Ave",
    url: "https://www.gsalr.com/",
    description: "Over 10 homes participating! Clothes, toys, small furniture, decor, tools, and more. Great finds across the block.",
    imageUrl: "https://www.dropbox.com/s/example/neighborhood-sale.jpg?raw=1",
    startTime: "08:00",
    endTime: "14:00"
  },
  {
    title: "Crafts & Art Supplies Blowout Sale",
    price: "$2 - $30",
    date: "2025-06-06",
    address: "7632 NW 2nd Ct",
    url: "https://www.gsalr.com/",
    description: "Downsizing my home studio — paints, markers, sketchpads, easels, and more. Everything gently used and priced to move.",
    imageUrl: "https://www.dropbox.com/s/example/art-supplies.jpg?raw=1",
    startTime: "09:00",
    endTime: "15:00"
  },
  {
    title: "Family Yard Sale – Toys, Games, Clothing",
    price: "$3 - $25",
    date: "2025-06-03",
    address: "4555 SW 87th Pl",
    url: "https://www.gsalr.com/",
    description: "Kids growing fast! Selling games, action figures, dolls, strollers, baby clothes, and a playpen. All clean and organized.",
    imageUrl: "https://www.dropbox.com/s/example/kids-sale.jpg?raw=1",
    startTime: "08:30",
    endTime: "16:00"
  },
  {
    title: "Home Decor & Lighting Sale",
    price: "$5 - $45",
    date: "2025-06-08",
    address: "9200 NE 10th Ave",
    url: "https://www.gsalr.com/",
    description: "Selling gently used floor lamps, framed art, rugs, mirrors, and accent pieces. Great for redecorating on a budget.",
    imageUrl: "https://www.dropbox.com/s/example/home-decor.jpg?raw=1",
    startTime: "10:00",
    endTime: "17:00"
  },
  {
    title: "Books, DVDs & Collectibles Sale",
    price: "$1 - $15",
    date: "2025-06-05",
    address: "1043 NW 81st St",
    url: "https://www.gsalr.com/",
    description: "Hundreds of novels, vintage DVDs, manga, and collectible items. Discounts for bundles. Great for media lovers.",
    imageUrl: "https://www.dropbox.com/s/example/media.jpg?raw=1",
    startTime: "09:30",
    endTime: "15:30"
  },
  {
    title: "Fitness & Outdoor Gear Sale",
    price: "$10 - $60",
    date: "2025-06-07",
    address: "3401 SW 67th Ave",
    url: "https://www.gsalr.com/",
    description: "Treadmill, dumbbells, yoga mats, tents, and camping gear. All in good condition. Perfect for getting active this summer.",
    imageUrl: "https://www.dropbox.com/s/example/fitness-gear.jpg?raw=1",
    startTime: "07:00",
    endTime: "13:00"
  }
];

// Helper function to generate a unique ID
const generateId = (prefix: string, index: number): string => {
  return `${prefix}-${index}-${Date.now()}`;
};

export const searchGarageSales = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
  // Add a small delay to simulate network request
  const minDelay = 1500; // 1.5 seconds minimum delay
  const startTime = Date.now();
  
  try {
    // Get location data for the provided zip code
    const location = await getLocationByZipCode(zipCode);
    const baseCity = location?.city || 'Miami';
    const baseState = location?.state || 'FL';
    const baseZip = location?.zipCode || '33101';
    
    // Format the mock data to match the GarageSale interface
    const sales: GarageSale[] = mockGSALRListings.map((listing, index) => {
      // Use the provided address or generate one based on the location
      const address = listing.address || `${1000 + index} ${baseCity} St`;
      
      return {
        id: generateId('gsalr', index),
        title: listing.title,
        address: address,
        city: baseCity,
        state: baseState,
        zipCode: baseZip,
        startDate: listing.date,
        endDate: listing.date, // Same as start date for single-day sales
        startTime: listing.startTime || '09:00',
        endTime: listing.endTime || '17:00',
        description: listing.description,
        source: 'GSALR',
        price: listing.price,
        distance: Math.floor(Math.random() * 10) + 1, // Random distance between 1-10
        distanceUnit: 'mi',
        preview: listing.description.substring(0, 100) + '...',
        url: listing.url,
        imageUrl: listing.imageUrl,
        photoCount: 1
      };
    });
    
    // Calculate remaining time to ensure minimum delay
    const elapsed = Date.now() - startTime;
    if (elapsed < minDelay) {
      await delay(minDelay - elapsed);
    }
    
    return sales;
  } catch (error) {
    console.error('Error in GSALR service:', error);
    return [];
  }
};
