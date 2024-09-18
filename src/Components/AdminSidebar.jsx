import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../utils/fetchUserData';
import ENV from '../../config.json';
import Owner from './Navbar/Owner';
import Manager from './Navbar/Manager';
import Server from './Navbar/Server';
import Kitchen from './Navbar/Kitchen';

const AdminSidebar = ({ navClose, activeTab }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const base_url = ENV.site_url;

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetchUserData();
        setUserData(response);
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to initialize user data.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className={`navcontainer ${navClose ? 'navclose' : ''}`}>
      <nav className="nav">
        <div className="nav-upper-options">
          {loading && 
            <div>Loading...</div>
          }
          {userData?.role === 'owner' && (
            <Owner activeTab={activeTab} base_url={base_url} />
          )}
          {userData?.role === 'manager' && (
            <Manager activeTab={activeTab} base_url={base_url} />
          )}
          {userData?.role === 'server' && (
            <Server activeTab={activeTab} base_url={base_url} />
          )}
          {userData?.role === 'kitchen' && (
            <Kitchen activeTab={activeTab} base_url={base_url} />
          )}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
