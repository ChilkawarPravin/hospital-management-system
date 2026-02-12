import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import { FiCheck, FiX, FiCheckCircle, FiFileText } from 'react-icons/fi';

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => { fetchAppointments(); }, []);

    const fetchAppointments = async () => {
        try { const res = await appointmentAPI.getDoctorAppointments(); setAppointments(res.data.data || []); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try { await appointmentAPI.updateStatus(id, status); fetchAppointments(); }
        catch (err) { alert(err.response?.data?.message || 'Update failed'); }
    };

    const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);
    const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED'];

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-100">Manage Appointments</h1>
            <div className="flex gap-2 flex-wrap">
                {statuses.map(s => (<button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'gradient-btn text-white' : 'bg-dark-800/50 text-dark-400 hover:text-dark-200 border border-dark-700'}`}>{s}</button>))}
            </div>
            {filtered.length === 0 ? (
                <div className="glass-card p-12 text-center"><p className="text-dark-400">No appointments found</p></div>
            ) : (
                <div className="space-y-3">{filtered.map(a => (
                    <div key={a.id} className="glass-card p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 font-bold shrink-0">{a.patientName.charAt(0)}</div>
                                <div>
                                    <h3 className="font-semibold text-dark-100">{a.patientName}</h3>
                                    <p className="text-xs text-dark-400 mt-1">{new Date(a.appointmentDateTime).toLocaleString()}</p>
                                    {a.reason && <p className="text-xs text-dark-500 mt-1">Reason: {a.reason}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                                {a.status === 'PENDING' && (<>
                                    <button onClick={() => updateStatus(a.id, 'CONFIRMED')} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-medium hover:bg-green-500/20 flex items-center gap-1"><FiCheck size={12} /> Accept</button>
                                    <button onClick={() => updateStatus(a.id, 'REJECTED')} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-medium hover:bg-red-500/20 flex items-center gap-1"><FiX size={12} /> Reject</button>
                                </>)}
                                {a.status === 'CONFIRMED' && (<>
                                    <button onClick={() => updateStatus(a.id, 'COMPLETED')} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-medium hover:bg-blue-500/20 flex items-center gap-1"><FiCheckCircle size={12} /> Complete</button>
                                </>)}
                                {(a.status === 'CONFIRMED' || a.status === 'COMPLETED') && !a.hasPrescription && (
                                    <button onClick={() => navigate(`/doctor/prescriptions/create/${a.id}`)} className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-medium hover:bg-purple-500/20 flex items-center gap-1"><FiFileText size={12} /> Prescribe</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}</div>
            )}
        </div>
    );
}
