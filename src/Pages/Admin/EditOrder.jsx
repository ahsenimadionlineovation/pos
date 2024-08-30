import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ENV from '../../../config.json';

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState({
        store_id: '',
        branch_id: '',
        table_id: '',
        user_id: '',
        status: 'preparing',
        menu_items: [],
    });
    const [branches, setBranches] = useState([]);
    const [tables, setTables] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`${ENV.base_url}orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const orderData = response.data.order;
            setOrder({
                store_id: orderData.store_id,
                branch_id: orderData.branch_id,
                table_id: orderData.table_id,
                user_id: orderData.user_id,
                status: orderData.status,
                menu_items: orderData.menu_items.map(item => ({
                    menuitem_id: item.id,
                    quantity: item.pivot.quantity
                })),
            });
            fetchBranches(orderData.store_id);
            fetchTables(orderData.branch_id);
            fetchMenuItems(orderData.branch_id);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const fetchBranches = async (storeId) => {
        try {
            const response = await axios.get(`${ENV.base_url}branches/store/${storeId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setBranches(response.data.branches || []);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
        }
    };

    const fetchTables = async (branchId) => {
        try {
            const response = await axios.get(`${ENV.base_url}tables/branch/${branchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setTables(response.data.tables || []);
        } catch (error) {
            console.error('Error fetching tables:', error);
            setTables([]);
        }
    };

    const fetchMenuItems = async (branchId) => {
        try {
            const response = await axios.get(`${ENV.base_url}menuitems/branch/${branchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMenuItems(response.data.menu_items || []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setMenuItems([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));

        if (name === 'branch_id') {
            fetchTables(value);
            fetchMenuItems(value);
        }
    };

    const handleMenuItemChange = (menuItemId, quantity) => {
        const updatedMenuItems = order.menu_items.map((item) =>
            item.menuitem_id === menuItemId
                ? { ...item, quantity: quantity }
                : item
        );
        setOrder({ ...order, menu_items: updatedMenuItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${ENV.base_url}orders/${id}`, order, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            // Redirect or display success message
            navigate('/orders');
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    useEffect(() => {
        fetchOrderDetails(id);
    }, [id]);

    return (
        <>
            <AdminHeader />
            <div className="main-container">
                <AdminSidebar />
                <div className="main">
                    <div className="report-container">
                        <div className="report-header">
                            <h1 className="recent-Articles">Edit Order</h1>
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
                                <button type="submit" className="btn btn-primary">Update Order</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditOrder;
