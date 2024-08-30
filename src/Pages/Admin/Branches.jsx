import React, { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ENV from '../../../config.json';

const Branches = () => {
    const api = `${ENV.base_url}branches/store/`;
    const userApi = `${ENV.base_url}users/email`;
    const [branches, setBranches] = useState([]);
    const [admin, setAdmin] = useState([]);
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
                    const response = await axios.get(`${userApi}/${authEmail}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                    });
                    const adminData = response.data.user;
                    setAdmin(adminData);

                    if (adminData.store_id) {
                        const fetchBranches = async () => {
                            try {
                                const response = await axios.get(`${api}${adminData.store_id}`, {
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

                        fetchBranches();
                    }
                } catch (error) {
                    console.error('Error fetching admin data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                await axios.delete(`${ENV.base_url}branches/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                });
                setBranches(branches.filter(branch => branch.id !== id));
            } catch (error) {
                console.error('Error deleting branch:', error);
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
                            <h1 className="recent-Articles">Branches</h1>
                            <Link to='/admin/addbranch' className="btn view">Add</Link>
                        </div>
                        <div className="report-body table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Branch Name</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {branches.map((branch, index) => (
                                    <tr key={index}>
                                        <td>{branch.name}</td>
                                        <td>{branch.address}</td>
                                        <td>
                                            <Link to={`/admin/editbranch/${branch.id}`} className="btn btn-info btn-sm me-1">Edit</Link>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(branch.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Branches;
