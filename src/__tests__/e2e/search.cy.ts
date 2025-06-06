describe('Garage Sale Finder E2E Tests', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should load the application correctly', () => {
    // Check that the main elements are visible
    cy.get('header').should('be.visible');
    cy.contains('Find Garage Sales').should('be.visible');
    cy.get('footer').should('be.visible');
  });

  it('should search for garage sales by zip code', () => {
    // Enter a valid zip code
    cy.get('input#location').type('33101');
    
    // Select OfferUp as a source
    cy.contains('OfferUp').click();
    
    // Click the search button
    cy.contains('Find Garage Sales').click();
    
    // Verify loading state
    cy.contains('Searching...').should('be.visible');
    
    // Wait for results to load (this will depend on your app's behavior)
    cy.contains('Searching...', { timeout: 15000 }).should('not.exist');
    
    // Verify that results are displayed
    cy.get('[data-testid="results-list"]').should('be.visible');
    cy.get('[data-testid="garage-sale-card"]').should('have.length.at.least', 1);
  });

  it('should filter results by source', () => {
    // Enter a valid zip code
    cy.get('input#location').type('33101');

    // Select only Craigslist as a source
    cy.contains('Craigslist').click();

    // Click the search button
    cy.contains('Find Garage Sales').click();
    
    // Wait for results to load
    cy.contains('Searching...', { timeout: 15000 }).should('not.exist');
    
    // Verify that only Craigslist results are shown
    cy.get('[data-testid="garage-sale-card"]').each(($card) => {
      cy.wrap($card).contains('Craigslist');
    });
    
    // Verify no other sources are present
    cy.get('[data-testid="garage-sale-card"]').should('not.contain', 'OfferUp');
  });

  it('should validate zip code input', () => {
    // Try to enter a non-numeric character
    cy.get('input#location').type('abc');
    
    // Check that the input is empty (since it should only accept numbers)
    cy.get('input#location').should('have.value', '');
    
    // Try to enter a valid zip code
    cy.get('input#location').type('12345');
    
    // Check that the input has the zip code
    cy.get('input#location').should('have.value', '12345');
  });

  it('should show error message for invalid searches', () => {
    // Enter an invalid zip code (too short)
    cy.get('input#location').type('123');
    
    // Click the search button
    cy.contains('Find Garage Sales').click();
    
    // Check that the error message appears
    cy.contains('Please enter a valid 5-digit ZIP code').should('be.visible');
  });
});
