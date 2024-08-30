import React, { useState } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import AdminSidebar from '../../Components/AdminSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [navClose, setNavClose] = useState(false);
  const activeTab = 'dashboard';

  const toggleNav = () => {
    setNavClose(!navClose);
  };

  return (
    <>
      <AdminHeader onMenuClick={toggleNav} />
      <div className="main-container">
        <AdminSidebar navClose={navClose} activeTab={activeTab} />
        <div className="main">
            <div className="searchbar2">
                <input type="text"
                name=""
                id=""
                placeholder="Search" />
                <div className="searchbtn">
                    <img src=
                    "https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                    className="icn srchicn"
                    alt="search-button" />
                </div>
            </div>
            <div className="box-container mb-5">
                <div className="box box1">
                    <div className="text">
                        <h2 className="topic-heading">60.5k</h2>
                        <h2 className="topic">Article Views</h2>
                    </div>
                    <img src=
                    "https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(31).png"
                    alt="Views" />
                </div>
                <div className="box box2">
                    <div className="text">
                        <h2 className="topic-heading">150</h2>
                        <h2 className="topic">Likes</h2>
                    </div>
                    <img src=
                    "https://media.geeksforgeeks.org/wp-content/uploads/20221210185030/14.png"
                    alt="likes" />
                </div>
                <div className="box box3">
                    <div className="text">
                        <h2 className="topic-heading">320</h2>
                        <h2 className="topic">Comments</h2>
                    </div>
                    <img src=
                    "https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
                    alt="comments" />
                </div>
                <div className="box box4">
                    <div className="text">
                        <h2 className="topic-heading">70</h2>
                        <h2 className="topic">Published</h2>
                    </div>
                    <img src=
                    "https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png" alt="published" />
                </div>
            </div>
            <div className="report-container">
                <div className="report-header">
                    <h1 className="recent-Articles">Recent Articles</h1>
                    <button className="view">View All</button>
                </div>
                <div className="report-body table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">Article</th>
                            <th scope="col">Views</th>
                            <th scope="col">Comments</th>
                            <th scope="col">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Article 73</td>
                            <td>2.9k</td>
                            <td>210</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 72</td>
                            <td>1.5k</td>
                            <td>360</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 71</td>
                            <td>1.1k</td>
                            <td>150</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 70</td>
                            <td>1.2k</td>
                            <td>420</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 69</td>
                            <td>2.6k</td>
                            <td>190</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 68</td>
                            <td>1.9k</td>
                            <td>390</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 67</td>
                            <td>1.2k</td>
                            <td>580</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 66</td>
                            <td>3.6k</td>
                            <td>160</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        <tr>
                            <td>Article 65</td>
                            <td>1.3k</td>
                            <td>220</td>
                            <td><span className="bg-success badge badge-success">Published</span></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
