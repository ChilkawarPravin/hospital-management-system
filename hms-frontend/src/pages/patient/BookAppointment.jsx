import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { FiCalendar, FiClock, FiArrowLeft } from 'react-icons/fi';

/**
 * Book Appointment Page - allows patients to book an appointment with a specific doctor.
 */
export default function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [dateTime, setDateTime] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchDoctor();
    }, [doctorId]);

    const fetchDoctor = async () => {
        try {
            const res = await doctorAPI.getById(doctorId);
            setDoctor(res.data.data);
        } catch (err) {
            setError('Doctor not found');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await appointmentAPI.book({
                doctorId: parseInt(doctorId),
                appointmentDateTime: dateTime,
                reason,
            });
            setSuccess('Appointment booked successfully!');
            setTimeout(() => navigate('/patient/appointments'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
        }
    };

    // Get minimum date-time (now)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors">
                <FiArrowLeft /> Back to Doctors
            </button>

            <h1 className="text-2xl font-bold text-dark-100">Book Appointment</h1>

            {/* Doctor Info */}
            {doctor && (
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl gradient-btn flex items-center justify-center text-white text-2xl font-bold">
                        {doctor.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-dark-100">{doctor.name}</h2>
                        <p className="text-primary-400">{doctor.specialization}</p>
                        {doctor.consultationFee && (
                            <p className="text-sm text-dark-400 mt-1">Consultation Fee: ₹{doctor.consultationFee}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Booking Form */}
            <div className="glass-card p-6">
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
                )}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="input-label">Appointment Date & Time *</label>
                        <div className="relative">
                            <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                min={getMinDateTime()}
                                className="input-field pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Reason for Visit</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="input-field"
                            rows="3"
                            placeholder="Describe your symptoms or reason for consultation..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 gradient-btn rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        ) : (
                            <>
                                <FiCalendar /> Confirm Booking
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
