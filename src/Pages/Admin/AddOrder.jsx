import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { useNavigate } from 'react-router-dom';

const AddOrder = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        store_id: '',
        branch_id: '',
        table_id: '',
        user_id: '',
        status: 'preparing',
        menu_items: []  // Array to hold selected menu items and their quantities
    });
    const [branches, setBranches] = useState([]);
    const [tables, setTables] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    
    const userApi = `${ENV.base_url}users/email`;
    const branchesApi = `${ENV.base_url}branches/store`;
    const tablesApi = `${ENV.base_url}tables/branch`;
    const menuItemsApi = `${ENV.base_url}menu-items/branch`;

    // Fetch user data and update order state with store_id and user_id
    const fetchUserData = async () => {
        const authEmail = localStorage.getItem('auth_email');
        if (authEmail) {
            try {
                const response = await axios.get(`${userApi}/${authEmail}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                const adminData = response.data.user;
                setOrder(prevOrder => ({
                    ...prevOrder,
                    store_id: adminData.store_id,
                    user_id: adminData.id,
                }));
                fetchBranches(adminData.store_id);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    // Fetch branches based on store_id
    const fetchBranches = async (storeId) => {
        try {
            const response = await axios.get(`${branchesApi}/${storeId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setBranches(response.data.branches || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
        }
    };

    // Fetch tables based on branch_id
    const fetchTables = async (branchId) => {
        try {
            const response = await axios.get(`${tablesApi}/${branchId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setTables(response.data || []);
        } catch (error) {
            console.error('Error fetching tables:', error);
            setTables([]);
        }
    };

    // Fetch menu items based on branch_id
    const fetchMenuItems = async (branchId) => {
        try {
            const response = await axios.get(`${menuItemsApi}/${branchId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMenuItems(response.data || []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setMenuItems([]);
        }
    };

    // Handle input changes for order form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrder(prevOrder => ({
            ...prevOrder,
            [name]: value,
        }));

        if (name === 'branch_id') {
            fetchTables(value);
            fetchMenuItems(value);
        }
    };

    // Handle changes to menu item quantities
    const handleMenuItemChange = (menuItemId, quantity) => {
        setOrder(prevOrder => {
            const updatedMenuItems = [...prevOrder.menu_items];
            const existingItemIndex = updatedMenuItems.findIndex(item => item.menuitem_id === menuItemId);

            if (existingItemIndex > -1) {
                updatedMenuItems[existingItemIndex].quantity = parseInt(quantity, 10);
            } else {
                updatedMenuItems.push({ menuitem_id: menuItemId, quantity: parseInt(quantity, 10) });
            }

            return {
                ...prevOrder,
                menu_items: updatedMenuItems
            };
        });
    };

    // Convert order object to query string format
    const formatOrderForAPI = () => {
        const params = new URLSearchParams();
        params.append('store_id', order.store_id);
        params.append('branch_id', order.branch_id);
        params.append('table_id', order.table_id);
        params.append('user_id', order.user_id);
        order.menu_items.forEach((item, index) => {
            params.append(`items[${index}][menuitem_id]`, item.menuitem_id);
            params.append(`items[${index}][quantity]`, item.quantity);
        });
        return params;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const params = formatOrderForAPI();
            console.log(params)
            const response = await axios.post(`${ENV.base_url}orders`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            // Handle successful order submission
            console.log('Order submitted successfully:', response.data);
            // Redirect or display success message as needed
            navigate('/admin/orders');
        } catch (error) {
            console.error('Error adding order:', error);
            // Handle error (e.g., display error message to user)
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
                            <h1 className="recent-Articles">Add Order</h1>
                        </div>
                        <div className="report-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label>Branch</label>
                                    <select
                                        name="branch_id"
                                        value={order.branch_id}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Table</label>
                                    <select
                                        name="table_id"
                                        value={order.table_id}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Table</option>
                                        {tables.map(table => (
                                            <option key={table.id} value={table.id}>{table.table_number}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label>Menu Items</label>
                                    {menuItems.map(menuItem => (
                                        <div key={menuItem.id} className="form-group mb-2">
                                            <label>{menuItem.name} (Stock: {menuItem.stock})</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={menuItem.stock}
                                                value={
                                                    order.menu_items.find(
                                                        item => item.menuitem_id === menuItem.id
                                                    )?.quantity || 0
                                                }
                                                onChange={(e) =>
                                                    handleMenuItemChange(
                                                        menuItem.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="form-control"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <input type="hidden" name="store_id" value={order.store_id} />
                                <input type="hidden" name="user_id" value={order.user_id} />
                                <div className="form-group mb-3">
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        value={order.status}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="preparing">Preparing</option>
                                        <option value="done">Done</option>
                                        <option value="cancel">Cancel</option>
                                    </select>
                                </div>
                                
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddOrder;
