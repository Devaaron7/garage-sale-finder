describe('Garage Sale Finder Search Flow', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
    
    // Wait for the application to load completely
    cy.get('header').should('be.visible');
  });

  it('should validate ZIP code input', () => {
    // Get the ZIP code input field
    const zipInput = cy.get('input[id="location"]');
    
    // Try entering non-numeric characters (should be rejected)
    zipInput.type('abcde');
    zipInput.should('have.value', '');
    
    // Try entering a valid ZIP code
    zipInput.type('12345');
    zipInput.should('have.value', '12345');
    
    // Try entering more than 5 digits (should be truncated)
    zipInput.clear().type('123456');
    zipInput.should('have.value', '12345');
  });

  it('should show search results when a valid ZIP code is entered', () => {
    // Enter a valid ZIP code
    cy.get('input[id="location"]').type('33101');
    
    // Check all data source checkboxes
    cy.get('input[type="checkbox"]').each(($checkbox) => {
      if (!$checkbox.is(':checked')) {
        cy.wrap($checkbox).click();
      }
    });
    
    // Click the search button
    cy.contains('button', 'Find Garage Sales').click();
    
    // Wait for at least one article element to be visible
cy.get('article', { timeout: 10000 }).should('be.visible');

// Verify that there's at least one article
cy.get('article').should('have.length.at.least', 1);
  });

  it('should filter results by data source', () => {
    // Enter a valid ZIP code
    cy.get('input[id="location"]').type('33101');
    
    // Uncheck all sources
    cy.get('input[type="checkbox"]').each(($checkbox) => {
      const checkboxId = $checkbox.attr('id');
      if (checkboxId !== 'craigslist' && $checkbox.is(':checked')) {
        cy.wrap($checkbox).click();
      }
    });

    // Click a label with exact text match
    cy.contains('label', 'Craigslist').click();
    
    cy.pause();

    // Click the search button
    cy.contains('button', 'Find Garage Sales').click();
    
    // Wait for results to appear
    cy.get('article', { timeout: 5000 }).should('be.visible');

// Verify that there's at least one article
cy.get('article').should('have.length.at.least', 1);
    
    // Verify that all displayed results are from Craigslist
    cy.get('article').each(($card) => {
      cy.wrap($card).contains('Craigslist');
    });
  });
});
