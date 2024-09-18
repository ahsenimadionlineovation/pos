import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { fetchUserData } from '../../utils/fetchUserData';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [navClose, setNavClose] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const activeTab = 'vendors';

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const userData = await fetchUserData();
                setStoreId(userData.store_id);
                fetchVendors(userData.store_id);
            } catch (error) {
                console.error('Error initializing data:', error);
                setError('Failed to initialize user data.');
                setLoading(false); // Stop loading if there's an error
            }
        };

        initialize();
    }, []);

    const fetchVendors = async (storeId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/vendors/${storeId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setError('Failed to fetch vendors.');
        } finally {
            setLoading(false); // Stop loading after fetching data
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/vendors/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.status === 200) {
                setVendors(vendors.filter(vendor => vendor.id !== id));
            }
        } catch (error) {
            console.error('Error deleting vendor:', error);
            setError('Failed to delete vendor.');
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
                            <h1 className="recent-Articles">Vendor List</h1>
                            <Link to="/admin/addvendor" className="btn btn-primary">Add</Link>
                        </div>
                        <div className="report-body">
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Contact Info</th>
                                            <th>Address</th>
                                            <th>Vendor Type</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendors.length > 0 ? (
                                            vendors.map(vendor => (
                                                <tr key={vendor.id}>
                                                    <td>{vendor.id}</td>
                                                    <td>{vendor.name}</td>
                                                    <td>{vendor.contact_info}</td>
                                                    <td>{vendor.address}</td>
                                                    <td>{vendor.vendor_type}</td>
                                                    <td>
                                                        <Link to={`/vendors/edit/${vendor.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                                        <button onClick={() => handleDelete(vendor.id)} className="btn btn-danger btn-sm">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No vendors found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorList;
