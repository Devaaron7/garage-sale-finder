describe('Garage Sale Finder Basic Tests', () => {
  it('should load the application correctly', () => {
    // Visit the home page
    cy.visit('/');
    
    // Check that the main elements are visible
    cy.get('header').should('exist');
    cy.contains('button', 'Find Garage Sales').should('exist');
    cy.get('footer').should('exist');
  });
});
