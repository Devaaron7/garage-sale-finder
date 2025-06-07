// Server-side OfferUp service
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

const searchOfferUpSales = async (zipCode, radius = 10) => {
  // Add a minimum delay to ensure loading animation is visible
  const minDelay = 500; // 0.5 seconds minimum delay
  const startTime = Date.now();
  
  // Get location data for the provided zip code
  const location = await getLocationByZipCode(zipCode);
  const baseCity = location.city;
  const baseState = location.stateAbbreviation || location.state;
  const baseZip = zipCode;

  // Mock data for OfferUp listings
  const mockOfferUpListings = [
    {
      title: "Multi-Family Garage Sale - Something for Everyone!",
      price: "$1 - $100",
      date: formatDate(1),
      address: "5280 Community Circle",
      description: "Three families combining for one big sale! Furniture, kitchen items, toys, clothes, tools, and much more. New items added throughout the day.",
      imageUrl: "https://preview.redd.it/multi-family-sale-v0-f7g9h8i7j6k5l4m3n2o1p0.jpg?width=640&crop=smart&auto=webp&s=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      startTime: "07:00",
      endTime: "15:00"
    },
    {
      title: "Craft Supplies & Hobby Materials Sale",
      price: "$3 - $40",
      date: formatDate(2),
      address: "1470 Creative Way",
      description: "Huge selection of craft supplies! Fabric, yarn, beads, scrapbooking materials, art supplies, and more. Many items still new in packaging.",
      imageUrl: "https://preview.redd.it/craft-supplies-sale-v0-f7g9h8i7j6k5l4m3n2o1p0.jpg?width=640&crop=smart&auto=webp&s=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      startTime: "09:00",
      endTime: "16:00"
    },
    {
      title: "Kitchen & Dining Essentials Sale",
      price: "$5 - $75",
      date: formatDate(0),
      address: "3692 Culinary Court",
      description: "Quality kitchenware including small appliances, cookware, bakeware, serving pieces, and gadgets. Many name brands like KitchenAid, Cuisinart, and more.",
      imageUrl: "https://preview.redd.it/kitchen-sale-v0-f7g9h8i7j6k5l4m3n2o1p0.jpg?width=640&crop=smart&auto=webp&s=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      startTime: "08:30",
      endTime: "15:30"
    },
    {
      title: "Home Renovation Leftovers & Building Materials",
      price: "$10 - $200",
      date: formatDate(3),
      address: "8024 Builder Boulevard",
      description: "Leftover materials from recent renovations. Includes tile, hardwood flooring, light fixtures, cabinet hardware, paint, and more. All priced below retail.",
      imageUrl: "https://preview.redd.it/renovation-sale-v0-f7g9h8i7j6k5l4m3n2o1p0.jpg?width=640&crop=smart&auto=webp&s=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      startTime: "07:30",
      endTime: "14:30"
    },
    {
      title: "Designer Clothing & Accessories - High-End Sale",
      price: "$20 - $300",
      date: formatDate(-1),
      address: "6137 Luxury Lane",
      description: "Curated collection of designer clothing, handbags, shoes, and accessories. Many items barely worn or new with tags. Brands include Coach, Michael Kors, Kate Spade, and more.",
      imageUrl: "https://preview.redd.it/designer-sale-v0-f7g9h8i7j6k5l4m3n2o1p0.jpg?width=640&crop=smart&auto=webp&s=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      startTime: "10:00",
      endTime: "17:00"
    }
  ];

  // Format the mock data to match the GarageSale interface
  const sales = mockOfferUpListings.map((listing, index) => ({
    id: generateId('offerup', index),
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
    source: 'OfferUp',
    price: listing.price,
    distance: Math.floor(Math.random() * 10) + 1, // Random distance between 1-10
    distanceUnit: 'mi',
    preview: listing.description.substring(0, 100) + '...',
    url: 'https://www.offerup.com',
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
  searchOfferUpSales
};
