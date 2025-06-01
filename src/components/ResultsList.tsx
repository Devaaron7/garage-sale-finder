import React from 'react';
import styled from 'styled-components';
import { FaLocationDot, FaFaceSadTear } from 'react-icons/fa6';
import { GarageSale } from '../types';
import GarageSaleCard from './GarageSaleCard';

const Container = styled.div`
  margin-top: 2rem;
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

interface ResultsListProps {
  sales: GarageSale[];
  isLoading: boolean;
  hasSearched: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ sales, isLoading, hasSearched }) => {
  if (isLoading) {
    return (
      <Container>
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
      <Grid>
        {sales.map((sale) => (
          <GarageSaleCard key={`${sale.source}-${sale.id}`} sale={sale} />
        ))}
      </Grid>
    </Container>
  );
};

export default ResultsList;
