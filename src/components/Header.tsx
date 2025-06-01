import React from 'react';
import styled from 'styled-components';
import { FaMagnifyingGlassDollar } from 'react-icons/fa6';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  margin: 0;
  opacity: 0.9;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Title>
        <FaMagnifyingGlassDollar />
        Garage Sale Finder
      </Title>
      <Subtitle>Discover the best garage sales in your area</Subtitle>
    </HeaderContainer>
  );
};

export default Header;
