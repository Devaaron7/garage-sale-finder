import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { DATA_SOURCES, searchAllSources } from './services/dataSourceManager';
import { GarageSale } from './types';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';
import Header from './components/Header';
import Footer from './components/Footer';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    color: #1f2937;
    background-color: #f9fafb;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  a {
    color: #3b82f6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const App: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [sales, setSales] = useState<GarageSale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [sources] = useState(DATA_SOURCES);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    sources.filter(s => s.enabled).map(s => s.id)
  );

  const handleSearch = async (locationInput: string, selectedSources: string[]) => {
    // Clear validation for now as we accept both city names and zip codes
    if (!locationInput.trim()) {
      setError('Please enter a city name or zip code');
      return;
    }

    setLocation(locationInput);
    setSelectedSources(selectedSources);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`Searching with sources: ${selectedSources.join(', ')}`);
      const results = await searchAllSources(locationInput, 10, selectedSources);
      setSales(results);
    } catch (err) {
      console.error('Error searching garage sales:', err);
      setError('Failed to fetch garage sales. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      
      <MainContent>
        <Container>
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            sources={sources}
          />
          
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#b91c1c', 
              padding: '1rem', 
              borderRadius: '0.375rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}
          
          <ResultsList 
            sales={sales} 
            isLoading={isLoading} 
            hasSearched={hasSearched}
            enabledSources={selectedSources}
            selectedSources={selectedSources}
          />
        </Container>
      </MainContent>
      
      <Footer />
    </>
  );
};

export default App;
