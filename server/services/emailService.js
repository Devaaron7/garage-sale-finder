/**
 * Server-side EmailJS credentials provider
 * Provides EmailJS credentials securely to the frontend
 */

/**
 * Get EmailJS configuration
 * @returns {Object} - EmailJS configuration
 */
const getEmailJSConfig = () => {
  // Check if EmailJS is enabled
  const isEnabled = process.env.REACT_APP_EMAILJS_ENABLED !== 'false';
  
  if (!isEnabled) {
    return { enabled: false };
  }

  // Get credentials from environment variables
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  // Validate credentials
  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS credentials are not properly configured');
    return { 
      enabled: false,
      error: 'Email service not properly configured'
    };
  }

  return {
    enabled: true,
    serviceId,
    templateId,
    publicKey
  };
};

module.exports = {
  getEmailJSConfig
};
