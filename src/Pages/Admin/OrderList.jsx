import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { Link } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const userApi = `${ENV.base_url}users/email`;

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
                fetchOrders(adminData.store_id);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const fetchOrders = async (storeId) => {
        try {
            const response = await axios.get(`${ENV.base_url}orders/${storeId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
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
                            <h1 className="recent-Articles">Order List</h1>
                            <Link to='/admin/addorder' className="btn view">Add</Link>
                        </div>
                        <div className="report-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Branch</th>
                                        <th>Table</th>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Menu Items</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.branch.name}</td>
                                                <td>{order.table.table_number}</td>
                                                <td>{order.user.name}</td>
                                                <td>{order.status}</td>
                                                <td>
                                                    {order.items.map(item => (
                                                        <div key={item.id}>
                                                            <strong>{item.menu_item.name}</strong> - Qty: {item.quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm">Edit</button>
                                                    <button className="btn btn-danger btn-sm">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No orders found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderList;
