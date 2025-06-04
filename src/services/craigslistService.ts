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

export const searchCraigslistGarageSales = async (zipCode: string): Promise<GarageSale[]> => {
  // Get location data for the provided zip code
  const location = await getLocationByZipCode(zipCode);
  const baseCity = location?.city || 'Miami';
  const baseState = location?.state || 'FL';
  const baseZip = location?.zipCode || '33101';
  // Generate dates based on current date
  const today = new Date();
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
      url: `https://${baseCity.toLowerCase().replace(/\s+/g, '')}.craigslist.org/search/gms`,
      description: `Several families participating — we've got everything from kids' bikes, games, kitchenware, small furniture, and more. Come early!`,
      imageUrl: "https://www.dropbox.com/s/example/multifamily.jpg?raw=1"
    },
    {
      title: "Garage Cleanout Sale – Power Tools & Garden Gear",
      price: "$10 - $75",
      date: formatDate(-1), // Yesterday
      address: `456 Oak Ave`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: `https://${baseCity.toLowerCase().replace(/\s+/g, '')}.craigslist.org/search/gms`,
      description: "Selling used power drills, lawn equipment, hand tools, hoses, and car jacks. Some items still new in box. Cash only.",
      imageUrl: "https://www.dropbox.com/s/example/tools.jpg?raw=1"
    },
    {
      title: "College Move-Out – Electronics, Decor & Small Appliances",
      price: "$5 - $40",
      date: formatDate(4), // 4 days from now
      address: `789 College Rd`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: `https://${baseCity.toLowerCase().replace(/\s+/g, '')}.craigslist.org/search/gms`,
      description: "Just graduated, so everything must go! Selling a mini fridge, desk lamp, speakers, and some dorm wall decor. All in great shape.",
      imageUrl: "https://www.dropbox.com/s/example/college.jpg?raw=1"
    },
    {
      title: "Comic Books & Collectibles Sale – Huge Inventory",
      price: "$2 - $20+",
      date: formatDate(5), // 5 days from now
      address: `321 Maple Dr`,
      city: baseCity, 
      state: baseState,
      zipCode: baseZip,
      url: `https://${baseCity.toLowerCase().replace(/\s+/g, '')}.craigslist.org/search/gms`,
      description: "Over 300 comics (Marvel, DC, indie), plus Funko Pops, action figures, and posters. Priced to sell. Great for collectors or kids.",
      imageUrl: "https://www.dropbox.com/s/example/comics.jpg?raw=1"
    },
    {
      title: "Estate Sale – Antiques, Dishes, Rugs & More",
      price: "$10 - $100",
      date: formatDate(0), // Today
      address: `555 Elm St`,
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      url: `https://${baseCity.toLowerCase().replace(/\s+/g, '')}.craigslist.org/search/gms`,
      description: "Fine china, crystalware, handwoven rugs, classic furniture, and wall art. Downsizing and everything must go this weekend.",
      imageUrl: "https://www.dropbox.com/s/example/antiques.jpg?raw=1"
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
