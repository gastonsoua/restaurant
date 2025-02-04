'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const Section = styled.section`
  padding: 6rem 2rem;
  background: ${props => props.dark ? '#2d3436' : '#fff'};
  color: ${props => props.dark ? '#fff' : '#2d3436'};
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
`;

const GlowingBorder = styled.div`
  position: relative;
  border-radius: 15px;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6c5ce7, #ff6b6b);
    background-size: 400% 400%;
    z-index: -1;
    border-radius: 16px;
    animation: borderGlow 3s ease infinite;
  }

  @keyframes borderGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const FloatingElement = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MenuTitle = styled.h3`
  font-size: 1.5rem;
  margin: 1rem 0;
  color: #2d3436;
`;

const MenuDescription = styled.p`
  color: #636e72;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const MenuPrice = styled.span`
  font-weight: bold;
  color: #ff6b6b;
  font-size: 1.2rem;
`;

const CategoryTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: inherit;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  
  &:after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #ff6b6b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
`;

const RetryButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #fa5252;
  }
`;

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/menu', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.statusText}`);
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (err: any) {
      console.error('Error fetching menu:', err);
      setError(err.message);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    if (item.isAvailable) {
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <Section>
        <LoadingSpinner />
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <ErrorContainer>
          <p>{error}</p>
          <RetryButton onClick={fetchMenuItems}>
            Retry Loading Menu
          </RetryButton>
        </ErrorContainer>
      </Section>
    );
  }

  if (Object.keys(groupedMenuItems).length === 0) {
    return (
      <Section>
        <ErrorContainer>
          <p>No menu items available at the moment.</p>
          <RetryButton onClick={fetchMenuItems}>
            Refresh Menu
          </RetryButton>
        </ErrorContainer>
      </Section>
    );
  }

  return (
    <Section>
      {Object.entries(groupedMenuItems).map(([category, items]) => (
        <div key={category} className="mb-12">
          <CategoryTitle>{category}</CategoryTitle>
          <MenuGrid>
            {items.map((item) => (
              <GlowingBorder key={item._id}>
                <FloatingElement>
                  <div className="relative h-48 mb-4">
                    <Image
                      src={`http://localhost:5000/${item.image}`}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-food.jpg';
                      }}
                    />
                  </div>
                  <MenuTitle>{item.name}</MenuTitle>
                  <MenuDescription>{item.description}</MenuDescription>
                  <MenuPrice>{item.price.toFixed(2)} €</MenuPrice>
                </FloatingElement>
              </GlowingBorder>
            ))}
          </MenuGrid>
        </div>
      ))}
    </Section>
  );
}
