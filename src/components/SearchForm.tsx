import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
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
  onSearch: (zipCode: string, selectedSources: string[]) => void;
  isLoading: boolean;
  sources: DataSource[];
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, sources }) => {
  const [zipCode, setZipCode] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(sources.filter(s => s.enabled).map(s => s.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim() && selectedSources.length > 0) {
      onSearch(zipCode, selectedSources);
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
        <Label htmlFor="zipCode">Zip Code</Label>
        <div style={{ position: 'relative' }}>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter zip code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
            required
          />
          <FaMapMarkerAlt 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} 
          />
        </div>
      </FormGroup>
      
      <FormGroup>
        <Label>Data Sources</Label>
        <CheckboxContainer>
          {sources.map((source) => (
            <CheckboxLabel key={source.id}>
              <input
                type="checkbox"
                checked={selectedSources.includes(source.id)}
                onChange={() => toggleSource(source.id)}
                disabled={!source.enabled}
              />
              {source.name}
            </CheckboxLabel>
          ))}
        </CheckboxContainer>
      </FormGroup>
      
      <Button type="submit" disabled={isLoading || !zipCode || selectedSources.length === 0}>
        <FaSearch />
        {isLoading ? 'Searching...' : 'Find Garage Sales'}
      </Button>
    </Form>
  );
};

export default SearchForm;
