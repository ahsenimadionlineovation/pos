// src/components/AddVendor.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { fetchUserData } from '../../utils/fetchUserData';

const AddVendor = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact_info: '',
        address: '',
        vendor_type: '',
        store_id: null,
    });

    const [navClose, setNavClose] = useState(false);
    const activeTab = 'vendors';

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            try {
                const userData = await fetchUserData();
                setFormData((prevData) => ({
                    ...prevData,
                    store_id: userData.store_id,
                }));
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };

        initialize();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/vendors', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            navigate('/admin/vendors');
        } catch (error) {
            console.error('Error adding vendor:', error);
        }
    };

    return (
        <>
            <AdminHeader onMenuClick={toggleNav} />
            <div className="main-container">
                <AdminSidebar navClose={navClose} activeTab={activeTab} />
                <div className="main">
                    <div className="report-container">
                        <div className="report-header">
                            <h1 className="recent-Articles">Add Vendor</h1>
                        </div>
                        <div className="report-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="contact_info">Contact Info</label>
                                    <input
                                        type="text"
                                        id="contact_info"
                                        name="contact_info"
                                        value={formData.contact_info}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="vendor_type">Vendor Type</label>
                                    <input
                                        type="text"
                                        id="vendor_type"
                                        name="vendor_type"
                                        value={formData.vendor_type}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Add Vendor</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddVendor;
