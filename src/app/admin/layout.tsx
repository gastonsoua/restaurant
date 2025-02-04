'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } else {
      try {
        // Verify token is valid
        fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (!res.ok) {
            throw new Error('Invalid token');
          }
          setIsAuthenticated(true);
        }).catch(() => {
          // If token is invalid, clear storage and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        });
      } catch (error) {
        console.error('Auth error:', error);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    }
  }, [pathname, router]);

  const isActive = (path: string) => pathname === `/admin${path}`;

  const menuItems = [
    { path: '', label: 'Dashboard', icon: 'grid' },
    { path: '/hero', label: 'Hero Section', icon: 'image' },
    { path: '/menu', label: 'Menu Section', icon: 'menu' },
    { path: '/gallery', label: 'Gallery', icon: 'camera' },
    { path: '/about', label: 'About', icon: 'info' },
    { path: '/contact', label: 'Contact', icon: 'phone' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      // Call backend logout endpoint
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Show error message to user
      alert('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render anything until the component is mounted
  if (!isMounted) {
    return null;
  }

  // If not authenticated and not on login page, don't show the layout
  if (!isAuthenticated && pathname !== '/admin/login') {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // If on login page, don't show the sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700">Logging out...</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {isAuthenticated && (
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-teal-800">
            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl font-semibold text-white">Admin Panel</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-300 lg:hidden hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={`/admin${item.path}`}
                    className={`flex items-center p-2 text-white rounded-lg hover:bg-teal-700 group ${
                      isActive(item.path) ? 'bg-teal-700' : ''
                    }`}
                  >
                    <span className="ms-3">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-teal-700 group ${
                    isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  <span className="ms-3">
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className={`p-4 ${isAuthenticated && isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Toggle sidebar button */}
        {isAuthenticated && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
