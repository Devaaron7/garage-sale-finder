const express = require('express');
const cors = require('cors');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { ServiceBuilder } = require('selenium-webdriver/chrome');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Chrome options
const chromeOptions = new chrome.Options();

// Basic Chrome options for better compatibility
chromeOptions.addArguments([
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--window-size=1920,1080',
  '--start-maximized',
  '--disable-extensions',
  '--disable-popup-blocking',
  '--disable-notifications',
  '--disable-infobars'
]);

// Run in non-headless mode for debugging
console.log('Running Chrome in non-headless mode for debugging');
// Uncomment the line below to enable headless mode when everything works
// chromeOptions.addArguments('--headless=new');

// Set Chrome binary path if needed (uncomment and update the path)
// chromeOptions.setChromeBinaryPath('C:/Program Files/Google/Chrome/Application/chrome.exe');

// GSALR Scraper using Selenium
async function scrapeGSALR(zipCode, radius = 10) {
  let driver;
  try {
    console.log('Initializing Chrome WebDriver...');
    try {
      const builder = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions);
      
      // Set the path to chromedriver if needed (uncomment and update the path)
      // builder.setChromeService(new ServiceBuilder('path/to/chromedriver'));
      
      driver = await builder.build();
      console.log('WebDriver initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebDriver:', error);
      if (error.message.includes('This version of ChromeDriver only supports Chrome version')) {
        console.error('ChromeDriver version mismatch. Please update your Chrome browser or ChromeDriver.');
      }
      console.error('Make sure Chrome browser is installed and up to date.');
      console.error('You may need to install ChromeDriver: https://chromedriver.chromium.org/downloads');
      throw error;
    }

    // Navigate to GSALR homepage
    console.log('Navigating to GSALR homepage...');
    await driver.get('https://www.gsalr.com');
    
    // Take a screenshot of the homepage
    const homeScreenshot = await driver.takeScreenshot();
    console.log('Homepage screenshot taken');
    
    // Find and fill in the zip code input
    console.log('Looking for zip code input...');
    const zipInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@class='city-loc-set']")),
      10000
    ).catch(err => {
      console.error('Error finding zip code input:', err);
      throw err;
    });
    
    console.log('Found zip code input, entering zip code...');
    await zipInput.clear();
    await zipInput.sendKeys(zipCode);
    
    // Take a screenshot after entering zip code
    const zipEnteredScreenshot = await driver.takeScreenshot();
    console.log('Screenshot after entering zip code taken');
    
    // Submit the form
    console.log('Submitting form...');
    await zipInput.submit();
    
    // Wait for results to load with a longer timeout
    console.log('Waiting for results to load...');
    const searchResultsSelector = By.xpath("//div[contains(@class, 'listing')]");
    await driver.wait(
      until.elementLocated(searchResultsSelector),
      15000
    ).catch(async (err) => {
      console.error('Error waiting for search results:', err);
      const currentUrl = await driver.getCurrentUrl();
      console.log('Current URL:', currentUrl);
      const pageSource = await driver.getPageSource();
      console.log('Page source length:', pageSource.length);
      
      // Take a screenshot of the current page
      const errorScreenshot = await driver.takeScreenshot();
      console.log('Error screenshot taken');
      
      throw err;
    });
    
    // Get all listing elements with more permissive selector
    console.log('Search results loaded, finding listings...');
    const sales = [];
    const listingElements = await driver.findElements(searchResultsSelector)
      .catch(err => {
        console.error('Error finding listing elements:', err);
        return [];
      });
    
    console.log(`Found ${listingElements.length} listings`);
    
    // Log the HTML of the first listing for debugging
    if (listingElements.length > 0) {
      const firstListingHtml = await listingElements[0].getAttribute('outerHTML');
      console.log('First listing HTML:', firstListingHtml);
    }
    
    for (let i = 0; i < listingElements.length; i++) {
      try {
        const listing = listingElements[i];
        
        // Extract sale information
        const title = await listing.findElement(By.css('h4 a')).getText().catch(() => '');
        const address = await listing.findElement(By.css('.address')).getText().catch(() => '');
        const location = await listing.findElement(By.css('.location')).getText().catch(() => '');
        const [city, stateZip] = location.split(',').map(s => s.trim());
        const [state, zip] = stateZip ? stateZip.split(' ') : ['', ''];
        
        // Get date and time information
        const dateTimeElement = await listing.findElement(By.css('.date-time')).catch(() => null);
        let dateRange = '';
        let timeRange = '';
        
        if (dateTimeElement) {
          const dateTimeText = await dateTimeElement.getText();
          [dateRange, timeRange] = dateTimeText.split('•').map(s => s.trim());
        }
        
        let startDate = '';
        let endDate = '';
        let startTime = '';
        let endTime = '';
        
        // Parse date range (e.g., "Jun 1 - Jun 2" or "Jun 1")
        if (dateRange) {
          const dates = dateRange.split('-').map(d => d.trim());
          startDate = dates[0];
          endDate = dates[1] || dates[0];
        }
        
        // Parse time range (e.g., "8:00 AM - 3:00 PM")
        if (timeRange) {
          const times = timeRange.split('-').map(t => t.trim());
          if (times.length === 2) {
            startTime = times[0];
            endTime = times[1];
          }
        }
        
        // Get description and other details
        const description = await listing.findElement(By.css('.description')).getText().catch(() => '');
        const distanceText = await listing.findElement(By.css('.distance')).getText().catch(() => '');
        const url = await listing.findElement(By.css('h4 a')).getAttribute('href').catch(() => '');
        
        // Extract items for sale (if available)
        const items = [];
        const itemElements = await listing.findElements(By.css('.tags .tag')).catch(() => []);
        
        for (const item of itemElements) {
          const itemText = await item.getText().catch(() => '');
          if (itemText) items.push(itemText);
        }
        
        // Get price if available
        const price = await listing.findElement(By.css('.price')).getText().catch(() => 'Free');
        
        sales.push({
          id: url ? url.split('/').pop() : `sale-${i}`,
          title: title || 'Garage Sale',
          address: address || '',
          city: city || '',
          state: state || '',
          zip: zip || '',
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          description: description || 'No description available',
          distance: distanceText,
          price: price,
          items: items.length > 0 ? items : undefined,
          url: url.startsWith('http') ? url : `https://www.gsalr.com${url}`
        });
      } catch (error) {
        console.error(`Error processing sale item ${i}:`, error);
        continue;
      }
    }
    
    return sales;
  } catch (error) {
    console.error('Error scraping GSALR:', error);
    throw new Error('Failed to scrape GSALR: ' + error.message);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// API endpoint for GSALR search
app.get('/api/gsalr/search', async (req, res) => {
  const startTime = Date.now();
  console.log(`\n=== New Request: ${new Date().toISOString()} ===`);
  console.log('Query params:', req.query);
  
  try {
    const { zipCode, radius = 10 } = req.query;
    
    if (!zipCode) {
      console.error('Error: Zip code is required');
      return res.status(400).json({ 
        success: false,
        error: 'Zip code is required',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`Starting search for zip code: ${zipCode}, radius: ${radius}`);
    
    const sales = await scrapeGSALR(zipCode, radius);
    
    console.log(`Search completed. Found ${sales.length} sales.`);
    console.log(`Total time: ${(Date.now() - startTime) / 1000} seconds`);
    
    if (sales.length === 0) {
      console.warn('Warning: No sales found for the given criteria');
    }
    
    res.json({
      success: true,
      count: sales.length,
      data: sales,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Determine appropriate status code
    const statusCode = error.message.includes('timeout') ? 504 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: 'Failed to fetch garage sales',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
