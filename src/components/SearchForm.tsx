import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { FaMagnifyingGlass, FaLocationDot } from 'react-icons/fa6';
import styled from 'styled-components';
import { DataSource } from '../types';

const Form = styled.form`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 0.5rem;
  }
`;

interface SearchFormProps {
  onSearch: (location: string, selectedSources: string[]) => void;
  isLoading: boolean;
  sources: DataSource[];
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, sources }) => {
  const [location, setLocation] = useState('');
  const [isValidZip, setIsValidZip] = useState(true);
  // Start with all enabled sources selected by default
  const [selectedSources, setSelectedSources] = useState<string[]>(
    sources.filter(source => source.enabled).map(source => source.id)
  );
  
  // Update selected sources when the sources prop changes
  React.useEffect(() => {
    setSelectedSources(
      sources.filter(source => source.enabled).map(source => source.id)
    );
  }, [sources]);

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (!publicKey) {
      console.error('EmailJS public key is not set in environment variables');
      return;
    }
    emailjs.init(publicKey);
  }, []);

  const sendEmail = async (zipCode: string) => {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

    try {
      const response = await emailjs.send(
        serviceId || '',
        templateId || '',
        {
          to_email: 'aaron123t@gmail.com',
          zip_code: zipCode,
          date: new Date().toLocaleString(),
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to send email. Details:', {
        error,
        serviceId,
        templateId,
        publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? '****' + process.env.REACT_APP_EMAILJS_PUBLIC_KEY.slice(-4) : 'Not found'
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const zipCode = location.trim();
    const isValid = /^\d{5}$/.test(zipCode);
    setIsValidZip(isValid);
    
    if (isValid && selectedSources.length > 0) {
      // Send email notification
      await sendEmail(zipCode);
      
      // Proceed with the search
      onSearch(zipCode, selectedSources);
      
      // Scroll to the loading element after a short delay to ensure it's rendered
      setTimeout(() => {
        const loadingElement = document.getElementById('loading-results');
        if (loadingElement) {
          loadingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input and limit to 5 digits
    if (value === '' || /^\d{0,5}$/.test(value)) {
      setLocation(value);
      if (value.length === 5) {
        setIsValidZip(true);
      }
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="location">ZIP Code</Label>
        <div style={{ position: 'relative' }}>
          <Input
            id="location"
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            placeholder="Enter 5-digit ZIP code"
            value={location}
            onChange={handleLocationChange}
            style={!isValidZip && location.length === 5 ? { borderColor: '#ef4444' } : {}}
            required
          />
          <FaLocationDot 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} 
          />
        </div>
        {!isValidZip && location.length === 5 && (
          <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Please enter a valid 5-digit ZIP code
          </div>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>Data Sources</Label>
        <CheckboxContainer>
          {sources.map((source) => (
            <CheckboxLabel key={source.id} style={{
              padding: '8px 12px',
              border: selectedSources.includes(source.id) ? '2px solid #3b82f6' : '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: selectedSources.includes(source.id) ? '#ebf5ff' : 'white'
            }}>
              <input
                type="checkbox"
                checked={selectedSources.includes(source.id)}
                onChange={() => toggleSource(source.id)}
                disabled={!source.enabled}
                style={{ transform: 'scale(1.2)' }}
              />
              {source.name}
            </CheckboxLabel>
          ))}
        </CheckboxContainer>
        <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#4b5563' }}>
          <strong>Note:</strong> Please enter a 5-digit US ZIP code (e.g., 10001, 90210).
        </div>
      </FormGroup>
      
      <Button type="submit" disabled={isLoading || !location || selectedSources.length === 0}>
          <FaMagnifyingGlass />
        {isLoading ? 'Searching...' : 'Find Garage Sales'}
      </Button>
    </Form>
  );
};

export default SearchForm;
