import React from 'react'
import { Link } from 'react-router-dom'

const Manager = ({ activeTab, base_url }) => {
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

      <Link to='/admin/branches' className={`nav-option ${activeTab === 'branches' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'branches' ? 'global_w' : 'global'}.png`}
          className="nav-img"
          alt="branches" 
        />
        <h3 className='mb-0 fs-6'>Branch Lists</h3>
      </Link>

      <Link to='/admin/users' className={`nav-option ${activeTab === 'users' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'users' ? 'staff_w' : 'staff'}.png`}
          className="nav-img"
          alt="users" 
        />
        <h3 className='mb-0 fs-6'>Users</h3>
      </Link>

      <Link to='/admin/tables' className={`nav-option ${activeTab === 'tables' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'tables' ? 'tables_w' : 'tables'}.png`}
          className="nav-img"
          alt="tables" 
        />
        <h3 className='mb-0 fs-6'>Table Lists</h3>
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

      <Link to='/admin/vendors' className={`nav-option ${activeTab === 'vendors' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'vendors' ? 'vendor_w' : 'vendor'}.png`}
          className="nav-img"
          alt="vendors" 
        />
        <h3 className='mb-0 fs-6'>Vendors</h3>
      </Link>

      <Link to='/admin/vendoritems' className={`nav-option ${activeTab === 'vendoritems' ? 'option1' : ''} text-decoration-none`}>
        <img 
          src={`${base_url}src/assets/images/icons/${activeTab === 'vendoritems' ? 'vendor_w' : 'vendor'}.png`}
          className="nav-img"
          alt="vendors" 
        />
        <h3 className='mb-0 fs-6'>Vendors items list</h3>
      </Link>
    </div>
  )
}

export default Manager