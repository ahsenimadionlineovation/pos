import React from 'react'
import { Link } from 'react-router-dom'

const Cashier = ({ activeTab, base_url }) => {
  return (
    <div>
      <Link to='/admin' className={`nav-option ${activeTab === 'dashboard' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'dashboard' ? 'dashboard_w' : 'dashboard'}.png`}
          className="nav-img"
          alt="dashboard" 
        />
        <h3 className='mb-0 fs-6'>Dashboard</h3>
      </Link>

      <Link to='/admin/orders' className={`nav-option ${activeTab === 'order' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'order' ? 'orders_w' : 'orders'}.png`}
          className="nav-img"
          alt="orders" 
        />
        <h3 className='mb-0 fs-6'>Order Lists</h3>
      </Link>
    </div>
  )
}

export default Cashier