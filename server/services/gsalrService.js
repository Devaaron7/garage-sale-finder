// Server-side GSALR service
const { getLocationByZipCode } = require('./locationService');

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate dates based on current date
const formatDate = (daysToAdd) => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

const searchGSALR = async (zipCode, radius = 10) => {
  // Add a minimum delay to ensure loading animation is visible
  const minDelay = 500; // 0.5 seconds minimum delay
  const startTime = Date.now();
  
  // Get location data for the provided zip code
  const location = getLocationByZipCode(zipCode);
  const baseCity = location?.city || 'Miami';
  const baseState = location?.state || 'FL';
  const baseZip = zipCode || '33101';

  // Generate mock data with realistic addresses based on the provided zip code
  const mockData = [
    {
      id: `gsalr-1-${Date.now()}`,
      title: "Community Yard Sale - Multiple Families",
      address: "1234 Neighborhood Lane",
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: formatDate(1),
      endDate: formatDate(2),
      startTime: "08:00",
      endTime: "16:00",
      description: "Annual community yard sale with over 20 families participating. Furniture, toys, clothes, electronics, and much more. Rain or shine!",
      image: "https://i.redd.it/i-got-all-this-at-a-yard-sale-for-5-v0-rnbwx4nnhj0c1.jpg?width=640&crop=smart&auto=webp&s=9e8e1a4f5b7a6e2d0f9c8b7a6e5d4c3b2a1f0e9d",
      url: "https://www.gsalr.com",
      distance: 2.3,
      distanceUnit: "mi",
      photoCount: 4,
      source: "GSALR"
    },
    {
      id: `gsalr-2-${Date.now()}`,
      title: "Moving Sale - Everything Must Go!",
      address: "5678 Relocation Street",
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: formatDate(0),
      endDate: formatDate(0),
      startTime: "07:30",
      endTime: "14:00",
      description: "Moving cross-country and can't take it all! Quality furniture, kitchen appliances, home decor, and garden tools. All reasonable offers accepted.",
      image: "https://preview.redd.it/yard-sale-haul-v0-rnbwx4nnhj0c1.jpg?width=640&crop=smart&auto=webp&s=9e8e1a4f5b7a6e2d0f9c8b7a6e5d4c3b2a1f0e9d",
      url: "https://www.gsalr.com",
      distance: 3.7,
      distanceUnit: "mi",
      photoCount: 2,
      source: "GSALR"
    },
    {
      id: `gsalr-3-${Date.now()}`,
      title: "Estate Sale - Antiques & Collectibles",
      address: "9012 Heritage Avenue",
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: formatDate(3),
      endDate: formatDate(4),
      startTime: "09:00",
      endTime: "17:00",
      description: "Estate sale featuring vintage furniture, fine china, crystal, artwork, and collectibles. Many items from the 1940s-1970s. Professional appraisers on site.",
      image: "https://preview.redd.it/estate-sale-find-v0-rnbwx4nnhj0c1.jpg?width=640&crop=smart&auto=webp&s=9e8e1a4f5b7a6e2d0f9c8b7a6e5d4c3b2a1f0e9d",
      url: "https://www.gsalr.com",
      distance: 5.2,
      distanceUnit: "mi",
      photoCount: 8,
      source: "GSALR"
    },
    {
      id: `gsalr-4-${Date.now()}`,
      title: "Garage Sale - Baby & Kids Items",
      address: "3456 Family Circle",
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: formatDate(2),
      endDate: formatDate(2),
      startTime: "08:30",
      endTime: "15:30",
      description: "Outgrown baby and children's items in excellent condition. Clothes (0-5T), toys, books, strollers, high chairs, and more. Everything clean and well-maintained.",
      image: "https://preview.redd.it/kids-yard-sale-v0-rnbwx4nnhj0c1.jpg?width=640&crop=smart&auto=webp&s=9e8e1a4f5b7a6e2d0f9c8b7a6e5d4c3b2a1f0e9d",
      url: "https://www.gsalr.com",
      distance: 1.8,
      distanceUnit: "mi",
      photoCount: 3,
      source: "GSALR"
    },
    {
      id: `gsalr-5-${Date.now()}`,
      title: "Downsizing Sale - Quality Household Items",
      address: "7890 Simplify Street",
      city: baseCity,
      state: baseState,
      zipCode: baseZip,
      startDate: formatDate(-1),
      endDate: formatDate(0),
      startTime: "09:00",
      endTime: "16:00",
      description: "Downsizing after 30 years! Quality furniture, home decor, kitchen items, tools, and holiday decorations. Everything priced to sell.",
      image: "https://preview.redd.it/downsizing-sale-v0-rnbwx4nnhj0c1.jpg?width=640&crop=smart&auto=webp&s=9e8e1a4f5b7a6e2d0f9c8b7a6e5d4c3b2a1f0e9d",
      url: "https://www.gsalr.com",
      distance: 4.5,
      distanceUnit: "mi",
      photoCount: 5,
      source: "GSALR"
    }
  ];

  // Calculate remaining time to ensure minimum delay
  const elapsed = Date.now() - startTime;
  if (elapsed < minDelay) {
    await delay(minDelay - elapsed);
  }

  return mockData;
};

module.exports = {
  searchGSALR
};
