import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../../services/api';
import { FiFileText, FiArrowLeft } from 'react-icons/fi';

export default function CreatePrescription() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appt, setAppt] = useState(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        appointmentAPI.getById(appointmentId)
            .then(res => setAppt(res.data.data))
            .catch(() => setError('Appointment not found'))
            .finally(() => setLoading(false));
    }, [appointmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setError('');
        try {
            await prescriptionAPI.create({ appointmentId: parseInt(appointmentId), diagnosis, medications, notes });
            setSuccess(true);
            setTimeout(() => navigate('/doctor/appointments'), 1500);
        } catch (err) { setError(err.response?.data?.message || 'Failed to create prescription'); }
        finally { setSubmitting(false); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-primary-400"><FiArrowLeft /> Back</button>
            <h1 className="text-2xl font-bold text-dark-100">Create Prescription</h1>
            {appt && (
                <div className="glass-card p-5">
                    <div className="flex justify-between"><div><p className="font-medium text-dark-100">Patient: {appt.patientName}</p><p className="text-sm text-dark-400">{new Date(appt.appointmentDateTime).toLocaleString()}</p></div><span className={`badge badge-${appt.status.toLowerCase()}`}>{appt.status}</span></div>
                    {appt.reason && <p className="text-sm text-dark-500 mt-2">Reason: {appt.reason}</p>}
                </div>
            )}
            <div className="glass-card p-6">
                {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">Prescription created successfully!</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div><label className="input-label">Diagnosis *</label><textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="input-field" rows="2" placeholder="Enter diagnosis..." required /></div>
                    <div><label className="input-label">Medications *</label><textarea value={medications} onChange={e => setMedications(e.target.value)} className="input-field" rows="4" placeholder="Enter medications (one per line)..." required /></div>
                    <div><label className="input-label">Additional Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field" rows="2" placeholder="Any additional notes..." /></div>
                    <button type="submit" disabled={submitting} className="w-full py-3 gradient-btn rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                        {submitting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <><FiFileText /> Issue Prescription</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
