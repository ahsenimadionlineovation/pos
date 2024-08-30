import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { Link } from 'react-router-dom';

const MenuItemList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [branches, setBranches] = useState([]);
    const userApi = `${ENV.base_url}users/email`;
    const branchesApi = `${ENV.base_url}branches/store`;

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
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <>
            <AdminHeader />
            <div className="main-container">
                <AdminSidebar />
                <div className="main">
                    <div className="report-container">
                        <div className="report-header">
                            <h1 className="recent-Articles">Menu Items List</h1>
                            <Link to="/admin/add-menu-item" className="btn btn-primary">Add</Link>
                        </div>
                        <div className="report-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Store</th>
                                        <th>Branch</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.stock}</td>
                                            <td>{branches.find(branch => branch.id === item.branch_id)?.name}</td>
                                            <td>{branches.find(branch => branch.id === item.branch_id)?.name}</td>
                                            <td>
                                                <a href={`/admin/editmenuitem/${item.id}`} className="btn btn-warning">Edit</a>
                                                {/* Add delete functionality here */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuItemList;
