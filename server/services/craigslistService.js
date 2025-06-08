// Server-side Craigslist service
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

const searchCraigslistGarageSales = async (zipCode) => {
  // Add a minimum delay to ensure loading animation is visible
  const minDelay = 500; // 0.5 seconds minimum delay
  const startTime = Date.now();
  
  // Get location data for the provided zip code
  const location = await getLocationByZipCode(zipCode);
  const baseCity = location.city;
  const baseState = location.stateAbbreviation || location.state;
  const baseZip = zipCode;

  // Generate mock data with realistic addresses based on the provided zip code
  const mockData = [
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
      imageUrl: "https://res.cloudinary.com/djtdrtepl/image/upload/v1749402951/toy_3_a8tcb4.jpg"
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
      imageUrl: "https://res.cloudinary.com/djtdrtepl/image/upload/v1749402945/tools_1_prufpz.webp"
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
      imageUrl: "https://res.cloudinary.com/djtdrtepl/image/upload/v1749402942/games_3_f4iyfn.jpg"
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
      imageUrl: "https://res.cloudinary.com/djtdrtepl/image/upload/v1749402940/comics_1_odtosc.webp"
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
      imageUrl: "https://res.cloudinary.com/djtdrtepl/image/upload/v1749402952/estate_2_ibzohv.jpg"
    }
  ];

  // Transform the mock data to match our GarageSale interface
  const sales = mockData.map((sale, index) => ({
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

  // Calculate remaining time to ensure minimum delay
  const elapsed = Date.now() - startTime;
  if (elapsed < minDelay) {
    await delay(minDelay - elapsed);
  }

  return sales;
};

module.exports = {
  searchCraigslistGarageSales
};
