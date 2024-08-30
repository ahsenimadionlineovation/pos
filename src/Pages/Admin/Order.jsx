import React, { useState } from 'react'
import AdminHeader from '../../Components/AdminHeader'
import AdminSidebar from '../../Components/AdminSidebar'
import { Link } from 'react-router-dom';

const Order = () => {
    const [navClose, setNavClose] = useState(false);
  const activeTab = 'order';

  const toggleNav = () => {
    setNavClose(!navClose);
  };
  return (
    <>
        <AdminHeader onMenuClick={toggleNav} />
        <div className="main-container">
            <AdminSidebar navClose={navClose} activeTab={activeTab} />
            <div className="main">
                <div className="report-container">
                    <div className="report-header">
                        <h1 className="recent-Articles">Order lists</h1>
                        <Link to='/admin/addorder' className="btn view">Add</Link>
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
  )
}

export default Order