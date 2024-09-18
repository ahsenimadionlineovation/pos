import React, { useEffect, useState } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ENV from '../../../config.json';

const Tables = () => {
    const api = `${ENV.base_url}tables/store/`;
    const userApi = `${ENV.base_url}users/email`;
    const deleteApi = `${ENV.base_url}tables/`;  // API endpoint for deleting a table
    const [admin, setAdmin] = useState([]);
    const [navClose, setNavClose] = useState(false);
    const [success, setSuccess] = useState('');
    const activeTab = 'tables';
    const [tables, setTables] = useState([]);
    const [groupedTables, setGroupedTables] = useState({});
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
                    console.error('Error fetching admin data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (admin.store_id) {
            const fetchTables = async () => {
                try {
                    const response = await axios.get(`${api}${admin.store_id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                    });
                    const fetchedTables = response.data.tables;
                    setTables(fetchedTables);
                    groupTablesByBranch(fetchedTables);  // Group tables by branch
                } catch (error) {
                    console.error('Error fetching tables:', error);
                } finally {
                    setLoading(false); 
                }
            };

            fetchTables();
        }
    }, [admin.store_id]);

    // Function to group tables by branch
    const groupTablesByBranch = (tables) => {
        const grouped = tables.reduce((acc, table) => {
            const branchName = table.branch ? table.branch.name : 'Unknown Branch';
            if (!acc[branchName]) {
                acc[branchName] = [];
            }
            acc[branchName].push(table);
            return acc;
        }, {});
        setGroupedTables(grouped);
    };

    const handleDelete = async (tableId) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            try {
                await axios.delete(`${deleteApi}${tableId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                setSuccess('Table deleted successfully');
                setTables(tables.filter(table => table.id !== tableId));
                groupTablesByBranch(tables.filter(table => table.id !== tableId));  // Regroup tables after deletion
            } catch (error) {
                console.error('Error deleting table:', error);
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
                                        <h1 className="recent-Articles">Table Lists</h1>
                                        <Link to='/admin/addtable' className="btn view">Add</Link>
                                    </div>
                                    <div className="report-body table-responsive">
                                        <div className="accordion accordion-flush table-responsive" id="accordionFlushExample">
                                        {success && <p className="text-success">{success}</p>}
                                        {Object.keys(groupedTables).map((branchName, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id={`flush-heading${index}`}>
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                                                        {branchName} {/* Branch name as accordion header */}
                                                    </button>
                                                </h2>
                                                <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
                                                    <div className="accordion-body">
                                                        {/* <h3>{branchName}</h3> */}
                                                        <table className="table table-bordered table-striped table-hover">
                                                            <thead className="thead-dark">
                                                                <tr>
                                                                    <th scope="col">Table Number</th>
                                                                    <th scope="col">Seats</th>
                                                                    <th scope="col">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {groupedTables[branchName].map((table, tableIndex) => (
                                                                    <tr key={tableIndex}>
                                                                        <td>{table.table_number}</td>
                                                                        <td>{table.seats}</td>
                                                                        <td>
                                                                            <Link to={`/admin/edittable/${table.id}`} className="btn btn-info btn-sm me-1">Edit</Link>
                                                                            <button
                                                                                onClick={() => handleDelete(table.id)}
                                                                                className="btn btn-danger btn-sm"
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

export default Tables;
