import { useState, useEffect } from 'react';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { FiCalendar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function DoctorSchedule() {
    const [profile, setProfile] = useState(null);
    const [todayAppts, setTodayAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [profRes, todayRes] = await Promise.all([doctorAPI.getProfile(), appointmentAPI.getDoctorTodayAppointments()]);
            setProfile(profRes.data.data);
            setTodayAppts(todayRes.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const toggleAvailability = async () => {
        try {
            const res = await doctorAPI.updateAvailability(!profile.available);
            setProfile(res.data.data);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-100">My Schedule</h1>
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-dark-100 mb-4">Availability</h2>
                <div className="flex items-center justify-between">
                    <div><p className="text-dark-200">Current Status</p><p className={`text-sm font-medium ${profile?.available ? 'text-green-400' : 'text-red-400'}`}>{profile?.available ? 'Available for Appointments' : 'Not Available'}</p></div>
                    <button onClick={toggleAvailability} className="p-2 rounded-lg hover:bg-dark-700/50 transition-all">
                        {profile?.available ? <FiToggleRight size={36} className="text-green-400" /> : <FiToggleLeft size={36} className="text-dark-500" />}
                    </button>
                </div>
            </div>
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-dark-100 mb-4">Today's Schedule ({todayAppts.length} appointments)</h2>
                {todayAppts.length === 0 ? (
                    <p className="text-dark-400 text-center py-6">No appointments scheduled for today</p>
                ) : (
                    <div className="space-y-3">{todayAppts.map(a => (
                        <div key={a.id} className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold text-sm">{a.patientName.charAt(0)}</div><div><p className="font-medium text-dark-100 text-sm">{a.patientName}</p><p className="text-xs text-dark-400">{new Date(a.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div>
                            <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                        </div>
                    ))}</div>
                )}
            </div>
        </div>
    );
}
