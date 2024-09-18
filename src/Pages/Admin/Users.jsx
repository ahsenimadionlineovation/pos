import React, { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ENV from '../../../config.json';

const Users = () => {
    const api = ENV.base_url + 'users/store/';
    const userApi = ENV.base_url + 'users/email';
    const [admin, setAdmin] = useState([]);
    const [navClose, setNavClose] = useState(false);
    const [success, setSuccess] = useState('');
    const activeTab = 'users';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (admin.store_id) {
            const fetchUsers = async () => {
                try {
                    const response = await axios.get(`${api}${admin.store_id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                    });
                    // Filter out the current user
                    const filteredUsers = response.data.users.filter(user => user.id !== admin.id);
                    setUsers(filteredUsers);
                } catch (error) {
                    console.error('Error fetching users:', error);
                } finally {
                    setLoading(false); 
                }
            };

            fetchUsers();
        }
    }, [admin.store_id]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${userApi}/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                setSuccess('User deleted successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (error) {
                console.error('Error deleting user:', error);
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
                        {loading ? (
                            <div className='text-center py-5'>Loading...</div>
                            ) : (
                                <>
                                    <div className="report-header">
                                        <h1 className="recent-Articles">User lists</h1>
                                        <Link to='/admin/adduser' className="btn view">Add</Link>
                                    </div>
                                    <div className="report-body table-responsive">
                                        {success && <p className="text-success">{success}</p>}
                                        <table className="table table-bordered table-striped table-hover">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Phone</th>
                                                <th scope="col">Role</th>
                                                {admin.role == 'owner' && <th scope="col">Actions</th>}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user.role}</td>
                                                    {admin.role == 'owner' && <td>
                                                        <Link to={`/admin/edituser/${user.id}`} className="btn btn-info btn-sm me-1">Edit</Link>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Users;
