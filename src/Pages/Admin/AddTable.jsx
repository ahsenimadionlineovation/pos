import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { useNavigate } from 'react-router-dom';

const AddTable = () => {
    const [table, setTable] = useState({ table_number: '', seats: '', branch_id: '', store_id: '', created_by: '' });
    const [branches, setBranches] = useState([]);
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();
    const userApi = ENV.base_url + 'users/email';

    useEffect(() => {
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
                    setAdmin(adminData);
                    setTable(prevTable => ({
                        ...prevTable,
                        store_id: adminData.store_id,
                        created_by: adminData.id
                    }));
                    fetchBranches(adminData.store_id);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        const fetchBranches = async (storeId) => {
            try {
                const response = await axios.get(`${ENV.base_url}branches/store/${storeId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                setBranches(response.data.branches);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTable({ ...table, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${ENV.base_url}tables`, table, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
            });
            navigate('/admin/tables');
        } catch (error) {
            console.error('Error adding table:', error);
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
                            <h1 className="recent-Articles">Add Table</h1>
                        </div>
                        <div className="report-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="table_number">Table Number</label>
                                    <input
                                        type="text"
                                        id="table_number"
                                        name="table_number"
                                        className="form-control"
                                        value={table.table_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="seats">Seats</label>
                                    <input
                                        type="number"
                                        id="seats"
                                        name="seats"
                                        className="form-control"
                                        value={table.seats}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="branch_id">Branch</label>
                                    <select
                                        id="branch_id"
                                        name="branch_id"
                                        className="form-control"
                                        value={table.branch_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <input type="hidden" name="store_id" value={table.store_id} />
                                <input type="hidden" name="created_by" value={table.created_by} />
                                <button type="submit" className="btn btn-primary">Add Table</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddTable;
