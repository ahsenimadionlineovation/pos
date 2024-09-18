import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Admin/Dashboard';
import Staff from './Pages/Admin/Staff';
import OrderList from './Pages/Admin/OrderList'; // Replaced Order with OrderList
import Customer from './Pages/Admin/Customer';
import Users from './Pages/Admin/Users';
import AddUser from './Pages/Admin/AddUser';
import Tables from './Pages/Admin/Tables';
import AddTable from './Pages/Admin/AddTable';
import EditTable from './Pages/Admin/EditTable';
import AddOrder from './Pages/Admin/AddOrder';
import AuthGuard from './Components/AuthGuard';
import EditUser from './Pages/Admin/EditUser';
import Branches from './Pages/Admin/Branches';
import AddBranch from './Pages/Admin/AddBranch';
import EditBranch from './Pages/Admin/EditBranch';
import MenuItemList from './Pages/Admin/MenuItemList';
import AddMenuItem from './Pages/Admin/AddMenuItem';
import EditMenuItem from './Pages/Admin/EditMenuItem';
import EditOrder from './Pages/Admin/EditOrder';
import VendorList from './Pages/Admin/VendorList';
import AddVendor from './Pages/Admin/AddVendor';
// import EditVendor from './Pages/Admin/EditVendor';
import VendorItemList from './Pages/Admin/VendorItemList';
import AddVendorItem from './Pages/Admin/AddVendorItem';
import EditVendorItem from './Pages/Admin/EditVendorItem';
import Profile from './Pages/Admin/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AuthGuard redirectPath="/">
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <AuthGuard redirectPath="/">
              <Staff />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AuthGuard redirectPath="/">
              <OrderList /> {/* Updated to OrderList */}
            </AuthGuard>
          }
        />
        <Route
          path="/admin/addorder"
          element={
            <AuthGuard redirectPath="/">
              <AddOrder />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/editorder/:id" // Route for editing orders
          element={
            <AuthGuard redirectPath="/">
              <EditOrder />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AuthGuard redirectPath="/">
              <Customer />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AuthGuard redirectPath="/">
              <Users />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/adduser"
          element={
            <AuthGuard redirectPath="/">
              <AddUser />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/edituser/:id"
          element={
            <AuthGuard redirectPath="/">
              <EditUser />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/tables"
          element={
              <AuthGuard redirectPath="/">
                  <Tables />
              </AuthGuard>
          }
        />
        <Route
          path="/admin/addtable"
          element={
              <AuthGuard redirectPath="/">
                  <AddTable />
              </AuthGuard>
          }
        />
        <Route
          path="/admin/edittable/:id"
          element={
              <AuthGuard redirectPath="/">
                  <EditTable />
              </AuthGuard>
          }
        />
        <Route
          path="/admin/branches"
          element={
              <AuthGuard redirectPath="/">
                  <Branches />
              </AuthGuard>
          }
        />
        <Route
            path="/admin/addbranch"
            element={
                <AuthGuard redirectPath="/">
                    <AddBranch />
                </AuthGuard>
            }
        />
        <Route
            path="/admin/editbranch/:id"
            element={
                <AuthGuard redirectPath="/">
                    <EditBranch />
                </AuthGuard>
            }
        />
        <Route
            path="/admin/menu-items"
            element={
                <AuthGuard redirectPath="/">
                    <MenuItemList />
                </AuthGuard>
            }
        />
        <Route
            path="/admin/add-menu-item"
            element={
                <AuthGuard redirectPath="/">
                    <AddMenuItem />
                </AuthGuard>
            }
        />
        <Route
            path="/admin/edit-menu-item/:id"
            element={
                <AuthGuard redirectPath="/">
                    <EditMenuItem />
                </AuthGuard>
            }
        />
        <Route
          path="/admin/vendors"
          element={
            <AuthGuard redirectPath="/">
              <VendorList />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/addvendor"
          element={
            <AuthGuard redirectPath="/">
              <AddVendor />
            </AuthGuard>
          }
        />
        {/* <Route
          path="/admin/editvendor/:id"
          element={
            <AuthGuard redirectPath="/">
              <EditVendor />
            </AuthGuard>
          }
        /> */}
        <Route
          path="/admin/vendoritems"
          element={
            <AuthGuard redirectPath="/">
              <VendorItemList />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/addvendoritem"
          element={
            <AuthGuard redirectPath="/">
              <AddVendorItem />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/editvendoritem/:id"
          element={
            <AuthGuard redirectPath="/">
              <EditVendorItem />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AuthGuard redirectPath="/">
              <Profile />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
