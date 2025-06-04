import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLocationDot, FaFaceSadTear } from 'react-icons/fa6';
import { GarageSale } from '../types';
import GarageSaleCard from './GarageSaleCard';

const Container = styled.div`
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
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
  opacity: 1 !important;
  position: relative;
  z-index: 10;
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
  enabledSources?: string[];
}

const ResultsList: React.FC<ResultsListProps> = ({ sales, isLoading, hasSearched, enabledSources = [] }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing search...');
  const [showContent, setShowContent] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0);
      setLoadingStage('Initializing search...');
      
      // Calculate base delay based on number of enabled sources
      const sourceCount = enabledSources.length || 1;
      const baseDelay = Math.min(800, Math.max(300, 1200 / Math.sqrt(sourceCount)));
      
      // Define all possible stages
      const allStages = [
        { progress: 10, text: 'Connecting to data sources...' },
        { progress: 25, text: 'Searching for garage sales...' },
        { progress: 40, text: 'Collecting listing details...' },
        { progress: 60, text: 'Processing images...' },
        { progress: 75, text: 'Filtering results...' },
        { progress: 85, text: 'Verifying listings...' },
        { progress: 92, text: 'Finalizing results...' },
        { progress: 96, text: 'Almost there...' },
        { progress: 98, text: 'Wrapping up...' },
        { progress: 99, text: 'Finishing touches...' }
      ];
      
      // Select a subset of stages based on number of sources (more sources = more stages)
      const stageCount = Math.min(3 + Math.floor(sourceCount * 0.7), allStages.length);
      const stages = allStages.slice(0, stageCount);
      
      // Create timeouts for each stage with variable delays
      stages.forEach((stage, index) => {
        // Increase delay for later stages to simulate more work
        const stageDelay = (index + 1) * baseDelay * (1 + (index / stages.length));
        
        setTimeout(() => {
          setProgress(stage.progress);
          setLoadingStage(stage.text);
          
          // If this is the last stage, ensure we reach 100%
          if (index === stages.length - 1) {
            setTimeout(() => {
              setProgress(100);
            }, 300);
          }
        }, stageDelay);
      });
      
      // Cleanup function to clear any pending timeouts
      return () => {
        // Clear all timeouts
        const maxTimeoutId = window.setTimeout(() => {}, 0);
        for (let i = 0; i < maxTimeoutId; i++) {
          window.clearTimeout(i);
        }
      };
    }
  }, [isLoading, enabledSources]);

  useEffect(() => {
    if (!isLoading && hasSearched) {
      const timeElapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - timeElapsed); // Ensure at least 3s total loading time
      
      const timer = setTimeout(() => {
        setShowContent(true);
      }, remainingTime);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, hasSearched, startTime]);

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
    <Container className={showContent ? 'visible' : ''}>
      <ResultsHeader>
        <ResultsCount>
          {sales.length} {sales.length === 1 ? 'Garage Sale' : 'Garage Sales'} Found
        </ResultsCount>
      </ResultsHeader>
      <Grid>
        {sales.map((sale, index) => (
          <GarageSaleCard 
            key={`${sale.source}-${sale.id}`} 
            sale={sale} 
            style={{
              transitionDelay: `${Math.min(index * 50, 500)}ms`,
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease'
            }}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default ResultsList;
