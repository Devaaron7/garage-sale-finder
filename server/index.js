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
  '--headless',
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
    
    // Find and click the submit button
    console.log('Finding and clicking submit button...');
    const submitButton = await driver.wait(
      until.elementLocated(By.xpath("//a[@class='button postfix radius button-city-loc-set']")),
      10000
    ).catch(err => {
      console.error('Error finding submit button:', err);
      throw err;
    });
    
    console.log('Clicking submit button...');
    await submitButton.click();

    // Refresh the page to avoid popups
    console.log('Refreshing page to avoid popups...');
    await driver.navigate().refresh();
    
    // Wait for page to load after refresh
    await driver.sleep(2000);
    
    // Re-enter zip code
    console.log('Re-entering zip code after refresh...');
    const zipInputAfterRefresh = await driver.wait(
      until.elementLocated(By.xpath("//input[@class='city-loc-set']")),
      10000
    ).catch(err => {
      console.error('Error finding zip code input after refresh:', err);
      throw err;
    });
    
    await zipInputAfterRefresh.clear();
    await zipInputAfterRefresh.sendKeys(zipCode);
    
    // Find and click the submit button again
    console.log('Finding and clicking submit button after refresh...');
    const submitButtonAfterRefresh = await driver.wait(
      until.elementLocated(By.xpath("//a[@class='button postfix radius button-city-loc-set']")),
      10000
    ).catch(err => {
      console.error('Error finding submit button after refresh:', err);
      throw err;
    });

    // Wait for page to load after refresh
    await driver.sleep(2000);
    
    console.log('Clicking submit button after refresh...');
    await submitButtonAfterRefresh.click();
    
    // Wait for the page to process the submission
    await driver.sleep(3000);


    // Handle the second popup (non-shadow DOM)
    console.log('Checking for second popup...');
    try {
      const secondPopupClose = await driver.wait(
        until.elementLocated(By.xpath("(//div[@class='close-reveal-modal'])[2]")),
        5000 // Shorter timeout since this popup might not appear
      );
      
      if (secondPopupClose) {
        console.log('Found second popup, closing it...');
        await secondPopupClose.click();
        console.log('Second popup closed');
        // Small delay after closing popup
        await driver.sleep(1000);
      }
    } catch (error) {
      console.log('No second popup found or error closing it:', error.message);
    }

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
        const title = await listing.findElement(By.css('h2 a.sale-title')).getText().catch(() => '');
        
        // Extract address components
        const addressElement = await listing.findElement(By.css('span[itemprop="streetAddress"]')).catch(() => null);
        const address = addressElement ? (await addressElement.getText()).replace(/^\s*\S+\s+/, '') : ''; // Remove the icon
        
        // Extract location (city, state, zip)
        const locationElement = await listing.findElement(By.css('span[itemprop="addressLocality"]')).catch(() => null);
        const stateElement = await listing.findElement(By.css('span[itemprop="addressRegion"]')).catch(() => null);
        const zipElement = await listing.findElement(By.css('span[itemprop="postalCode"]')).catch(() => null);
        
        const city = locationElement ? await locationElement.getText() : '';
        const state = stateElement ? await stateElement.getText() : '';
        const zip = zipElement ? await zipElement.getText() : '';
        
        // Extract date range
        const dateRangeElement = await listing.findElement(By.css('span[itemprop="startDate"]')).catch(() => null);
        const endDateElement = await listing.findElement(By.css('span[itemprop="endDate"]')).catch(() => null);
        
        let startDate = dateRangeElement ? await dateRangeElement.getAttribute('content') : '';
        let endDate = endDateElement ? await endDateElement.getAttribute('content') : '';
        
        // Extract sale type
        const saleTypeElement = await listing.findElement(By.css('.sale-type')).catch(() => null);
        const saleType = saleTypeElement ? await saleTypeElement.getText() : '';
        
        // Extract description (first 200 chars)
        const descriptionElement = await listing.findElement(By.css('p[itemprop="description"]')).catch(() => null);
        let description = descriptionElement ? await descriptionElement.getText() : '';
        description = description.length > 200 ? description.substring(0, 200) + '...' : description;
        
        // Extract URL
        const urlElement = await listing.findElement(By.css('a.sale-title')).catch(() => null);
        const url = urlElement ? await urlElement.getAttribute('href') : '';
        
        // Extract photo count if available
        const photoCountElement = await listing.findElement(By.css('.photo-count')).catch(() => null);
        const photoCount = photoCountElement ? await photoCountElement.getText() : '0';
        
        // Create the sale object
        const sale = {
          id: await listing.getAttribute('data-id') || '',
          title: title,
          address: address,
          city: city,
          state: state,
          zipCode: zip,
          startDate: startDate,
          endDate: endDate,
          description: description,
          source: 'GSALR',
          type: saleType,
          url: url,
          image: await listing.findElement(By.css('img')).getAttribute('src').catch(() => ''),
          photoCount: parseInt(photoCount) || 0,
          distance: 0, // Will be calculated later if needed
          distanceUnit: 'mi',
          price: 'Unknown', // Not available in the listing preview
          preview: description.split('.').shift() + '...' // First sentence as preview
        };
        
        sales.push(sale);
      } catch (error) {
        console.error(`Error processing listing ${i}:`, error);
        // Continue with next listing if one fails
      }
    }
    
    console.log(`Successfully processed ${sales.length} listings`);
    return sales;
    
  } catch (error) {
    console.error('Error in scrapeGSALR:', error);
    throw new Error('Failed to scrape GSALR: ' + error.message);
  } finally {
    if (driver) {
      try {
        await driver.quit();
      } catch (e) {
        console.error('Error closing WebDriver:', e);
      }
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
    
    // Filter out invalid entries (empty or missing required fields)
    const validSales = sales.filter(sale => 
      sale.id && 
      sale.title && 
      sale.city && 
      sale.state &&
      sale.address
    );
    
    console.log(`Search completed. Found ${validSales.length} valid sales out of ${sales.length} total.`);
    console.log(`Total time: ${(Date.now() - startTime) / 1000} seconds`);
    
    if (validSales.length === 0) {
      console.warn('Warning: No valid sales found for the given criteria');
      return res.status(404).json({
        success: false,
        error: 'No garage sales found for the specified location',
        timestamp: new Date().toISOString()
      });
    }
    
    // Transform the data to match the frontend's expected structure
    const transformedSales = validSales.map(sale => ({
      id: sale.id || '',
      title: sale.title || 'Garage Sale',
      address: sale.address || '',
      city: sale.city || '',
      state: sale.state || '',
      zip: sale.zipCode || '',
      start_date: sale.startDate || new Date().toISOString().split('T')[0],
      end_date: sale.endDate || sale.startDate || new Date().toISOString().split('T')[0],
      start_time: sale.startTime || '09:00',
      end_time: sale.endTime || '17:00',
      description: sale.description || 'No description available',
      distance: `${sale.distance || 0} ${sale.distanceUnit || 'mi'}`,
      items: [],
      url: sale.url || `https://gsalr.com/sale/${sale.id}`
    }));
    
    // Return the transformed data in the format expected by the frontend
    res.json({
      success: true,
      count: transformedSales.length,
      data: transformedSales,
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
