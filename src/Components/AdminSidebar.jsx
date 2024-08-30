import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ENV from '../../config.json';

const AdminSidebar = ({ navClose, activeTab }) => {
  const logout = ENV.base_url + 'logout';
  const navigate = useNavigate();
  const base_url = ENV.site_url;

  const handleLogout = async () => {
    try {
      await axios.post(logout, {}, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      // Clear localStorage
      localStorage.removeItem('auth_email');
      localStorage.removeItem('auth_token');

      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={`navcontainer ${navClose ? 'navclose' : ''}`}>
      <nav className="nav">
        <div className="nav-upper-options">
          <a href='/admin' className={`nav-option ${activeTab === 'dashboard' ? 'option1' : ''} text-decoration-none`}>
            <img 
              src={`${base_url}src/assets/images/icons/${activeTab === 'dashboard' ? 'dashboard_w' : 'dashboard'}.png`}
              className="nav-img"
              alt="dashboard" 
            />
            <h3 className='mb-0 fs-6'>Dashboard</h3>
          </a>
          <a href='/admin/users' className={`nav-option ${activeTab === 'users' ? 'option1' : ''} text-decoration-none`}>
            <img 
              src={`${base_url}src/assets/images/icons/${activeTab === 'users' ? 'staff_w' : 'staff'}.png`}
              className="nav-img"
              alt="users" 
            />
            <h3 className='mb-0 fs-6'>Users</h3>
          </a>
          <a href='/admin/branches' className={`nav-option ${activeTab === 'branches' ? 'option1' : ''} text-decoration-none`}>
              <img 
                  src={`${base_url}src/assets/images/icons/${activeTab === 'branches' ? 'global_w' : 'global'}.png`}
                  className="nav-img"
                  alt="branches" 
              />
              <h3 className='mb-0 fs-6'>Branch Lists</h3>
          </a>
          <a href='/admin/tables' className={`nav-option ${activeTab === 'tables' ? 'option1' : ''} text-decoration-none`}>
            <img 
              src={`${base_url}src/assets/images/icons/${activeTab === 'tables' ? 'tables_w' : 'tables'}.png`}
              className="nav-img"
              alt="tables" 
            />
            <h3 className='mb-0 fs-6'>Table Lists</h3>
          </a>
          <a href='/admin/menu-items' className={`nav-option ${activeTab === 'menu-items' ? 'option1' : ''} text-decoration-none`}>
            <img 
              src={`${base_url}src/assets/images/icons/${activeTab === 'menu-items' ? 'list_w' : 'list'}.png`}
              className="nav-img"
              alt="menu-items" 
            />
            <h3 className='mb-0 fs-6'>Menu items Lists</h3>
          </a>
          <a href='/admin/orders' className={`nav-option ${activeTab === 'order' ? 'option1' : ''} text-decoration-none`}>
            <img 
              src={`${base_url}src/assets/images/icons/${activeTab === 'order' ? 'orders_w' : 'orders'}.png`}
              className="nav-img"
              alt="orders" 
            />
            <h3 className='mb-0 fs-6'>Order Lists</h3>
          </a>
          {/* <a href='/admin/customers' className={`nav-option ${activeTab === 'customer' ? 'option1' : ''} text-decoration-none`}>
            <img 
              src={`${base_url}src/assets/images/icons/${activeTab === 'customer' ? 'customers_w' : 'customers'}.png`}
              className="nav-img"
              alt="customers" 
            />
            <h3 className='mb-0 fs-6'>Customers</h3>
          </a> */}
          <a href='/admin' className="nav-option option5 text-decoration-none">
            <img 
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png"
              className="nav-img"
              alt="profile" 
            />
            <h3 className='mb-0 fs-6'>Profile</h3>
          </a>
          <a href='/admin' className="nav-option option6 text-decoration-none">
            <img 
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/4.png"
              className="nav-img"
              alt="settings" 
            />
            <h3 className='mb-0 fs-6'>Settings</h3>
          </a>
          <a href='#' className="nav-option logout text-decoration-none" onClick={handleLogout}>
            <img 
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
              className="nav-img"
              alt="logout" 
            />
            <h3 className='mb-0 fs-6'>Logout</h3>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
