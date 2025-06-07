import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLocationDot, FaCalendar, FaClock, FaTag, FaArrowUpRightFromSquare, FaCamera, FaXmark } from 'react-icons/fa6';
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

interface ImageContainerProps {
  $imageUrl?: string;
}

const ImageContainer = styled.div<ImageContainerProps>`
  height: 160px;
  background-color: #f3f4f6;
  background-image: ${({ $imageUrl }) => $imageUrl ? `url(${$imageUrl})` : 'url(/garage-sale-placeholder.svg)'};
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: ${({ $imageUrl }) => $imageUrl ? 'pointer' : 'default'};
  overflow: hidden;
  
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

const PhotoCountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ImagePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const PopupContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const PopupImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
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
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: #3b82f6;
      text-decoration: underline;
    }
  }
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

const getSourceStyles = (source: string) => {
  switch(source.toLowerCase()) {
    case 'gsalr':
      return { bg: '#f3f4f6', text: '#4b5563' }; // Grey
    case 'mercari':
      return { bg: '#e0f2fe', text: '#0369a1' }; // Light Blue
    case 'ebay local':
      return { bg: '#fee2e2', text: '#b91c1c' }; // Red
    case 'craigslist':
      return { bg: '#dcfce7', text: '#166534' }; // Green
    case 'offerup':
      return { bg: '#f3e8ff', text: '#6b21a8' }; // Purple
    default:
      return { bg: '#f3f4f6', text: '#4b5563' }; // Default grey
  }
};

const SourceBadge = styled.span<{ source: string }>`
  display: inline-block;
  background-color: ${props => getSourceStyles(props.source).bg};
  color: ${props => getSourceStyles(props.source).text};
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
  style?: React.CSSProperties;
}

const GarageSaleCard: React.FC<GarageSaleCardProps> = ({ sale, style }) => {
  const [showImagePopup, setShowImagePopup] = useState(false);
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

  const handleImageClick = () => {
    if (sale.imageUrl && sale.imageUrl.trim() !== '') {
      console.log('Opening image popup for:', sale.imageUrl);
      setShowImagePopup(true);
    } else {
      console.log('No image URL available to show in popup');
    }
  };

  const handleClosePopup = () => {
    setShowImagePopup(false);
  };

  return (
    <Card data-testid="garage-sale-card" style={style}>
      <div style={{ position: 'relative' }}>
        <ImageContainer 
          $imageUrl={sale.imageUrl} 
          onClick={sale.imageUrl ? handleImageClick : undefined} 
          data-testid="image-container"
        />
        {sale.imageUrl && sale.photoCount && sale.photoCount > 0 && (
          <PhotoCountBadge>
            <FaCamera />
            <span>{sale.photoCount} {sale.photoCount === 1 ? 'photo' : 'photos'}</span>
          </PhotoCountBadge>
        )}
      </div>
      <Content>
        <Header>
          <Title>
            {sale.url ? (
              <a href={sale.url} target="_blank" rel="noopener noreferrer">
                {sale.title}
              </a>
            ) : (
              sale.title
            )}
          </Title>
          {sale.preview && <Preview>{sale.preview}</Preview>}
          <SourceBadge source={sale.source}>{sale.source}</SourceBadge>

        </Header>
        
        <Meta>
          <MetaItem>
            <FaLocationDot />
            <span>{sale.address}, {sale.city}, {sale.state} {sale.zipCode}</span>
          </MetaItem>

          {sale.price && (
            <MetaItem>
              <FaTag />
              <span>{sale.price}</span>
            </MetaItem>
          )}
        </Meta>
        
        {sale.url && (
          <ViewDetails href={sale.url} target="_blank" rel="noopener noreferrer">
            View details <FaArrowUpRightFromSquare />
          </ViewDetails>
        )}
      </Content>
      {showImagePopup && sale.imageUrl && (
        <ImagePopup onClick={handleClosePopup}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <PopupImage 
              src={sale.imageUrl} 
              alt={`${sale.title} - Full size image`} 
              onLoad={() => console.log('Image loaded successfully in popup:', sale.imageUrl)}
              onError={(e) => {
                // Handle image loading errors
                console.error('Error loading image:', sale.imageUrl);
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite error loop
                target.src = '/garage-sale-placeholder.svg';
              }}
            />
            <CloseButton onClick={handleClosePopup} aria-label="Close image">
              <FaXmark />
            </CloseButton>
          </PopupContent>
        </ImagePopup>
      )}
    </Card>
  );
};

export default GarageSaleCard;
