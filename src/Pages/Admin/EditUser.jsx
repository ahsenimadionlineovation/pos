import React, { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ENV from '../../../config.json';

const EditUser = () => {
    const { id } = useParams();
    const api = `${ENV.base_url}users/${id}`; // Endpoint for updating user
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [danger, setDanger] = useState('');
    const navigate = useNavigate();
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'users';

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(api, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 403) {
                    setDanger('Sorry, you do not have edit access.');
                } else if (error.response && error.response.status === 404) {
                    setDanger('User not found.');
                }
            }
        };

        fetchUser();
    }, [api]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(api, user, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
            });
            setSuccess('User updated successfully');
            setTimeout(() => {
                navigate('/admin/users');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response && error.response.status === 403) {
                setDanger('Sorry, you do not have edit access.');
            } else {
                console.error('Error updating user:', error);
                setDanger('Error updating user. Please try again later.');
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
                            <h1 className="recent-Articles">Edit User</h1>
                        </div>
                        <div className="report-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Name</label>
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

export default EditUser;
