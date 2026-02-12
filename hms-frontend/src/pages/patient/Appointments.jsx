import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import { FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';

/**
 * Patient Appointments Page - view appointment history with status badges.
 */
export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await appointmentAPI.getPatientAppointments();
            setAppointments(res.data.data || []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);
    const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">My Appointments</h1>
                    <p className="text-dark-400 mt-1">View and manage your appointments</p>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
                {statuses.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s
                                ? 'gradient-btn text-white'
                                : 'bg-dark-800/50 text-dark-400 hover:text-dark-200 border border-dark-700'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            {filtered.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FiCalendar className="mx-auto text-dark-500 mb-3" size={36} />
                    <p className="text-dark-400">No appointments found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(appt => (
                        <div key={appt.id} className="glass-card p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold shrink-0">
                                        {appt.doctorName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-dark-100">{appt.doctorName}</h3>
                                        <p className="text-sm text-primary-400">{appt.doctorSpecialization}</p>
                                        <p className="text-xs text-dark-400 mt-1">
                                            <FiCalendar className="inline mr-1" size={12} />
                                            {new Date(appt.appointmentDateTime).toLocaleString()}
                                        </p>
                                        {appt.reason && (
                                            <p className="text-xs text-dark-500 mt-1">Reason: {appt.reason}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span>

                                    {/* Payment Button - shown for confirmed/completed unpaid appointments */}
                                    {(appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') && !appt.hasPayment && (
                                        <button
                                            onClick={() => navigate(`/patient/payment/${appt.id}`)}
                                            className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-medium hover:bg-green-500/20 transition-all flex items-center gap-1"
                                        >
                                            <FiDollarSign size={12} /> Pay
                                        </button>
                                    )}

                                    {/* View Prescription - if prescription exists */}
                                    {appt.hasPrescription && (
                                        <button
                                            onClick={() => navigate(`/patient/prescriptions`)}
                                            className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-medium hover:bg-purple-500/20 transition-all flex items-center gap-1"
                                        >
                                            <FiFileText size={12} /> Rx
                                        </button>
                                    )}
                                </div>
                            </div>

                            {appt.consultationFee && (
                                <p className="text-xs text-dark-500 mt-3 pt-3 border-t border-dark-700/50">
                                    Consultation Fee: ₹{appt.consultationFee}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
