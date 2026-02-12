import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

/**
 * Navbar - top navigation bar with role-aware links.
 */
export default function Navbar() {
    const { user, logout, isAuthenticated, isDoctor } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const dashboardPath = isDoctor ? '/doctor/dashboard' : '/patient/dashboard';

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass sticky top-0 z-50 border-b border-primary-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to={isAuthenticated ? dashboardPath : '/'} className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center font-bold text-white text-sm">
                            H
                        </div>
                        <span className="text-xl font-bold gradient-text">HMS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-1">
                            {isDoctor ? (
                                <>
                                    <NavLink to="/doctor/dashboard" active={isActive('/doctor/dashboard')}>Dashboard</NavLink>
                                    <NavLink to="/doctor/appointments" active={isActive('/doctor/appointments')}>Appointments</NavLink>
                                    <NavLink to="/doctor/schedule" active={isActive('/doctor/schedule')}>Schedule</NavLink>
                                    <NavLink to="/doctor/profile" active={isActive('/doctor/profile')}>Profile</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/patient/dashboard" active={isActive('/patient/dashboard')}>Dashboard</NavLink>
                                    <NavLink to="/patient/doctors" active={isActive('/patient/doctors')}>Find Doctors</NavLink>
                                    <NavLink to="/patient/appointments" active={isActive('/patient/appointments')}>Appointments</NavLink>
                                    <NavLink to="/patient/prescriptions" active={isActive('/patient/prescriptions')}>Prescriptions</NavLink>
                                    <NavLink to="/patient/profile" active={isActive('/patient/profile')}>Profile</NavLink>
                                </>
                            )}
                        </div>
                    )}

                    {/* User Info & Actions */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-dark-100">{user?.name}</p>
                                    <p className="text-xs text-primary-400">{user?.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                    title="Logout"
                                >
                                    <FiLogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-4 py-2 text-sm text-dark-300 hover:text-primary-400 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 text-sm gradient-btn rounded-lg text-white font-medium">
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        {isAuthenticated && (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 text-dark-400 hover:text-primary-400"
                            >
                                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && isAuthenticated && (
                    <div className="md:hidden pb-4 animate-slide-up">
                        <div className="flex flex-col gap-1">
                            {isDoctor ? (
                                <>
                                    <MobileLink to="/doctor/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                                    <MobileLink to="/doctor/appointments" onClick={() => setMobileOpen(false)}>Appointments</MobileLink>
                                    <MobileLink to="/doctor/schedule" onClick={() => setMobileOpen(false)}>Schedule</MobileLink>
                                    <MobileLink to="/doctor/profile" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
                                </>
                            ) : (
                                <>
                                    <MobileLink to="/patient/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                                    <MobileLink to="/patient/doctors" onClick={() => setMobileOpen(false)}>Find Doctors</MobileLink>
                                    <MobileLink to="/patient/appointments" onClick={() => setMobileOpen(false)}>Appointments</MobileLink>
                                    <MobileLink to="/patient/prescriptions" onClick={() => setMobileOpen(false)}>Prescriptions</MobileLink>
                                    <MobileLink to="/patient/profile" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavLink({ to, active, children }) {
    return (
        <Link
            to={to}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-dark-300 hover:text-primary-400 hover:bg-primary-500/5'
                }`}
        >
            {children}
        </Link>
    );
}

function MobileLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="px-4 py-3 rounded-lg text-dark-200 hover:text-primary-400 hover:bg-primary-500/5 transition-all"
        >
            {children}
        </Link>
    );
}
