import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorList from './pages/patient/DoctorList';
import BookAppointment from './pages/patient/BookAppointment';
import PatientAppointments from './pages/patient/Appointments';
import Payment from './pages/patient/Payment';
import PatientPrescriptions from './pages/patient/Prescriptions';
import PatientProfile from './pages/patient/Profile';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import CreatePrescription from './pages/doctor/CreatePrescription';
import DoctorSchedule from './pages/doctor/Schedule';
import DoctorProfile from './pages/doctor/Profile';

function AppLayout() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const hideNavbar = ['/', '/login', '/register'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-dark-900">
            {!hideNavbar && isAuthenticated && <Navbar />}
            <main className={!hideNavbar && isAuthenticated ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Patient Routes */}
                    <Route path="/patient/dashboard" element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/doctors" element={<ProtectedRoute role="PATIENT"><DoctorList /></ProtectedRoute>} />
                    <Route path="/patient/book-appointment/:doctorId" element={<ProtectedRoute role="PATIENT"><BookAppointment /></ProtectedRoute>} />
                    <Route path="/patient/appointments" element={<ProtectedRoute role="PATIENT"><PatientAppointments /></ProtectedRoute>} />
                    <Route path="/patient/payment/:appointmentId" element={<ProtectedRoute role="PATIENT"><Payment /></ProtectedRoute>} />
                    <Route path="/patient/prescriptions" element={<ProtectedRoute role="PATIENT"><PatientPrescriptions /></ProtectedRoute>} />
                    <Route path="/patient/profile" element={<ProtectedRoute role="PATIENT"><PatientProfile /></ProtectedRoute>} />

                    {/* Doctor Routes */}
                    <Route path="/doctor/dashboard" element={<ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>} />
                    <Route path="/doctor/appointments" element={<ProtectedRoute role="DOCTOR"><DoctorAppointments /></ProtectedRoute>} />
                    <Route path="/doctor/prescriptions/create/:appointmentId" element={<ProtectedRoute role="DOCTOR"><CreatePrescription /></ProtectedRoute>} />
                    <Route path="/doctor/schedule" element={<ProtectedRoute role="DOCTOR"><DoctorSchedule /></ProtectedRoute>} />
                    <Route path="/doctor/profile" element={<ProtectedRoute role="DOCTOR"><DoctorProfile /></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </BrowserRouter>
    );
}
