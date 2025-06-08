import emailjs from '@emailjs/browser';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://garage-finder-app-production.up.railway.app'
    : 'http://localhost:3001');

// EmailJS configuration cache
let emailjsConfig: any = null;

/**
 * Initialize EmailJS with configuration from the server
 */
export const initEmailJS = async (): Promise<boolean> => {
  try {
    // Get configuration from server
    const response = await fetch(`${API_BASE_URL}/api/email-config`);
    const config = await response.json();
    emailjsConfig = config;
    
    if (!config.enabled) {
      console.log('EmailJS is disabled via server configuration');
      return false;
    }
    
    // Initialize EmailJS with the public key
    emailjs.init(config.publicKey);
    console.log('EmailJS initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    return false;
  }
};

/**
 * Send an email with the zipcode used for search
 * @param zipCode The zip code used for search
 * @param email User's email (optional)
 * @returns Promise<boolean> Success status
 */
export const sendSearchNotification = async (zipCode: string, email?: string): Promise<boolean> => {
  try {
    // Initialize EmailJS if not already initialized
    if (!emailjsConfig) {
      const initialized = await initEmailJS();
      if (!initialized) {
        console.log('EmailJS initialization failed - skipping email notification');
        return true; // Return true to prevent errors in the UI
      }
    }
    
    if (!emailjsConfig.enabled) {
      console.log('EmailJS is disabled - skipping email notification');
      return true; // Return true to prevent errors in the UI
    }
    
    console.log(`Sending search notification for zip code: ${zipCode}`);
    
    // Send email using EmailJS browser SDK
    const response = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      {
        to_email: email || 'aaron123t@gmail.com',
        zip_code: zipCode,
        date: new Date().toLocaleString(),
      }
    );
    
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};
