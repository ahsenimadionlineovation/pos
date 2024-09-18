import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import ENV from '../../../config.json'; // Assume you have this for base_url
import './Dashboard.css';

// Import Chart.js and React-Chartjs-2 components
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
    const userApi = `${ENV.base_url}users/email`;
    const [admin, setAdmin] = useState([]);
    const [stats, setStats] = useState({
        total_orders: 0,
        total_sales: 0,
        average_order_value: 0,
        top_items: [],
    });

    const [monthlySales, setMonthlySales] = useState([]);
    const [navClose, setNavClose] = useState(false);
    const activeTab = 'dashboard';
    const [loading, setLoading] = useState(true);

    const chartRef = useRef(null);

    const toggleNav = () => {
        setNavClose(!navClose);
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get(`${ENV.base_url}dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false); 
        }
    };

    const fetchMonthlySalesChart = async () => {
        try {
            const response = await axios.get(`${ENV.base_url}dashboard/monthly-sales-chart`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMonthlySales(response.data);
        } catch (error) {
            console.error('Error fetching monthly sales chart data:', error);
        }
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
                } finally {
                    setLoading(false); 
                }
            }
        };

        fetchUserData();
        fetchDashboardStats();
        fetchMonthlySalesChart();

        // Cleanup function to destroy the chart instance
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    // Prepare data for the chart
    const chartData = {
        labels: monthlySales.map(data => data.month),
        datasets: [
            {
                label: 'Current Year Sales',
                data: monthlySales.map(data => data.current_year_sales),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Previous Year Sales',
                data: monthlySales.map(data => data.previous_year_sales),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw} INR`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Sales (INR)',
                },
                beginAtZero: true,
            },
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
                                        <h1 className="recent-Articles">Dashboard</h1>
                                    </div>
                                    <div className="report-body">
                                        {(admin.role == 'owner' || admin.role == 'manager') && 
                                        <div className="row g-5">
                                            <div className="col-sm-6 col-md-4 col-lg-4">
                                                <div className="dashboard-card card rounded-4">
                                                    <div className="card-body p-4">
                                                        <h2 className='fs-6'>Total Sales This Month</h2>
                                                        <p className='fs-4 mb-0 text-primary text-end fw-semibold'><i className="fa-solid fa-indian-rupee-sign"></i> {stats.total_sales}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-md-4 col-lg-4">
                                                <div className="dashboard-card card rounded-4">
                                                    <div className="card-body p-4">
                                                        <h2 className='fs-6'>Total Orders This Month</h2>
                                                        <p className='fs-4 mb-0 text-primary text-end fw-semibold'>{stats.total_orders}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-md-4 col-lg-4">
                                                <div className="dashboard-card card rounded-4">
                                                    <div className="card-body p-4">
                                                        <h2 className='fs-6'>Average Order Value</h2>
                                                        <p className='fs-4 mb-0 text-primary text-end fw-semibold'><i className="fa-solid fa-indian-rupee-sign"></i> {stats.average_order_value}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="col-sm-6 col-md-6 col-lg-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h2 className='fs-6'>Top-Selling Items</h2>
                                                        <ul>
                                                            {stats.top_items.map((item, index) => (
                                                                <li key={index}>
                                                                    {item.menu_item} - {item.quantity} sold
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-lg-8">
                                                <h2 className='fs-6'>Monthly Sales Comparison</h2>
                                                <Line ref={chartRef} data={chartData} options={chartOptions} />
                                            </div>
                                        </div>
                                        }
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

export default Dashboard;
