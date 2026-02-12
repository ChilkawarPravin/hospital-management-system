import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../../services/api';
import { FiCalendar, FiFileText, FiSearch, FiClock } from 'react-icons/fi';

/**
 * Patient Dashboard - overview of appointments, prescriptions, and quick actions.
 */
export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [apptRes, prescRes] = await Promise.all([
                appointmentAPI.getPatientAppointments(),
                prescriptionAPI.getPatientPrescriptions(),
            ]);
            setAppointments(apptRes.data.data || []);
            setPrescriptions(prescRes.data.data || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const upcomingAppointments = appointments.filter(
        a => ['PENDING', 'CONFIRMED'].includes(a.status)
    );
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-dark-100">Patient Dashboard</h1>
                <p className="text-dark-400 mt-1">Welcome back! Here's your health overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiCalendar />} label="Total Appointments" value={appointments.length} color="primary" />
                <StatCard icon={<FiClock />} label="Upcoming" value={upcomingAppointments.length} color="blue" />
                <StatCard icon={<FiCalendar />} label="Completed" value={completedAppointments.length} color="green" />
                <StatCard icon={<FiFileText />} label="Prescriptions" value={prescriptions.length} color="purple" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/patient/doctors" className="glass-card p-6 flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-all">
                        <FiSearch size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-dark-100">Find Doctors</h3>
                        <p className="text-sm text-dark-400">Browse doctors by specialization</p>
                    </div>
                </Link>
                <Link to="/patient/appointments" className="glass-card p-6 flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20 transition-all">
                        <FiCalendar size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-dark-100">My Appointments</h3>
                        <p className="text-sm text-dark-400">View and manage appointments</p>
                    </div>
                </Link>
            </div>

            {/* Upcoming Appointments */}
            <div>
                <h2 className="text-lg font-semibold text-dark-100 mb-4">Upcoming Appointments</h2>
                {upcomingAppointments.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                        <FiCalendar className="mx-auto text-dark-500 mb-3" size={32} />
                        <p className="text-dark-400">No upcoming appointments</p>
                        <Link to="/patient/doctors" className="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block">
                            Book an appointment →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingAppointments.slice(0, 5).map(appt => (
                            <div key={appt.id} className="glass-card p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-dark-100">{appt.doctorName}</p>
                                    <p className="text-sm text-dark-400">{appt.doctorSpecialization}</p>
                                    <p className="text-xs text-dark-500 mt-1">
                                        {new Date(appt.appointmentDateTime).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`badge badge-${appt.status.toLowerCase()}`}>
                                    {appt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorMap = {
        primary: 'bg-primary-500/10 text-primary-400',
        blue: 'bg-blue-500/10 text-blue-400',
        green: 'bg-green-500/10 text-green-400',
        purple: 'bg-purple-500/10 text-purple-400',
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>{icon}</div>
                <div>
                    <p className="text-2xl font-bold text-dark-100">{value}</p>
                    <p className="text-xs text-dark-400">{label}</p>
                </div>
            </div>
        </div>
    );
}
