import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - wraps routes that require authentication.
 * Optionally restricts access to specific roles.
 */
export default function ProtectedRoute({ children, role }) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // Redirect to the correct dashboard based on role
        const redirectPath = user.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}
