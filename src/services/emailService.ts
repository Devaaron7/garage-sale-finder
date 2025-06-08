// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://garage-finder-app-production.up.railway.app'
    : 'http://localhost:3001');

/**
 * Send an email with the zipcode used for search using the secure server-side proxy
 * @param zipCode The zip code used for search
 * @param email User's email (optional)
 * @returns Promise<boolean> Success status
 */
export const sendSearchNotification = async (zipCode: string, email?: string): Promise<boolean> => {
  try {
    console.log(`Sending search notification for zip code: ${zipCode}`);
    
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipCode,
        to: email, // Optional, backend will use default if not provided
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Email API error:', data.error);
      return false;
    }
    
    console.log('Email notification sent successfully via secure proxy');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};
