import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import { FiCalendar, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [todayAppts, setTodayAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [allRes, todayRes] = await Promise.all([
                appointmentAPI.getDoctorAppointments(),
                appointmentAPI.getDoctorTodayAppointments(),
            ]);
            setAppointments(allRes.data.data || []);
            setTodayAppts(todayRes.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const pending = appointments.filter(a => a.status === 'PENDING').length;
    const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
    const completed = appointments.filter(a => a.status === 'COMPLETED').length;

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-dark-100">Doctor Dashboard</h1><p className="text-dark-400 mt-1">Overview of your practice</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FiUsers />} label="Total Appointments" value={appointments.length} color="primary" />
                <StatCard icon={<FiClock />} label="Pending" value={pending} color="yellow" />
                <StatCard icon={<FiCalendar />} label="Confirmed" value={confirmed} color="blue" />
                <StatCard icon={<FiCheckCircle />} label="Completed" value={completed} color="green" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/doctor/appointments" className="glass-card p-6 flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-all"><FiCalendar size={24} /></div>
                    <div><h3 className="font-semibold text-dark-100">Manage Appointments</h3><p className="text-sm text-dark-400">Accept, reject, or complete</p></div>
                </Link>
                <Link to="/doctor/schedule" className="glass-card p-6 flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20 transition-all"><FiClock size={24} /></div>
                    <div><h3 className="font-semibold text-dark-100">My Schedule</h3><p className="text-sm text-dark-400">Manage availability</p></div>
                </Link>
            </div>
            <div>
                <h2 className="text-lg font-semibold text-dark-100 mb-4">Today's Appointments ({todayAppts.length})</h2>
                {todayAppts.length === 0 ? (
                    <div className="glass-card p-8 text-center"><FiCalendar className="mx-auto text-dark-500 mb-3" size={32} /><p className="text-dark-400">No appointments today</p></div>
                ) : (
                    <div className="space-y-3">{todayAppts.map(a => (
                        <div key={a.id} className="glass-card p-4 flex items-center justify-between">
                            <div><p className="font-medium text-dark-100">{a.patientName}</p><p className="text-xs text-dark-400">{new Date(a.appointmentDateTime).toLocaleTimeString()}</p>{a.reason && <p className="text-xs text-dark-500 mt-1">{a.reason}</p>}</div>
                            <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                        </div>
                    ))}</div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = { primary: 'bg-primary-500/10 text-primary-400', yellow: 'bg-yellow-500/10 text-yellow-400', blue: 'bg-blue-500/10 text-blue-400', green: 'bg-green-500/10 text-green-400' };
    return (<div className="glass-card p-5"><div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div><div><p className="text-2xl font-bold text-dark-100">{value}</p><p className="text-xs text-dark-400">{label}</p></div></div></div>);
}
