import React from 'react';
import { mount } from '@cypress/react';
import SearchForm from '../../components/SearchForm';
import GarageSaleCard from '../../components/GarageSaleCard';
import { DATA_SOURCES } from '../../services/dataSourceManager';

describe('Component Tests', () => {
  context('SearchForm Component', () => {
    it('should render correctly', () => {
      const onSearchSpy = cy.spy().as('onSearchSpy');
      
      mount(
        <SearchForm 
          onSearch={onSearchSpy}
          isLoading={false}
          sources={DATA_SOURCES}
        />
      );
      
      // Check that the form elements are visible
      cy.get('input#location').should('be.visible');
      cy.contains('ZIP Code').should('be.visible');
      cy.contains('Find Garage Sales').should('be.visible');
    });
    
    it('should call onSearch when submitted with valid input', () => {
      const onSearchSpy = cy.spy().as('onSearchSpy');
      
      mount(
        <SearchForm 
          onSearch={onSearchSpy}
          isLoading={false}
          sources={DATA_SOURCES}
        />
      );
      
      // Enter a valid zip code
      cy.get('input#location').type('12345');
      
      // Submit the form
      cy.contains('Find Garage Sales').click();
      
      // Check that onSearch was called with the correct parameters
      cy.get('@onSearchSpy').should('have.been.calledWith', '12345', Cypress.sinon.match.array);
    });
  });
  
  context('GarageSaleCard Component', () => {
    it('should render sale information correctly', () => {
      const sale = {
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
      };
      
      mount(<GarageSaleCard sale={sale} />);
      
      // Check that the sale information is displayed
      cy.contains('Test Garage Sale').should('be.visible');
      cy.contains('123 Test St').should('be.visible');
      cy.contains('Test City, TS 12345').should('be.visible');
      cy.contains('$1 - $50').should('be.visible');
      cy.contains('Craigslist').should('be.visible');
    });
    
    it('should open the sale URL in a new tab when clicked', () => {
      const sale = {
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
      };
      
      mount(<GarageSaleCard sale={sale} />);
      
      // Check that the link has the correct attributes
      cy.get('a')
        .should('have.attr', 'href', 'https://www.craigslist.org/about/sites#US')
        .should('have.attr', 'target', '_blank');
    });
  });
});
