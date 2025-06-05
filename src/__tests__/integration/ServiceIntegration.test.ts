import { searchAllSources } from '../../services/dataSourceManager';
import { searchCraigslistGarageSales } from '../../services/craigslistService';
import { searchOfferUpSales } from '../../services/offerUpService';

// Mock the individual service modules
jest.mock('../../services/craigslistService');
jest.mock('../../services/offerUpService');

describe('Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('searchAllSources should call individual service methods with correct parameters', async () => {
    // Setup mock return values
    const mockCraigslistResults = [
      {
        id: 'cl-1',
        title: 'Craigslist Sale',
        source: 'Craigslist',
        // Required properties
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
      }
    ];

    const mockOfferUpResults = [
      {
        id: 'ou-1',
        title: 'OfferUp Sale',
        source: 'OfferUp',
        // Required properties
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
        photoCount: 1,
        distance: 5,
        distanceUnit: 'mi'
      }
    ];

    // Set up mocks
    (searchCraigslistGarageSales as jest.Mock).mockResolvedValue(mockCraigslistResults);
    (searchOfferUpSales as jest.Mock).mockResolvedValue(mockOfferUpResults);

    // Execute the function with both sources
    const zipCode = '12345';
    const radius = 10;
    const sources = ['craigslist', 'offerup'];
    const results = await searchAllSources(zipCode, radius, sources);

    // Verify the individual service functions were called with correct parameters
    expect(searchCraigslistGarageSales).toHaveBeenCalledWith(zipCode);
    expect(searchOfferUpSales).toHaveBeenCalledWith(zipCode, radius);

    // Verify results are combined correctly
    expect(results).toHaveLength(2);
    expect(results).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'cl-1', source: 'Craigslist' }),
      expect.objectContaining({ id: 'ou-1', source: 'OfferUp' })
    ]));
  });

  test('searchAllSources should only call services for selected sources', async () => {
    // Set up mocks
    (searchCraigslistGarageSales as jest.Mock).mockResolvedValue([]);
    (searchOfferUpSales as jest.Mock).mockResolvedValue([]);

    // Execute with only craigslist
    await searchAllSources('12345', 10, ['craigslist']);

    // Verify only craigslist service was called
    expect(searchCraigslistGarageSales).toHaveBeenCalled();
    expect(searchOfferUpSales).not.toHaveBeenCalled();

    // Reset mocks
    jest.clearAllMocks();

    // Execute with only offerup
    await searchAllSources('12345', 10, ['offerup']);

    // Verify only offerup service was called
    expect(searchCraigslistGarageSales).not.toHaveBeenCalled();
    expect(searchOfferUpSales).toHaveBeenCalled();
  });

  test('searchAllSources should handle errors from individual services', async () => {
    // Make craigslist service throw an error
    (searchCraigslistGarageSales as jest.Mock).mockRejectedValue(new Error('Service error'));
    (searchOfferUpSales as jest.Mock).mockResolvedValue([]);

    // Execute with both sources
    const results = await searchAllSources('12345', 10, ['craigslist', 'offerup']);

    // Should still return results from offerup
    expect(results).toEqual([]);
    
    // Both services should have been called despite the error
    expect(searchCraigslistGarageSales).toHaveBeenCalled();
    expect(searchOfferUpSales).toHaveBeenCalled();
  });
});
