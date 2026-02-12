import { useState, useEffect } from 'react';
import { prescriptionAPI } from '../../services/api';
import { FiFileText, FiCalendar } from 'react-icons/fi';

export default function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchPrescriptions(); }, []);

    const fetchPrescriptions = async () => {
        try {
            const res = await prescriptionAPI.getPatientPrescriptions();
            setPrescriptions(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold text-dark-100">My Prescriptions</h1><p className="text-dark-400 mt-1">View your digital prescriptions</p></div>
            {prescriptions.length === 0 ? (
                <div className="glass-card p-12 text-center"><FiFileText className="mx-auto text-dark-500 mb-3" size={36} /><p className="text-dark-400">No prescriptions yet</p></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {prescriptions.map(rx => (
                        <div key={rx.id} className={`glass-card p-6 cursor-pointer ${selected === rx.id ? 'border-primary-500' : ''}`} onClick={() => setSelected(selected === rx.id ? null : rx.id)}>
                            <div className="flex items-start justify-between mb-4">
                                <div><h3 className="font-semibold text-dark-100">{rx.doctorName}</h3><p className="text-sm text-primary-400">{rx.doctorSpecialization}</p></div>
                                <p className="text-xs text-dark-400"><FiCalendar className="inline mr-1" size={12} />{new Date(rx.issuedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-3">
                                <div><label className="text-xs font-semibold text-dark-400 uppercase">Diagnosis</label><p className="text-sm text-dark-200 mt-1">{rx.diagnosis}</p></div>
                                <div><label className="text-xs font-semibold text-dark-400 uppercase">Medications</label><p className="text-sm text-dark-200 mt-1 whitespace-pre-line">{rx.medications}</p></div>
                                {selected === rx.id && rx.notes && (<div className="animate-slide-up"><label className="text-xs font-semibold text-dark-400 uppercase">Notes</label><p className="text-sm text-dark-200 mt-1">{rx.notes}</p></div>)}
                            </div>
                            <p className="text-xs text-dark-500 mt-3 pt-3 border-t border-dark-700/50">Appointment: {new Date(rx.appointmentDateTime).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
