'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  active: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchHeroData = async (retry = 0) => {
    try {
      const response = await fetch('http://localhost:5000/api/hero', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHeroData(data);
      setLoading(false);
      setError('');
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching hero data:', err);
      
      if (retry < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retry + 1} of ${MAX_RETRIES}`);
        setTimeout(() => fetchHeroData(retry + 1), RETRY_DELAY);
        setRetryCount(retry + 1);
      } else {
        setError('Failed to load hero section');
        setLoading(false);
        toast.error('Failed to load hero section. Please refresh the page.');
      }
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          {retryCount > 0 && (
            <p className="text-gray-600">
              Connecting to server... Attempt {retryCount} of {MAX_RETRIES}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error || !heroData) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Restaurant</h1>
          <p className="text-gray-600 mb-8">Experience authentic Tunisian cuisine</p>
          <button
            onClick={() => {
              setLoading(true);
              setError('');
              fetchHeroData();
            }}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={`http://localhost:5000/${heroData.image}`}
          alt={heroData.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
          onError={() => {
            setError('Failed to load image');
            toast.error('Failed to load hero image');
          }}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{heroData.title}</h1>
          <h2 className="text-2xl md:text-3xl mb-4">{heroData.subtitle}</h2>
          <p className="text-lg md:text-xl mb-8">{heroData.description}</p>
        </div>
      </div>
    </div>
  );
}