import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag, FaExternalLinkAlt } from 'react-icons/fa';
import { GarageSale } from '../types';

const Card = styled.article`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div<{ imageUrl?: string }>`
  height: 160px;
  background-color: #f3f4f6;
  background-image: ${({ imageUrl }) => imageUrl ? `url(${imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
  }
`;

const Content = styled.div`
  padding: 1.25rem;
`;

const Header = styled.div`
  margin-bottom: 0.75rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const Preview = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  font-style: italic;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: #4b5563;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: #6b7280;
  }
`;

const DistanceBadge = styled.span`
  display: inline-block;
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const SourceBadge = styled.span`
  display: inline-block;
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const Description = styled.p`
  color: #4b5563;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 1rem 0 0 0;
`;

const ViewDetails = styled.a`
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  margin-top: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 0.25rem;
    font-size: 0.75em;
  }
`;

interface GarageSaleCardProps {
  sale: GarageSale;
}

const GarageSaleCard: React.FC<GarageSaleCardProps> = ({ sale }) => {
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeStr: string) => {
    // Convert 24h to 12h format if needed
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      {sale.imageUrl && <ImageContainer imageUrl={sale.imageUrl} />}
      <Content>
        <Header>
          <Title>{sale.title}</Title>
          {sale.preview && <Preview>{sale.preview}</Preview>}
          <SourceBadge>{sale.source}</SourceBadge>
          {sale.distance !== undefined && (
            <DistanceBadge>
              {sale.distance} {sale.distanceUnit || 'mi'} away
            </DistanceBadge>
          )}
        </Header>
        
        <Meta>
          <MetaItem>
            <FaMapMarkerAlt />
            <span>{sale.address}, {sale.city}, {sale.state} {sale.zipCode}</span>
          </MetaItem>
          <MetaItem>
            <FaCalendarAlt />
            <span>{formatDate(sale.startDate)}{sale.endDate && sale.endDate !== sale.startDate ? ` - ${formatDate(sale.endDate)}` : ''}</span>
          </MetaItem>
          <MetaItem>
            <FaClock />
            <span>{formatTime(sale.startTime)} - {formatTime(sale.endTime)}</span>
          </MetaItem>
          {sale.price && (
            <MetaItem>
              <FaTag />
              <span>{sale.price}</span>
            </MetaItem>
          )}
        </Meta>
        
        {sale.description && <Description>{sale.description}</Description>}
        
        {sale.url && (
          <ViewDetails href={sale.url} target="_blank" rel="noopener noreferrer">
            View details <FaExternalLinkAlt />
          </ViewDetails>
        )}
      </Content>
    </Card>
  );
};

export default GarageSaleCard;
