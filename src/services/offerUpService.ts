import { GarageSale } from '../types';
import { getLocationByZipCode } from './locationService';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface MockOfferUpListing {
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

// Mock data for OfferUp listings
const url = "https://offerup.com/search?q=";
const mockOfferUpListings: Omit<MockOfferUpListing, 'city' | 'state' | 'zipCode'>[] = [
  {
    title: "Garage Sale – Household Items & Home Goods",
    price: "$1 - $25",
    date: "2025-06-04",
    address: "3111 NW 8th Ave",
    url: url,
    description: "Tons of household goods! Plates, lamps, small appliances, and kitchen tools. All gently used and priced to sell.",
    imageUrl: "https://img.tpt.cloud/nextavenue/uploads/2021/04/Hold-a-Yard-Sale-In-the-Pandemic.inside.1280x720.jpg"
  },
  {
    title: "Home Essentials Sale – Cleanout Special",
    price: "$3 - $30",
    date: "2025-06-07",
    address: "888 NE 79th St",
    url: url,
    description: "Selling general household items including dishes, shelving, side tables, organizers, decor and more. All in good shape.",
    imageUrl: "https://cloudfront-us-east-1.images.arcpublishing.com/tbt/HMJXZDNICNH2FGYTX44DIFOKSQ.jpg"
  },
  {
    title: "Baby Gear & Essentials – Great Condition",
    price: "$5 - $50",
    date: "2025-06-06",
    address: "7520 SW 36th St",
    url: url,
    description: "Selling baby strollers, play mats, bottles, and a crib. Lightly used, clean, and ready for a new home!",
    imageUrl: "https://townsquare.media/site/715/files/2025/03/attachment-garage-sale.jpg?w=780&q=75"
  },
  {
    title: "Kids Toys Blowout – Games, Dolls, and More!",
    price: "$2 - $20",
    date: "2025-06-03",
    address: "1345 NW 62nd St",
    url: url,
    description: "Selling board games, action figures, dolls, puzzles, and stuffed animals. Everything organized and priced to move.",
    imageUrl: "https://www.getorganizedhq.com/wp-content/uploads/2018/05/Garage-Sale-Tips_PostGraphic4.jpg"
  },
  {
    title: "Clothing Sale – Men's, Women's & Kids",
    price: "$1 - $15",
    date: "2025-06-05",
    address: "9871 SW 88th St",
    url: url,
    description: "Big clothing sale! Shirts, pants, jackets, and shoes. All clean and sorted by size. Perfect for thrifting!",
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjY52L5so0HsNe-1bPq-YBB64cO00_OPpiXSq6W0bZQHzB0g2OF13PLCBTr2ZE0NL79K04WIpf4QoqVTmJhxPclk91J48WO_Xa_Lmx1nUYrYJdPq59XNLXM1TCNCL5H5BFip-S6AnYzZAQ/s800/DSCN6545-001.JPG"
  },
  {
    title: "Vintage Collectibles – Rare Finds & Toys",
    price: "$4 - $45",
    date: "2025-06-08",
    address: "1201 Coral Way",
    url: url,
    description: "Action figures, 80s memorabilia, Halloween toys, and retro lunch boxes. Unique collectibles priced to go!",
    imageUrl: "https://dinosaurdracula.com/wp-content/uploads/2014/06/intro.jpg"
  },
  {
    title: "Puzzle Lovers Sale – 1000-Piece Sets & More",
    price: "$3 - $18",
    date: "2025-06-09",
    address: "5421 NW 36th Ave",
    url: url,
    description: "Selling new and gently used puzzles of all sizes — 300 to 1000 pieces. Family-friendly and relaxing fun!",
    imageUrl: "https://images.craigslist.org/d/7853649463/00T0T_eSYjOWn6mBO_0fu0at_600x450.jpg"
  },
  {
    title: "Collectible Toys & Figurines – Limited Editions",
    price: "$6 - $35",
    date: "2025-06-04",
    address: "6330 SW 8th St",
    url: url,
    description: "Selling collectible figurines, toy sets, and boxed action figures. Some rare! Great for display or trade.",
    imageUrl: "https://preview.redd.it/getting-ready-for-the-annual-community-garage-sale-v0-p236mvndgyua1.jpg?width=640&crop=smart&auto=webp&s=33a0538007fca60d7ba16d4d9691c23a67f78153"
  }
];

// Helper function to generate a unique ID
const generateId = (prefix: string, index: number): string => {
  return `${prefix}-${Date.now()}-${index}`;
};

export const searchOfferUpSales = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
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
    const sales: GarageSale[] = mockOfferUpListings.map((listing, index) => ({
      id: generateId('offerup', index),
      title: listing.title,
      address: listing.address,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: listing.date,
      endDate: listing.date, // Same as start date for single-day sales
      startTime: '09:00',
      endTime: '17:00',
      description: listing.description,
      source: 'OfferUp',
      price: listing.price,
      distance: Math.floor(Math.random() * 10) + 1, // Random distance between 1-10
      distanceUnit: 'mi',
      preview: listing.description.substring(0, 100) + '...',
      url: `${listing.url}${baseZip}`,
      imageUrl: listing.imageUrl,
      photoCount: 1
    }));
    
    // Calculate remaining time to ensure minimum delay
    const elapsed = Date.now() - startTime;
    if (elapsed < minDelay) {
      await delay(minDelay - elapsed);
    }
    
    return sales;
  } catch (error) {
    console.error('Error in OfferUp service:', error);
    return [];
  }
};
