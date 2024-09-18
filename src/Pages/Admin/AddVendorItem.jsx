import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { fetchUserData } from '../../utils/fetchUserData';

const AddVendorItem = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [vendors, setVendors] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [navClose, setNavClose] = useState(false);
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://127.0.0.1:8000/api/vendoritems', {
                name,
                price,
                stock,
                vendor_id: vendorId
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            navigate('/admin/vendoritems');
        } catch (error) {
            console.error('Error adding vendor item:', error);
        }
    };

    return (
        <>
            <AdminHeader onMenuClick={toggleNav} />
            <div className="main-container">
                <AdminSidebar navClose={navClose} activeTab="vendoritems" />
                <div className="main">
                  <div className="report-container">
                    <div className="report-header">
                      <h1 className="recent-Articles">Add Vendor Item List</h1>
                    </div>
                    <div className="report-body">
                      <form onSubmit={handleSubmit}>
                          <div className="form-group mb-3">
                              <label htmlFor="name">Item Name</label>
                              <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                          </div>
                          <div className="form-group mb-3">
                              <label htmlFor="price">Price</label>
                              <input type="number" id="price" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                          </div>
                          <div className="form-group mb-3">
                              <label htmlFor="stock">Stock</label>
                              <input type="number" id="stock" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
                          </div>
                          <div className="form-group mb-3">
                              <label htmlFor="vendor">Vendor</label>
                              <select id="vendor" className="form-control" value={vendorId} onChange={(e) => setVendorId(e.target.value)} required>
                                  <option value="">Select Vendor</option>
                                  {vendors.map(vendor => (
                                      <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                                  ))}
                              </select>
                          </div>
                          <button type="submit" className="btn btn-primary">Add Item</button>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
        </>
    );
};

export default AddVendorItem;
