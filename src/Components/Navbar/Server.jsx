import React from 'react'
import { Link } from 'react-router-dom'

const Server = ({ activeTab, base_url }) => {
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

      <Link to='/admin/menu-items' className={`nav-option ${activeTab === 'menuitems' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'menuitems' ? 'list_w' : 'list'}.png`}
          className="nav-img"
          alt="menu-items" 
        />
        <h3 className='mb-0 fs-6'>Menu items Lists</h3>
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

export default Server