import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchForm from '../../components/SearchForm';
import { DATA_SOURCES } from '../../services/dataSourceManager';

describe('SearchForm Component', () => {
  const mockOnSearch = jest.fn();
  
  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders with ZIP code input field', () => {
    render(
      <SearchForm 
        onSearch={mockOnSearch} 
        isLoading={false}
        sources={DATA_SOURCES}
      />
    );
    
    const zipInput = screen.getByLabelText(/ZIP Code/i);
    expect(zipInput).toBeInTheDocument();
  });

  test('validates ZIP code format', () => {
    render(
      <SearchForm 
        onSearch={mockOnSearch} 
        isLoading={false}
        sources={DATA_SOURCES}
      />
    );
    
    const zipInput = screen.getByLabelText(/ZIP Code/i);
    const searchButton = screen.getByRole('button', { name: /Find Garage Sales/i });
    
    // Select the first data source
    const firstSource = screen.getByLabelText(DATA_SOURCES[0].name);
    fireEvent.click(firstSource);
    
    // Try with invalid ZIP (too short)
    fireEvent.change(zipInput, { target: { value: '1234' } });
    fireEvent.click(searchButton);
    
    // Search should not be called with invalid input
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Try with valid ZIP
    fireEvent.change(zipInput, { target: { value: '12345' } });
    fireEvent.click(searchButton);
    
    // Search should be called with valid input and selected source
    expect(mockOnSearch).toHaveBeenCalledWith('12345', [DATA_SOURCES[0].id]);
  });

  test('disables search button when loading', () => {
    render(
      <SearchForm 
        onSearch={mockOnSearch} 
        isLoading={true}
        sources={DATA_SOURCES}
      />
    );
    
    const searchButton = screen.getByRole('button', { name: /Searching.../i });
    expect(searchButton).toBeDisabled();
  });

  test('allows selecting data sources', () => {
    render(
      <SearchForm 
        onSearch={mockOnSearch} 
        isLoading={false}
        sources={DATA_SOURCES}
      />
    );
    
    // No checkboxes should be checked by default
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
    
    // Select the first source
    fireEvent.click(checkboxes[0]);
    
    // Enter a valid ZIP
    const zipInput = screen.getByLabelText(/ZIP Code/i);
    fireEvent.change(zipInput, { target: { value: '12345' } });
    
    // Submit the form
    const searchButton = screen.getByRole('button', { name: /Find Garage Sales/i });
    fireEvent.click(searchButton);
    
    // onSearch should be called with only the selected source
    expect(mockOnSearch).toHaveBeenCalledWith('12345', [DATA_SOURCES[0].id]);
  });
});
