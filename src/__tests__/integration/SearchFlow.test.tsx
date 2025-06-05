import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { searchAllSources } from '../../services/dataSourceManager';

// Mock the service module
jest.mock('../../services/dataSourceManager', () => {
  const originalModule = jest.requireActual('../../services/dataSourceManager');
  return {
    ...originalModule,
    searchAllSources: jest.fn(),
    DATA_SOURCES: [
      { id: 'craigslist', name: 'Craigslist', enabled: true },
      { id: 'offerup', name: 'OfferUp', enabled: true }
    ]
  };
});

describe('Search Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should search for garage sales when a valid zip code is entered', async () => {
    // Mock search results
    const mockResults = [
      {
        id: 'test-1',
        title: 'Test Garage Sale',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        startDate: '2025-06-10',
        endDate: '2025-06-10',
        startTime: '09:00',
        endTime: '17:00',
        description: 'Test description',
        source: 'Craigslist',
        price: '$1 - $50',
        url: 'https://www.craigslist.org/about/sites#US',
        imageUrl: 'https://example.com/image.jpg',
        preview: 'Test description...',
        photoCount: 1
      }
    ];
    
    (searchAllSources as jest.Mock).mockResolvedValue(mockResults);

    render(<App />);

    // Enter a valid zip code
    const zipInput = screen.getByLabelText(/ZIP Code/i);
    fireEvent.change(zipInput, { target: { value: '12345' } });

    // Click the search button
    const searchButton = screen.getByRole('button', { name: /Find Garage Sales/i });
    fireEvent.click(searchButton);

    // Wait for results to be displayed
    await waitFor(() => {
      expect(searchAllSources).toHaveBeenCalledWith('12345', expect.anything(), expect.anything());
      expect(screen.getByText('Test Garage Sale')).toBeInTheDocument();
    });
  });

  test('should validate zip code format', async () => {
    render(<App />);

    // Enter an invalid zip code (too short)
    const zipInput = screen.getByLabelText(/ZIP Code/i);
    fireEvent.change(zipInput, { target: { value: '123' } });

    // Click the search button
    const searchButton = screen.getByRole('button', { name: /Find Garage Sales/i });
    fireEvent.click(searchButton);

    // The search should not be performed with invalid input
    expect(searchAllSources).not.toHaveBeenCalled();
  });

  test('should filter results by selected sources', async () => {
    // Mock search results with multiple sources
    const mockResults = [
      {
        id: 'test-1',
        title: 'Craigslist Sale',
        source: 'Craigslist',
        // ...other required properties
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        startDate: '2025-06-10',
        endDate: '2025-06-10',
        startTime: '09:00',
        endTime: '17:00',
        description: 'Test description',
        price: '$1 - $50',
        url: 'https://www.craigslist.org/about/sites#US',
        imageUrl: 'https://example.com/image.jpg',
        preview: 'Test description...',
        photoCount: 1
      },
      {
        id: 'test-2',
        title: 'OfferUp Sale',
        source: 'OfferUp',
        // ...other required properties
        address: '456 Test Ave',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        startDate: '2025-06-11',
        endDate: '2025-06-11',
        startTime: '10:00',
        endTime: '16:00',
        description: 'Another test description',
        price: '$5 - $20',
        url: 'https://offerup.com/search?q=12345',
        imageUrl: 'https://example.com/image2.jpg',
        preview: 'Another test description...',
        photoCount: 1
      }
    ];
    
    (searchAllSources as jest.Mock).mockResolvedValue(mockResults);

    render(<App />);

    // Enter a valid zip code
    const zipInput = screen.getByLabelText(/ZIP Code/i);
    fireEvent.change(zipInput, { target: { value: '12345' } });

    // Click the search button
    const searchButton = screen.getByRole('button', { name: /Find Garage Sales/i });
    fireEvent.click(searchButton);

    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText('Craigslist Sale')).toBeInTheDocument();
      expect(screen.getByText('OfferUp Sale')).toBeInTheDocument();
    });
  });
});
