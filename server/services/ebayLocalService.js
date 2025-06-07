// Server-side eBay Local service
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

// Helper function to generate a unique ID
const generateId = (prefix, index) => {
  return `${prefix}-${index}-${Date.now()}`;
};

const searchEbayLocalSales = async (zipCode, radius = 10) => {
  // Add a minimum delay to ensure loading animation is visible
  const minDelay = 500; // 0.5 seconds minimum delay
  const startTime = Date.now();
  
  // Get location data for the provided zip code
  const location = await getLocationByZipCode(zipCode);
  const baseCity = location.city;
  const baseState = location.stateAbbreviation || location.state;
  const baseZip = zipCode;

  // Mock data for eBay Local listings
  const mockEbayListings = [
    {
      title: "Vintage Furniture & Home Decor Sale",
      price: "$20 - $200",
      date: formatDate(2),
      address: "8765 Retro Lane",
      description: "Mid-century modern furniture, vintage lamps, retro wall art, and decorative items from the 50s-70s. Some restoration needed on select pieces.",
      imageUrl: "https://i.redd.it/vintage-yard-sale-finds-v0-dkw6tz7oe1x91.jpg?width=640&crop=smart&auto=webp&s=b6c2b4b6e2d0f9c8b7a6e5d4c3b2a1f0e9d8c7b6",
      startTime: "09:00",
      endTime: "16:00"
    },
    {
      title: "Tools & Workshop Equipment Sale",
      price: "$15 - $150",
      date: formatDate(1),
      address: "4321 Workshop Way",
      description: "Quality power tools, hand tools, workbenches, and shop equipment. Many name brands including DeWalt, Milwaukee, and Craftsman. Most in excellent condition.",
      imageUrl: "https://preview.redd.it/tool-sale-haul-v0-dkw6tz7oe1x91.jpg?width=640&crop=smart&auto=webp&s=b6c2b4b6e2d0f9c8b7a6e5d4c3b2a1f0e9d8c7b6",
      startTime: "08:00",
      endTime: "15:00"
    },
    {
      title: "Electronics & Tech Garage Sale",
      price: "$10 - $100",
      date: formatDate(0),
      address: "1357 Circuit Drive",
      description: "Computers, monitors, tablets, speakers, and various tech accessories. Some items need minor repairs, others work perfectly. Great for tech enthusiasts.",
      imageUrl: "https://preview.redd.it/electronics-yard-sale-v0-dkw6tz7oe1x91.jpg?width=640&crop=smart&auto=webp&s=b6c2b4b6e2d0f9c8b7a6e5d4c3b2a1f0e9d8c7b6",
      startTime: "10:00",
      endTime: "17:00"
    },
    {
      title: "Sporting Goods & Outdoor Equipment",
      price: "$5 - $120",
      date: formatDate(3),
      address: "2468 Active Avenue",
      description: "Camping gear, fishing equipment, exercise machines, bikes, and sports equipment. Perfect for outdoor enthusiasts looking for deals on quality gear.",
      imageUrl: "https://preview.redd.it/sporting-goods-sale-v0-dkw6tz7oe1x91.jpg?width=640&crop=smart&auto=webp&s=b6c2b4b6e2d0f9c8b7a6e5d4c3b2a1f0e9d8c7b6",
      startTime: "08:30",
      endTime: "16:30"
    },
    {
      title: "Vintage Clothing & Accessories Sale",
      price: "$2 - $50",
      date: formatDate(-1),
      address: "9753 Fashion Boulevard",
      description: "Curated collection of vintage clothing, shoes, handbags, and jewelry from the 60s-90s. Many designer items and unique pieces for collectors.",
      imageUrl: "https://preview.redd.it/vintage-clothing-sale-v0-dkw6tz7oe1x91.jpg?width=640&crop=smart&auto=webp&s=b6c2b4b6e2d0f9c8b7a6e5d4c3b2a1f0e9d8c7b6",
      startTime: "11:00",
      endTime: "18:00"
    }
  ];

  // Format the mock data to match the GarageSale interface
  const sales = mockEbayListings.map((listing, index) => ({
    id: generateId('ebay', index),
    title: listing.title,
    address: listing.address,
    city: baseCity,
    state: baseState,
    zipCode: baseZip,
    startDate: listing.date,
    endDate: listing.date, // Same as start date for single-day sales
    startTime: listing.startTime || '09:00',
    endTime: listing.endTime || '17:00',
    description: listing.description,
    source: 'eBay Local',
    price: listing.price,
    distance: Math.floor(Math.random() * 10) + 1, // Random distance between 1-10
    distanceUnit: 'mi',
    preview: listing.description.substring(0, 100) + '...',
    url: 'https://www.ebay.com/local',
    imageUrl: listing.imageUrl,
    photoCount: 1
  }));

  // Calculate remaining time to ensure minimum delay
  const elapsed = Date.now() - startTime;
  if (elapsed < minDelay) {
    await delay(minDelay - elapsed);
  }

  return sales;
};

module.exports = {
  searchEbayLocalSales
};
