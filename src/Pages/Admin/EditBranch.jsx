import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import ENV from '../../../config.json';
import { useNavigate, useParams } from 'react-router-dom';

const EditBranch = () => {
    const { id } = useParams();
    const [branch, setBranch] = useState({
        name: '',
        address: '',
        store_id: '',
        user_id: ''
    });
    const [errors, setErrors] = useState({});
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'branches';

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const authEmail = localStorage.getItem('auth_email');
            if (authEmail) {
                try {
                    const response = await axios.get(`${ENV.base_url}users/email/${authEmail}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                    });
                    const adminData = response.data.user;
                    setAdmin(adminData);

                    // Set store_id and user_id in branch state
                    setBranch(prevBranch => ({
                        ...prevBranch,
                        store_id: adminData.store_id,
                        user_id: adminData.id
                    }));
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        const fetchBranch = async () => {
            try {
                const response = await axios.get(`${ENV.base_url}branches/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                setBranch(response.data.branch);
            } catch (error) {
                console.error('Error fetching branch:', error);
            }
        };

        fetchUserData();
        fetchBranch();
    }, [id]);

    const handleChange = (e) => {
        setBranch({ ...branch, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${ENV.base_url}branches/${id}`, branch, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
            });
            navigate('/admin/branches');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error updating branch:', error);
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
                            <h1 className="recent-Articles">Edit Branch</h1>
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
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditBranch;
