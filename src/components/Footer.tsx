import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1f2937;
  color: #9ca3af;
  padding: 2rem 1rem;
  margin-top: 4rem;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Copyright = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const Link = styled.a`
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const Attribution = styled.p`
  margin: 1rem 0 0 0;
  font-size: 0.75rem;
  opacity: 0.7;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Content>
        <Copyright>© {currentYear} Garage Sale Finder. All rights reserved.</Copyright>
        <Links>
          <Link href="https://github.com/Devaaron7" target="_blank" rel="noopener noreferrer">About The Developer</Link>
          <Link href="https://docs.google.com/document/d/1XmLuMtmiHbryYJoPEo0eq7LZk-4JgCxk/edit?usp=sharing&ouid=112285125414052650422&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer">Contact Me</Link>
        </Links>
        <Attribution>
          Garage sale data provided by various sources. We are not responsible for the accuracy of the information.
        </Attribution>
      </Content>
    </FooterContainer>
  );
};

export default Footer;
