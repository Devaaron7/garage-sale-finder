const express = require('express');
const cors = require('cors');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const os = require('os');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for Railway
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Garage Sale Finder API is running' });
});

// Determine the operating system
const isWindows = os.platform() === 'win32';

// Configure Chrome options
const chromeOptions = new chrome.Options();

// Common Chrome options for better compatibility and stability in containers
const chromeArgs = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--headless',
  '--disable-gpu',
  '--window-size=1280,720',
  '--disable-extensions',
  '--disable-setuid-sandbox',
  '--disable-blink-features=AutomationControlled',
  '--disable-infobars',
  '--mute-audio',
  '--disable-breakpad',
  '--disable-sync',
  '--disable-background-networking',
  '--disable-default-apps',
  '--disable-hang-monitor',
  '--disable-prompt-on-repost',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--metrics-recording-only',
  '--remote-debugging-port=9222'
];

// Add OS-specific arguments if needed
if (!isWindows) {
  chromeArgs.push('--disable-dev-shm-usage');
}

chromeOptions.addArguments(chromeArgs);

// Set Chrome binary path based on environment
if (isWindows) {
  // Default install paths for Windows
  const windowsPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  
  // Try to find Chrome in common locations
  for (const chromePath of windowsPaths) {
    if (require('fs').existsSync(chromePath)) {
      chromeOptions.setChromeBinaryPath(chromePath);
      console.log(`Using Chrome at: ${chromePath}`);
      break;
    }
  }
} else {
  // For Linux (Railway.app) - using Chrome in browserless/chrome
  const chromePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
  chromeOptions.setChromeBinaryPath(chromePath);
  console.log(`Using browser at: ${chromePath}`);
}

// Set Chrome binary path if needed (uncomment and update the path)
// chromeOptions.setChromeBinaryPath('C:/Program Files/Google/Chrome/Application/chrome.exe');

// GSALR Scraper using Selenium with retry logic
async function scrapeGSALR(zipCode, radius = 10) {
  let driver;
  let retryCount = 0;
  const maxRetries = 3;
  let lastError = null;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`Scraping attempt ${retryCount + 1}/${maxRetries}`);
      
      // Initialize WebDriver with more robust configuration
      console.log('Initializing Chrome WebDriver...');
      // In the Alpine image, ChromeDriver is already in the PATH
      console.log('Using ChromeDriver from PATH');
      
      // Create a simpler configuration for Alpine
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
      console.log('WebDriver initialized successfully');
      
      // Set page load timeout to avoid hanging
      await driver.manage().setTimeouts({ pageLoad: 60000, implicit: 15000 });

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

    // Check if subscribe form exists
    console.log('Checking for subscribe form...');
    await driver.sleep(3000);
    let subscribeFormExists = false;
    try {
      const subscribeForm = await driver.findElement(By.xpath("//div[@id='subscribeForm']"));
      if (subscribeForm) {
        console.log('Subscribe form found, skipping page refresh');
        subscribeFormExists = true;

        // Handle the second popup (non-shadow DOM)
        await driver.sleep(3000);
        try {
          const secondPopupClose = await driver.wait(
            until.elementLocated(By.xpath("(//div[@class='close-reveal-modal'])[2]")),
            5000 // Shorter timeout since this popup might not appear
          );
          
          if (secondPopupClose) {
            console.log('Closing Subscribe form...');
            await secondPopupClose.click();
            console.log('Second popup closed');
            // Small delay after closing popup
            await driver.sleep(1000);
          }
        } catch (error) {
          console.log('No second popup found or error closing it:', error.message);
        }
      }
    } catch (error) {
      console.log('Subscribe form not found:', error.message);
    }

    // Only refresh the page if subscribe form doesn't exist
    if (!subscribeFormExists) {
      console.log('Refreshing page to avoid popups...');
      await driver.navigate().refresh();
      
      // Wait for page to load after refresh
      await driver.sleep(2000);
      
      // Try multiple selectors for the zip code input
      let zipInputAfterRefresh = null;
      const possibleSelectors = [
        By.xpath("//input[@class='city-loc-set']"),
        By.css("input.city-loc-set"),
        By.css("input[placeholder='City or Zip']"),
        By.css("input[type='text']"),
        By.id("city-loc-set")
      ];
      
      for (const selector of possibleSelectors) {
        try {
          console.log(`Trying selector: ${selector.toString()}`);
          zipInputAfterRefresh = await driver.wait(
            until.elementLocated(selector),
            5000
          );
          if (zipInputAfterRefresh) {
            console.log('Found zip code input with selector:', selector.toString());
            break;
          }
        } catch (selectorError) {
          console.log(`Selector ${selector.toString()} failed:`, selectorError.message);
        }
      }
      
      if (!zipInputAfterRefresh) {
        console.error('Could not find zip code input with any selector');
        throw new Error('Failed to locate zip code input field');
      }
      
      await zipInputAfterRefresh.clear();
      await zipInputAfterRefresh.sendKeys(zipCode);
        
      // Try multiple selectors for the submit button
      let submitButtonAfterRefresh = null;
      const possibleButtonSelectors = [
        By.xpath("//a[@class='button postfix radius button-city-loc-set']"),
        By.css("a.button.postfix.radius.button-city-loc-set"),
        By.css("a.button"),
        By.css("button[type='submit']"),
        By.css("input[type='submit']")
      ];
      
      for (const selector of possibleButtonSelectors) {
        try {
          console.log(`Trying button selector: ${selector.toString()}`);
          submitButtonAfterRefresh = await driver.wait(
            until.elementLocated(selector),
            5000
          );
          if (submitButtonAfterRefresh) {
            console.log('Found submit button with selector:', selector.toString());
            break;
          }
        } catch (selectorError) {
          console.log(`Button selector ${selector.toString()} failed:`, selectorError.message);
        }
      }
      
      if (!submitButtonAfterRefresh) {
        console.error('Could not find submit button with any selector');
        throw new Error('Failed to locate submit button');
      }
      
      console.log('Clicking submit button...');
      await submitButtonAfterRefresh.click();
      
      // Wait for the page to process the submission
      await driver.sleep(3000);
      }


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
          image: await (async () => {
            try {
              // Log the entire listing HTML for debugging
              const listingHtml = await listing.getAttribute('outerHTML');
              console.log(`Listing ${i} HTML:`, listingHtml.substring(0, 200) + '...');
              
              // First try to get the thumbnail image
              const thumbImg = await listing.findElement(By.css('.thumb img'));
              const imgSrc = await thumbImg.getAttribute('src');
              console.log(`Found image for listing ${i}:`, imgSrc);
              return imgSrc;
            } catch (thumbError) {
              console.log(`Could not find .thumb img for listing ${i}:`, thumbError.message);
              try {
                // Try any image in the listing
                const anyImg = await listing.findElement(By.css('img'));
                const imgSrc = await anyImg.getAttribute('src');
                console.log(`Found alternative image for listing ${i}:`, imgSrc);
                return imgSrc;
              } catch (imgError) {
                console.log(`Could not find any image for listing ${i}:`, imgError.message);
                return '';
              }
            }
          })(),
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
    
      // Process the results and return sales data
      console.log(`Successfully processed ${sales.length} listings`);
      return sales;
      
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${retryCount + 1}/${maxRetries} failed:`, error);
      
      // Check for specific errors that indicate we should retry
      const shouldRetry = [
        'invalid session id',
        'session deleted',
        'disconnected',
        'unable to send message to renderer',
        'chrome not reachable',
        'timeout',
        'no such session',
        'no such element'
      ].some(errMsg => error.message && error.message.toLowerCase().includes(errMsg.toLowerCase()));
      
      if (!shouldRetry) {
        console.log('Error is not retryable, breaking retry loop');
        break;
      }
      
      retryCount++;
      
      // Only continue retrying if we haven't exceeded max retries
      if (retryCount >= maxRetries) {
        console.log('Maximum retry attempts reached, giving up');
        break;
      }
      
      console.log(`Waiting 2 seconds before retry ${retryCount}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } finally {
      // Always quit the driver after each attempt
      if (driver) {
        try {
          console.log('Quitting WebDriver...');
          await driver.quit();
          console.log('WebDriver quit successfully');
        } catch (e) {
          console.error('Error closing WebDriver:', e);
        }
      }
    }
  }
  
  // If we've exhausted all retries and still have an error, throw it
  if (lastError) {
    console.error('All retry attempts failed');
    throw new Error('Failed to scrape GSALR: ' + lastError.message);
  }
  
  // This should never happen if we have proper error handling
  throw new Error('Failed to scrape GSALR: Unknown error');
}

// API endpoint for GSALR search
app.get('/api/gsalr/search', async (req, res) => {
  const startTime = Date.now();
  console.log(`\n=== New Request: ${new Date().toISOString()} ===`);
  console.log('Query params:', req.query);
  
  try {
    const { zipCode } = req.query;
    
    if (!zipCode) {
      console.error('Error: Zip code is required');
      return res.status(400).json({ 
        success: false,
        error: 'Zip code is required',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`Starting search for zip code: ${zipCode}`);
    
    // Fixed radius to 10 miles as default
    const sales = await scrapeGSALR(zipCode, 10);
    
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
    const transformedSales = validSales.map(sale => {
      // Log the image URL for debugging
      console.log(`Sale ${sale.id} image URL:`, sale.image);
      
      return {
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
        url: sale.url || `https://gsalr.com/sale/${sale.id}`,
        imageUrl: sale.image || '',
        photoCount: sale.photoCount || 0,
        source: sale.source || 'GSALR'
      };
    });
    
    // Return the transformed data directly as an array
    // The frontend expects a direct array, not a nested object
    res.json(transformedSales);
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Log the error details for debugging
    console.error('Error details:', error.message);
    
    // Return an empty array on error to match the expected format
    // This prevents frontend errors when processing the response
    res.json([]);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
