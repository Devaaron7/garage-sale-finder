/**
 * Server-side EmailJS service
 * Handles email sending without exposing credentials to the frontend
 */
const axios = require('axios');

/**
 * Send an email using EmailJS API
 * @param {Object} emailData - Email data
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.zipCode - Zip code for search
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendEmail = async (emailData) => {
  try {
    // Check if EmailJS is enabled
    if (process.env.REACT_APP_EMAILJS_ENABLED === 'false') {
      console.log('EmailJS is disabled via environment variable');
      return { success: true, message: 'EmailJS is disabled' };
    }

    // Get credentials from environment variables
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    // Validate credentials
    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS credentials are not properly configured');
      return { success: false, error: 'Email service not properly configured' };
    }

    // Prepare template parameters
    const templateParams = {
      to_email: emailData.to,
      zip_code: emailData.zipCode,
      date: new Date().toLocaleString(),
    };

    // Send email via EmailJS API
    const response = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Email sent successfully via EmailJS');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Failed to send email:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to send email' 
    };
  }
};

module.exports = {
  sendEmail,
};
