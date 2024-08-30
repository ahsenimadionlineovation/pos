import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ENV from '../../../config.json';

const AddBranch = () => {
    const [branch, setBranch] = useState({
        name: '',
        address: '',
        store_id: '',
        created_by: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [navClose, setNavClose] = useState(false);
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();
    const activeTab = 'branches';
    const userApi = `${ENV.base_url}users/email`;

    const toggleNav = () => {
        setNavClose(!navClose);
    };

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

                    // Set store_id and created_by in the branch state
                    setBranch((prevBranch) => ({
                        ...prevBranch,
                        store_id: adminData.store_id,
                        created_by: adminData.id,
                    }));
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setBranch({ ...branch, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${ENV.base_url}branches`, branch, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
            });
            setSuccess('Branch added successfully');
            setTimeout(() => {
                navigate('/admin/branches');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error adding branch:', error);
            }
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
                            <h1 className="recent-Articles">Add Branch</h1>
                        </div>
                        <div className="report-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Branch Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={branch.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name}</p>}
                                </div>
                                <div className="mb-3">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={branch.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && <p className="text-danger">{errors.address}</p>}
                                </div>

                                {/* Hidden fields for store_id and created_by */}
                                <input
                                    type="hidden"
                                    name="store_id"
                                    value={branch.store_id}
                                    onChange={handleChange}
                                />
                                <input
                                    type="hidden"
                                    name="created_by"
                                    value={branch.created_by}
                                    onChange={handleChange}
                                />

                                <button type="submit" className="btn btn-primary">Save</button>
                                {success && <p className="text-success">{success}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBranch;
