import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { Link } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const userApi = `${ENV.base_url}users/email`;
    const [loading, setLoading] = useState(true);
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'order';

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
        } finally {
            setLoading(false); 
        }
    };

    const calculateNetPrice = (items) => {
        return items.reduce((total, item) => {
            return total + (item.menu_item.price * item.quantity);
        }, 0).toFixed(2); // rounding to 2 decimal places
    };

    // Group orders by branch
    const groupOrdersByBranch = (orders) => {
        return orders.reduce((groupedOrders, order) => {
            const branchName = order.branch.name;
            if (!groupedOrders[branchName]) {
                groupedOrders[branchName] = [];
            }
            groupedOrders[branchName].push(order);
            return groupedOrders;
        }, {});
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const groupedOrders = groupOrdersByBranch(orders);

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
                                        <h1 className="recent-Articles">Order List</h1>
                                        <Link to='/admin/addorder' className="btn view">Add</Link>
                                    </div>
                                    <div className="report-body">
                                    <div className="accordion accordion-flush" id="accordionFlushExample">
                                    {Object.keys(groupedOrders).map((branchName, index) => (
                                        <div className="accordion-item" key={branchName}>
                                            <h2 className="accordion-header" id={`flush-heading${index}`}>
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                                                    {branchName} {/* Branch name as accordion header */}
                                                </button>
                                            </h2>
                                            <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div className="card-body table-responsive">
                                                        <table className="table table-bordered table-striped table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Table</th>
                                                                    <th>User</th>
                                                                    <th>Status</th>
                                                                    <th>Menu Items</th>
                                                                    <th>Net Price</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {groupedOrders[branchName].map(order => (
                                                                    <tr key={order.id}>
                                                                        <td>{order.id}</td>
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
                                                                        <td>{calculateNetPrice(order.items)} INR</td>
                                                                        <td>
                                                                            <button className="btn btn-primary btn-sm">Edit</button>
                                                                            <button className="btn btn-danger btn-sm">Delete</button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
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
};

export default OrderList;
