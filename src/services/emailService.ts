import emailjs from '@emailjs/browser';

// Check if EmailJS should be enabled
const isEmailJSEnabled = process.env.REACT_APP_EMAILJS_ENABLED !== 'false';

// Initialize EmailJS with public key
export const initEmailJS = () => {
  if (!isEmailJSEnabled) {
    console.log('EmailJS is disabled via environment variable');
    return false;
  }

  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  
  if (!publicKey) {
    console.warn('EmailJS public key is not set in environment variables');
    return false;
  }
  
  try {
    emailjs.init(publicKey);
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
  if (!isEmailJSEnabled) {
    console.log('EmailJS is disabled - skipping email notification');
    return true; // Return true to prevent errors in the UI
  }

  try {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    
    if (!serviceId || !templateId) {
      console.error('EmailJS service ID or template ID is not set');
      return false;
    }
    
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        zipCode,
        email: email || 'Not provided',
        searchDate: new Date().toLocaleString(),
      }
    );
    
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};
