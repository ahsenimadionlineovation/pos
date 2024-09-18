import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';

const VendorItemList = () => {
    const [vendorItems, setVendorItems] = useState([]);
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'vendoritems';
    const [loading, setLoading] = useState(true);

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    const fetchVendorItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/vendoritems', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setVendorItems(response.data);
        } catch (error) {
            console.error('Error fetching vendor items:', error);
        } finally {
            setLoading(false); 
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/vendoritems/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setVendorItems(vendorItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting vendor item:', error);
        }
    };

    useEffect(() => {
        fetchVendorItems();
    }, []);

    // Group vendor items by vendor
    const groupByVendor = (items) => {
        return items.reduce((groups, item) => {
            const vendorName = item.vendor.name;
            if (!groups[vendorName]) {
                groups[vendorName] = [];
            }
            groups[vendorName].push(item);
            return groups;
        }, {});
    };

    const groupedItems = groupByVendor(vendorItems);

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
                                        <h1 className="recent-Articles">Vendor Item List</h1>
                                        <Link to="/admin/addvendoritem" className="btn btn-primary">Add</Link>
                                    </div>
                                    <div className="report-body">
                                        <div className="accordion accordion-flush table-responsive" id="accordionFlushExample">
                                        {Object.keys(groupedItems).map((vendorName, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id={`flush-heading${index}`}>
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                                                        {vendorName} {/* Vendor name as accordion header */}
                                                    </button>
                                                </h2>
                                                <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
                                                    <div className="accordion-body">
                                                        <table className="table table-bordered table-striped table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Name</th>
                                                                    <th>Price</th>
                                                                    <th>Stock</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {groupedItems[vendorName].map(item => (
                                                                    <tr key={item.id}>
                                                                        <td>{item.id}</td>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.price}</td>
                                                                        <td>{item.stock}</td>
                                                                        <td>
                                                                            <Link to={`/admin/editvendoritem/${item.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                                                            <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Delete</button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
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

export default VendorItemList;
