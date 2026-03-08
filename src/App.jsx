// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LandingPage from './pages/LandingPage';

// SuperAdmin Pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import CreateAdmin from './pages/superadmin/CreateAdmin';
import AdminsList from './pages/superadmin/AdminsList';
import AdminDetails from './pages/superadmin/AdminDetails';

import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import CreateServiceman from './pages/admin/CreateServiceman';
import EditServiceman from './pages/admin/EditServiceman';
import AdminServicemen from './pages/admin/AdminServicemen';
import AdminServicemanDetails from './pages/admin/AdminServicemanDetails';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryDetails from './pages/admin/AdminCategoryDetails';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBookingDetails from './pages/admin/AdminBookingDetails';
import AdminReports from './pages/admin/AdminReports';

import ServiceManDashboard from './pages/serviceman/ServiceManDashboard';
import ServiceManProfile from './pages/serviceman/ServiceManProfile';
import ServiceManBookings from './pages/serviceman/ServiceManBookings';
import ServiceManBookingDetails from './pages/serviceman/ServiceManBookingDetails';
import ServiceManAvailability from './pages/serviceman/ServiceManAvailability';
import ServiceManReviews from './pages/serviceman/ServiceManReviews';

import UserDashboard from './pages/user/UserDashboard';

import UserBrowseServices from './pages/user/UserBrowseServices';
import UserServicemanProfile from './pages/user/UserServicemanProfile';
import UserBookService from './pages/user/UserBookService';
import UserBookings from './pages/user/UserBookings';
import UserBookingDetails from './pages/user/UserBookingDetails';
import UserProfile from './pages/user/UserProfile';
import AddReview from './pages/user/AddReview';
import EditReview from './pages/user/EditReview';
import MyReviews from './pages/user/MyReviews';

// Admin Pages (placeholders - you'll implement these)
// const AdminDashboard = () => <div className="pt-20 text-white min-h-screen">Admin Dashboard</div>;

// ServiceMan Pages (placeholders)
// const ServiceManDashboard = () => <div className="pt-20 text-white min-h-screen">ServiceMan Dashboard</div>;

// // User Pages (placeholders)
// const UserDashboard = () => <div className="pt-20 text-white min-h-screen">User Dashboard</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* SuperAdmin Routes */}
            <Route
              path="/superadmin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/create-admin"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <CreateAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/admins"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AdminsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/admin/:id"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AdminDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <EditUser />
                </ProtectedRoute>
              }
            />


            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminUserDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/servicemen/create"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <CreateServiceman />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/servicemen/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <EditServiceman />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/servicemen"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminServicemen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/servicemen/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminServicemanDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminCategoryDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminBookingDetails />
                </ProtectedRoute>
              }
            />


            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />






            {/* ServiceMan Routes */}

            <Route
              path="/serviceman/dashboard"
              element={
                <ProtectedRoute allowedRoles={['serviceman']}>
                  <ServiceManDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/serviceman/profile"
              element={
                <ProtectedRoute allowedRoles={['serviceman']}>
                  <ServiceManProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/serviceman/bookings"
              element={
                <ProtectedRoute allowedRoles={['serviceman']}>
                  <ServiceManBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/serviceman/bookings/:id"
              element={
                <ProtectedRoute allowedRoles={['serviceman']}>
                  <ServiceManBookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/serviceman/availability"
              element={
                <ProtectedRoute allowedRoles={['serviceman']}>
                  <ServiceManAvailability />
                </ProtectedRoute>
              }
            />



            <Route
              path="/serviceman/reviews"
              element={
                <ProtectedRoute allowedRoles={['serviceman']}>
                  <ServiceManReviews />
                </ProtectedRoute>
              }
            />




            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/browse"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserBrowseServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/serviceman/:id"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserServicemanProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/book-service"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserBookService />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/bookings"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserBookings />
                </ProtectedRoute>
              }
            />


            <Route
              path="/user/bookings/:id"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserBookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/add-review/:id"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <AddReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/review/:reviewId/edit"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <EditReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/my-reviews"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <MyReviews />
                </ProtectedRoute>
              }
            />


          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;