import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../utils/fetchUserData';
import axios from 'axios';
import ENV from '../../config.json';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuClick }) => {
  const [userData, setUserData] = useState(null); 
  const [storeData, setStoreData] = useState(null);
  const [branchData, setBranchData] = useState(null)
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const logout = ENV.base_url + 'logout';
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(logout, {}, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      localStorage.removeItem('auth_email');
      localStorage.removeItem('auth_token');

      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchStoreData = async (storeId) => {
    try {
      const response = await axios.get(`${ENV.base_url}users/storedata/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setStoreData(response.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setError('Failed to fetch store data.');
    }
  };

  const fetchBranchData = async (branchId) => {
    try {
      const response = await axios.get(`${ENV.base_url}branches/${branchId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setBranchData(response.data);
    } catch (error) {
      console.error('Error fetching branch data:', error);
      setError('Failed to fetch branch data.');
    }
  };

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

  useEffect(() => {
    if (userData && userData.store_id) {
      fetchStoreData(userData.store_id);
      if(userData.branch_id != null) {
        fetchBranchData(userData.branch_id);
      }
    }
  }, [userData]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <header>
      <div className="row w-100">
        <div className="col-6 col-md-3 col-lg-2 my-auto">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 me-5">POS</h4>
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
              className="icn menuicn"
              id="menuicn"
              alt="menu-icon"
              onClick={onMenuClick}
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-8 text-center my-auto d-none d-md-block">
          <h6 className='mb-0'>
          {loading ? (
            <>Loading...</>
            ) : (
              <>
                <>Store name: <span className="text-primary">{storeData?.store?.store_name || 'Loading...'}</span></>
                {userData.branch_id && <>, Branch: <span className="text-primary">{branchData?.branch.name}</span></>}
              </>
            )
          }
          </h6>
        </div>
        <div className="col-6 col-md-3 col-lg-2 text-end">
          <div className="dropdown">
            <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-user"></i> {userData?.name}
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="/admin/profile">Profile</a></li>
              <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
