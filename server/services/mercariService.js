// Server-side Mercari service
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

const searchMercariSales = async (zipCode, radius = 10) => {
  // Add a minimum delay to ensure loading animation is visible
  const minDelay = 500; // 0.5 seconds minimum delay
  const startTime = Date.now();
  
  // Get location data for the provided zip code
  const location = await getLocationByZipCode(zipCode);
  const baseCity = location.city;
  const baseState = location.stateAbbreviation || location.state;
  const baseZip = zipCode;

  // Mock data for Mercari listings
  const mockMercariListings = [
    {
      title: "Retro Video Games – Classic Console Gems",
      price: "$15 - $80",
      date: formatDate(1),
      address: "7443 SW 102nd Ave",
      url: "https://www.mercari.com/",
      description: "Selling classic video games and accessories for NES, SNES, and PlayStation. Includes controllers, cartridges, and memory cards.",
      imageUrl: "https://i.redd.it/d426d0jxlp391.jpg",
      startTime: "10:00",
      endTime: "17:00"
    },
    {
      title: "Trading Card Packs – Pokémon, Yu-Gi-Oh!, MTG",
      price: "$4 - $25+",
      date: formatDate(-1),
      address: "2301 NW 87th St",
      url: "https://www.mercari.com/",
      description: "Large binder of mixed cards and booster packs. Includes a few rares and holographics. Great deal for collectors.",
      imageUrl: "https://i.redd.it/m813cedygu791.jpg",
      startTime: "09:00",
      endTime: "16:00"
    },
    {
      title: "Book Sale – Novels, Biographies, and More",
      price: "$2 - $20",
      date: formatDate(2),
      address: "11850 NE 16th Ave",
      url: "https://www.mercari.com/",
      description: "Downsizing home library. Wide range of genres including mystery, sci-fi, memoirs, and classics. Most in excellent condition.",
      imageUrl: "https://i.redd.it/dsxkl88z7f9b1.jpg",
      startTime: "11:00",
      endTime: "18:00"
    },
    {
      title: "DVD Movie Lot – Action, Comedy, Family Picks",
      price: "$5 - $30",
      date: formatDate(0),
      address: "5631 SW 40th St",
      url: "https://www.mercari.com/",
      description: "Bulk movie sale! Great titles across all genres. Includes boxed sets and collector's editions. Everything tested and clean.",
      imageUrl: "https://preview.redd.it/check-out-my-garage-sale-haul-v0-2atq367gt68d1.jpg?width=640&crop=smart&auto=webp&s=19a80d2fd6ad03fa855ca5733e00d5f73319d4a3",
      startTime: "10:30",
      endTime: "16:30"
    },
    {
      title: "Mystery Artifacts & Curiosities Box",
      price: "$8 - $40",
      date: formatDate(3),
      address: "3499 NW 18th St",
      url: "https://www.mercari.com/",
      description: "Unique and quirky finds: old figurines, brass pieces, coins, and antique-style items. Great conversation starters or decor.",
      imageUrl: "https://preview.redd.it/got-all-these-at-a-yard-sale-for-10-v0-um7gnwfgl8ub1.jpg?width=640&crop=smart&auto=webp&s=dc4ab9600062e05a940b838edaf766af36cedb2d",
      startTime: "09:30",
      endTime: "15:30"
    }
  ];

  // Format the mock data to match the GarageSale interface
  const sales = mockMercariListings.map((listing, index) => ({
    id: generateId('mercari', index),
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
    source: 'Mercari',
    price: listing.price,
    distance: Math.floor(Math.random() * 10) + 1, // Random distance between 1-10
    distanceUnit: 'mi',
    preview: listing.description.substring(0, 100) + '...',
    url: listing.url,
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
  searchMercariSales
};
