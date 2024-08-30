import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import ENV from '../../../config.json';

const AddUser = () => {
    const api = ENV.base_url + 'users'; // Adjust endpoint as needed
    const userApi = ENV.base_url + 'users/email/'; // Base URL for user API
    const navigate = useNavigate();
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'users';

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    const [admin, setAdmin] = useState([])

    const [user, setUser] = useState({
        store_id: '',
        user_id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        password_confirmation: '',
        role: '',
    });

    const [errors, setErrors] = useState({
        store_id: '',
        user_id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        password_confirmation: '',
        role: '',
    });

    const [success, setSuccess] = useState('');
    const [danger, setDanger] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const authEmail = localStorage.getItem('auth_email');
            console.warn(authEmail)
            if (authEmail) {
                try {
                    const response = await axios.get(`${userApi}${authEmail}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                    });
                    const adminData = response.data.user;
                    setAdmin(adminData);

                    // Set store_id and user_id in the user state
                    setUser((prevUser) => ({
                        ...prevUser,
                        store_id: adminData.store_id,
                        user_id: adminData.id,
                    }));
                    console.log("Admin Data:", adminData); // Check admin data
                    console.log("User State after setting admin data:", {
                        store_id: adminData.store_id,
                        user_id: adminData.id,
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting User:', user);
        try {
            const response = await axios.post(api, user, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
            });
            setSuccess('User has been created successfully');
            navigate('/admin/users');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error submitting user:', error);
                setDanger('Error creating user. Please try again later.');
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
                            <h1 className="recent-Articles">Add User</h1>
                        </div>
                        <div className="report-body table-responsive">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="hidden"
                                    name="user_id"
                                    value={user.user_id} // use user.user_id instead of admin.id
                                />
                                <input
                                    type="hidden"
                                    name="store_id"
                                    value={user.store_id} // use user.store_id instead of admin.store_id
                                />
                                <div className="mb-3">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name}</p>}
                                </div>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-danger">{errors.email}</p>}
                                </div>
                                <div className="mb-3">
                                    <label>Phone number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="text-danger">{errors.password}</p>}
                                </div>
                                <div className="mb-3">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password_confirmation"
                                        value={user.password_confirmation}
                                        onChange={handleChange}
                                    />
                                    {errors.password_confirmation && <p className="text-danger">{errors.password_confirmation}</p>}
                                </div>
                                <div className="mb-3">
                                    <label>Role</label>
                                    <select
                                        className="form-select"
                                        name="role"
                                        value={user.role}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select role</option>
                                        <option value="manager">Manager</option>
                                        <option value="server">Server</option>
                                        <option value="kitchen">Kitchen</option>
                                        <option value="cashier">Cashier</option>
                                    </select>
                                    {errors.role && <p className="text-danger">{errors.role}</p>}
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                                {success && <p className="text-success">{success}</p>}
                                {danger && <p className="text-danger">{danger}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddUser;
