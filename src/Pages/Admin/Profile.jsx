import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'profile';
    const [loading, setLoading] = useState(true);

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setProfile(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false); 
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setProfile(response.data);
            setEditMode(false);
        } catch (error) {
            setErrors(error.response.data.errors || {});
            console.error('Error updating profile:', error);
        }
    };

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
                                        <h1 className="recent-Articles">Profile</h1>
                                    </div>
                                    <div className="report-body">
                                        {editMode ? (
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="name">Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-control"
                                                        value={formData.name || ''}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.name && <div className="text-danger">{errors.name[0]}</div>}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        value={formData.email || ''}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.email && <div className="text-danger">{errors.email[0]}</div>}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="phone">Phone</label>
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        name="phone"
                                                        className="form-control"
                                                        value={formData.phone || ''}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.phone && <div className="text-danger">{errors.phone[0]}</div>}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="password">Password</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control"
                                                        value={formData.password || ''}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.password && <div className="text-danger">{errors.password[0]}</div>}
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="password_confirmation">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        className="form-control"
                                                        value={formData.password_confirmation || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                                                <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary ml-2">Cancel</button>
                                            </form>
                                        ) : (
                                            <div>
                                                <p><strong>Name:</strong> {profile.name}</p>
                                                <p><strong>Email:</strong> {profile.email}</p>
                                                <p><strong>Phone:</strong> {profile.phone}</p>
                                                <p><strong>Role:</strong> {profile.role.toUpperCase()}</p>
                                                <button onClick={() => setEditMode(true)} className="btn btn-primary">Edit</button>
                                            </div>
                                        )}
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

export default Profile;
