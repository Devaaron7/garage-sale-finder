import { GarageSale } from '../types';
import { getLocationByZipCode } from './locationService';

interface MockCraigslistListing {
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
}

// Common zip codes for mock data
const SAMPLE_ZIP_CODES = [
  '33101', // Miami, FL
  '33130', // Miami, FL
  '33139', // Miami Beach, FL
  '33301', // Fort Lauderdale, FL
  '33401'  // West Palm Beach, FL
];

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchCraigslistGarageSales = async (zipCode: string): Promise<GarageSale[]> => {
  // Add a minimum delay to ensure loading animation is visible
  const minDelay = 1500; // 1.5 seconds minimum delay
  const startTime = Date.now();
  
  // Get location data for the provided zip code
  const location = await getLocationByZipCode(zipCode);
  const baseCity = location?.city || 'Miami';
  const baseState = location?.state || 'FL';
  const baseZip = location?.zipCode || '33101';
  
  // Generate dates based on current date
  const today = new Date();
  
  // Calculate remaining time to ensure minimum delay
  const elapsed = Date.now() - startTime;
  if (elapsed < minDelay) {
    await delay(minDelay - elapsed);
  }
  const formatDate = (daysToAdd: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  };

  // Generate mock data with realistic addresses based on the provided zip code
  const mockData: MockCraigslistListing[] = [
    {
      title: `Huge Multi-Family Yard Sale – Furniture, Kids Toys, & More!`,
      price: "$1 - $50",
      date: formatDate(2), // 2 days from now
      address: `123 Main St`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: 'https://www.craigslist.org/about/sites#US',
      description: `Several families participating — we've got everything from kids' bikes, games, kitchenware, small furniture, and more. Come early!`,
      imageUrl: "https://i.redd.it/8sdjd5mrswya1.jpg"
    },
    {
      title: "Garage Cleanout Sale – Power Tools & Garden Gear",
      price: "$10 - $75",
      date: formatDate(-1), // Yesterday
      address: `456 Oak Ave`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: 'https://www.craigslist.org/about/sites#US',
      description: "Selling used power drills, lawn equipment, hand tools, hoses, and car jacks. Some items still new in box. Cash only.",
      imageUrl: "https://preview.redd.it/yard-sale-steal-v0-38spkuwnhf6d1.jpg?width=640&crop=smart&auto=webp&s=71346ec4bd71886d966ef75fe77a69b2f9b7335b"
    },
    {
      title: "College Move-Out – Electronics, Decor & Small Appliances",
      price: "$5 - $40",
      date: formatDate(4), // 4 days from now
      address: `789 College Rd`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: 'https://www.craigslist.org/about/sites#US',
      description: "Just graduated, so everything must go! Selling a mini fridge, desk lamp, speakers, and some dorm wall decor. All in great shape.",
      imageUrl: "https://i.redd.it/hr4zho2gywmz.jpg"
    },
    {
      title: "Comic Books & Collectibles Sale – Huge Inventory",
      price: "$2 - $20+",
      date: formatDate(5), // 5 days from now
      address: `321 Maple Dr`,
      city: baseCity, 
      state: baseState,
      zipCode: baseZip,
      url: 'https://www.craigslist.org/about/sites#US',
      description: "Over 300 comics (Marvel, DC, indie), plus Funko Pops, action figures, and posters. Priced to sell. Great for collectors or kids.",
      imageUrl: "https://preview.redd.it/adz2ps7sxni11.jpg?auto=webp&s=abbc11c8978d05c6efe5324f456042f51f2dd22c"
    },
    {
      title: "Estate Sale – Antiques, Dishes, Rugs & More",
      price: "$10 - $100",
      date: formatDate(0), // Today
      address: `555 Elm St`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: 'https://www.craigslist.org/about/sites#US',
      description: "Fine china, crystalware, handwoven rugs, classic furniture, and wall art. Downsizing and everything must go this weekend.",
      imageUrl: "https://preview.redd.it/estate-sale-help-v0-5ws2qhm2ccvd1.jpg?width=600&format=pjpg&auto=webp&s=b2673509ef7092b12d583f1babd0ef4505729db6"
    }
  ];

  // Transform the mock data to match our GarageSale interface
  const sales: GarageSale[] = mockData.map((sale, index) => ({
    id: `cl-mock-${index}-${Date.now()}`,
    title: sale.title,
    address: sale.address,
    city: sale.city,
    state: sale.state,
    zipCode: sale.zipCode,
    startDate: sale.date,
    endDate: sale.date, // Same as start date for single-day sales
    startTime: '09:00',
    endTime: '17:00',
    description: sale.description,
    imageUrl: sale.imageUrl,
    source: 'Craigslist',
    price: sale.price,
    url: sale.url,
    preview: sale.description.substring(0, 100) + '...',
    photoCount: 1
  }));

  return sales;
};
