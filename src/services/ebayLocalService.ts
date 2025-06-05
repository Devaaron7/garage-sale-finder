import { GarageSale } from '../types';
import { getLocationByZipCode } from './locationService';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface MockEbayLocalListing {
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

// Mock data for eBay Local listings
const mockEbayLocalListings: Omit<MockEbayLocalListing, 'city' | 'state' | 'zipCode'>[] = [
  {
    title: "Sega Genesis & Xbox Game Collection",
    price: "$10 - $60",
    date: "2025-06-04",
    address: "1451 NW 36th St",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Classic Sega titles and original Xbox games. All discs clean and playable. Great for retro collectors!",
    imageUrl: "https://i.redd.it/lbjqyzqjku011.jpg",
    startTime: "10:00",
    endTime: "18:00"
  },
  {
    title: "Gently Used Men's & Women's Clothing",
    price: "$5 - $25",
    date: "2025-06-06",
    address: "6325 SW 23rd St",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Selling name-brand jeans, jackets, dresses, and shoes. All items washed and in good condition. Sizes vary.",
    imageUrl: "https://preview.redd.it/me2u8hm9tpo91.jpg?width=640&crop=smart&auto=webp&s=d4f051538dfdd67dc1c4e16c6012a13aeb0c4eb3",
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    title: "Camping Equipment – Tents, Gear & Outdoor Supplies",
    price: "$12 - $75",
    date: "2025-06-05",
    address: "4217 NW 17th Ave",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Selling tents, lanterns, sleeping bags, and a portable grill. Most gear is gently used and perfect for summer trips.",
    imageUrl: "https://preview.redd.it/if-you-havent-been-yet-i-highly-recommend-checking-out-your-v0-v7vqer5xcimb1.jpg?width=640&crop=smart&auto=webp&s=02de7f934557c9a9c03bf2eb763a2b0849c3645a",
    startTime: "08:00",
    endTime: "15:00"
  },
  {
    title: "Magic: The Gathering Cards – Bulk & Rares",
    price: "$8 - $40+",
    date: "2025-06-03",
    address: "8100 SW 107th Ave",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Huge stack of MTG cards including lands, creatures, spells, and rares. Great for players or resellers.",
    imageUrl: "https://preview.redd.it/having-a-garage-sale-and-trying-to-spread-some-love-v0-8yhjxqbtrn9b1.jpg?width=640&crop=smart&auto=webp&s=9322c4548f25ff0067ecb603f82831d47809e1d4",
    startTime: "11:00",
    endTime: "19:00"
  },
  {
    title: "Skylanders Toys & Portals – Full Sets",
    price: "$5 - $35",
    date: "2025-06-08",
    address: "1920 NW 112th Ave",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Complete Skylanders toy sets including portals, figures, and game discs. Most still in great condition!",
    imageUrl: "https://i.redd.it/garage-sale-haul-40-v0-55pkkmwgsmsb1.jpg?width=3681&format=pjpg&auto=webp&s=37e00117c7b961df4a3d87678544126a9f6d55a9",
    startTime: "09:30",
    endTime: "16:30"
  },
  {
    title: "Vintage CDs – Rock, Jazz, and Soundtracks",
    price: "$2 - $20",
    date: "2025-06-09",
    address: "2001 Biscayne Blvd",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Selling a big box of classic CDs. Includes 90s rock, jazz albums, and movie soundtracks. Clean and playable.",
    imageUrl: "https://i.redd.it/my-cd-found-in-a-garage-sale-v0-o3qqpjubt9ib1.jpg?width=4028&format=pjpg&auto=webp&s=e3337d0dc3a4e2c1bfd4573b9bd843814bf515b5",
    startTime: "10:00",
    endTime: "17:00"
  },
  {
    title: "PlayStation 3 Games – Huge Bundle",
    price: "$6 - $45",
    date: "2025-06-07",
    address: "2651 SW 37th Ave",
    url: "https://www.ebay.com/sch/i.html?_nkw=",
    description: "Selling over 20 PS3 games including RPGs, action, and sports. All games tested and working perfectly.",
    imageUrl: "https://i.imgur.com/puNJcHF.jpg",
    startTime: "09:00",
    endTime: "18:00"
  }
];

// Helper function to generate a unique ID
const generateId = (prefix: string, index: number): string => {
  return `${prefix}-${index}-${Date.now()}`;
};

export const searchEbayLocalSales = async (zipCode: string, radius: number = 10): Promise<GarageSale[]> => {
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
    const sales: GarageSale[] = mockEbayLocalListings.map((listing, index) => ({
      id: generateId('ebay', index),
      title: listing.title,
      address: listing.address,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: listing.date,
      endDate: listing.date, // Same as start date for single-day sales
      startTime: listing.startTime || '10:00',
      endTime: listing.endTime || '17:00',
      description: listing.description,
      source: 'eBay Local',
      price: listing.price,
      distance: Math.floor(Math.random() * 10) + 1, // Random distance between 1-10
      distanceUnit: 'mi',
      preview: listing.description.substring(0, 100) + '...',
      url: listing.url + baseZip,
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
    console.error('Error in eBay Local service:', error);
    return [];
  }
};
