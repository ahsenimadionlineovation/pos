import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { Link } from 'react-router-dom';

const MenuItemList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const userApi = `${ENV.base_url}users/email`;
    const branchesApi = `${ENV.base_url}branches/store`;
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'menuitems';

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    const fetchUserData = async () => {
        const authEmail = localStorage.getItem('auth_email');
        if (authEmail) {
            try {
                const response = await axios.get(`${userApi}/${authEmail}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                const adminData = response.data.user;
                fetchBranches(adminData.store_id); // Fetch branches after getting store_id
                fetchMenuItems(adminData.store_id);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const fetchBranches = async (storeId) => {
        try {
            const response = await axios.get(`${branchesApi}/${storeId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setBranches(response.data.branches); // Assuming API response has a 'branches' array
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchMenuItems = async (storeId) => {
        try {
            const response = await axios.get(`${ENV.base_url}menu-items/store/${storeId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Group menu items by branch
    const groupMenuItemsByBranch = () => {
        const grouped = branches.map(branch => ({
            branchName: branch.name,
            items: menuItems.filter(item => item.branch_id === branch.id)
        }));
        return grouped;
    };

    return (
        <>
            <AdminHeader onMenuClick={toggleNav} />
            <div className="main-container">
                <AdminSidebar navClose={navClose} activeTab={activeTab} />
                <div className="main">
                    <div className="report-container">
                        {loading ? (
                            <div className='text-center py-5'>Loading...</div>
                            ) : (
                                <>
                                    <div className="report-header">
                                        <h1 className="recent-Articles">Menu Items List</h1>
                                        <Link to="/admin/add-menu-item" className="btn btn-primary">Add</Link>
                                    </div>
                                    <div className="report-body">
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                        {groupMenuItemsByBranch().map((group, idx) => (
                                            <div className="accordion-item" key={idx}>
                                                <h2 className="accordion-header" id={`flush-heading${idx}`}>
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${idx}`} aria-expanded="false" aria-controls={`flush-collapse${idx}`}>
                                                        {group.branchName} {/* Branch name as accordion header */}
                                                    </button>
                                                </h2>
                                                <div id={`flush-collapse${idx}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${idx}`} data-bs-parent="#accordionFlushExample">
                                                    <div className="accordion-body">
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered table-striped table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Price</th>
                                                                        <th>Stock</th>
                                                                        <th>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {group.items.length > 0 ? (
                                                                        group.items.map((item) => (
                                                                            <tr key={item.id}>
                                                                                <td>{item.name}</td>
                                                                                <td>{item.price}</td>
                                                                                <td>{item.stock}</td>
                                                                                <td>
                                                                                    <Link to={`/admin/editmenuitem/${item.id}`} className="btn btn-warning">Edit</Link>
                                                                                    {/* Add delete functionality here */}
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="4">No menu items available for this branch.</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    </div>
                                    
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuItemList;
