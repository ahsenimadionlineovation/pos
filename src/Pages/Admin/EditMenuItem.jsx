import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';

const EditMenuItem = () => {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState({
        name: '',
        price: '',
        stock: '',
        store_id: '',
        branch_id: '',
        user_id: ''
    });
    const menuApi = `${ENV.base_url}menu-items/${id}`;
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
                setMenuItem((prevMenuItem) => ({
                    ...prevMenuItem,
                    store_id: adminData.store_id,
                    user_id: adminData.id,
                }));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const fetchMenuItem = async () => {
        try {
            const response = await axios.get(menuApi, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMenuItem(response.data);
        } catch (error) {
            console.error('Error fetching menu item:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchMenuItem();
    }, []);

    const handleInputChange = (e) => {
        setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(menuApi, menuItem, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            // Redirect or display success message
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    };

    return (
        <>
            <AdminHeader />
            <div className="main-container">
                <AdminSidebar />
                <div className="main">
                    <div className="report-container">
                        <div className="report-header">
                            <h1 className="recent-Articles">Edit Menu Item</h1>
                        </div>
                        <div className="report-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={menuItem.name}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={menuItem.price}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={menuItem.stock}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    />
                                </div>
                                <input type="hidden" name="store_id" value={menuItem.store_id} />
                                <input type="hidden" name="user_id" value={menuItem.user_id} />
                                <div className="form-group">
                                    <label>Branch</label>
                                    <select
                                        name="branch_id"
                                        value={menuItem.branch_id}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Branch</option>
                                        {/* Populate options based on fetched branches */}
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
}

export default EditMenuItem;
