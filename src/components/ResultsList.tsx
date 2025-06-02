import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLocationDot, FaFaceSadTear } from 'react-icons/fa6';
import { GarageSale } from '../types';
import GarageSaleCard from './GarageSaleCard';

const Container = styled.div`
  margin-top: 2rem;
`;

const ResultsHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResultsCount = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
`;

const EmptyMessage = styled.p`
  color: #6b7280;
  margin: 0;
`;

const LoadingContainer = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const LoadingProgress = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #3b82f6;
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.5rem 0 0;
  font-style: italic;
`;

interface ResultsListProps {
  sales: GarageSale[];
  isLoading: boolean;
  hasSearched: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ sales, isLoading, hasSearched }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing search...');
  
  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0);
      setLoadingStage('Initializing search...');
      
      // Simulate progress in stages
      const stages = [
        { progress: 10, text: 'Connecting to data sources...' },
        { progress: 25, text: 'Searching for garage sales...' },
        { progress: 40, text: 'Collecting listing details...' },
        { progress: 60, text: 'Processing images...' },
        { progress: 80, text: 'Filtering results...' },
        { progress: 95, text: 'Finalizing results...' }
      ];
      
      // Create timeouts for each stage
      stages.forEach((stage, index) => {
        setTimeout(() => {
          setProgress(stage.progress);
          setLoadingStage(stage.text);
        }, (index + 1) * 1200); // Stagger the stages
      });
    }
  }, [isLoading]);
  
  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <h3>Searching for Garage Sales</h3>
          <LoadingBar>
            <LoadingProgress width={progress} />
          </LoadingBar>
          <LoadingText>{loadingStage}</LoadingText>
        </LoadingContainer>
        <Grid>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: '400px', background: '#f3f4f6', borderRadius: '8px' }} />
          ))}
        </Grid>
      </Container>
    );
  }


  if (!hasSearched) {
    return (
      <EmptyState>
        <EmptyIcon>
          <FaLocationDot />
        </EmptyIcon>
        <EmptyTitle>Find Garage Sales Near You</EmptyTitle>
        <EmptyMessage>Enter a zip code to discover garage sales in your area</EmptyMessage>
      </EmptyState>
    );
  }

  if (sales.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>
          <FaFaceSadTear />
        </EmptyIcon>
        <EmptyTitle>No Garage Sales Found</EmptyTitle>
        <EmptyMessage>Try adjusting your search criteria or check back later</EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <Container>
      <ResultsHeader>
        <ResultsCount>
          {sales.length} {sales.length === 1 ? 'Garage Sale' : 'Garage Sales'} Found
        </ResultsCount>
      </ResultsHeader>
      <Grid>
        {sales.map((sale) => (
          <GarageSaleCard key={`${sale.source}-${sale.id}`} sale={sale} />
        ))}
      </Grid>
    </Container>
  );
};

export default ResultsList;
