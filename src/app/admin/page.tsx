'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContentStats {
  hero: number;
  menu: number;
  gallery: number;
  about: number;
  contact: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<ContentStats>({
    hero: 0,
    menu: 0,
    gallery: 0,
    about: 0,
    contact: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/content', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await res.json();
      
      // Calculate stats from content data
      const newStats = {
        hero: data.filter((item: any) => item.section === 'hero').length,
        menu: data.filter((item: any) => item.section === 'menu').length,
        gallery: data.filter((item: any) => item.section === 'gallery').length,
        about: data.filter((item: any) => item.section === 'about').length,
        contact: data.filter((item: any) => item.section === 'contact').length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(stats).map(([section, count]) => (
          <div
            key={section}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-700 capitalize mb-2">
              {section}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-teal-600">{count}</p>
              <button
                onClick={() => router.push(`/admin/${section}`)}
                className="text-teal-600 hover:text-teal-700"
              >
                Manage →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/menu')}
            className="p-4 text-left bg-teal-50 rounded-lg hover:bg-teal-100"
          >
            <h3 className="font-semibold text-teal-700">Update Menu</h3>
            <p className="text-sm text-teal-600">Add or modify menu items</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/gallery')}
            className="p-4 text-left bg-cyan-50 rounded-lg hover:bg-cyan-100"
          >
            <h3 className="font-semibold text-cyan-700">Manage Gallery</h3>
            <p className="text-sm text-cyan-600">Upload or remove images</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/contact')}
            className="p-4 text-left bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <h3 className="font-semibold text-blue-700">Update Contact</h3>
            <p className="text-sm text-blue-600">Edit contact information</p>
          </button>
        </div>
      </div>
    </div>
  );
}
