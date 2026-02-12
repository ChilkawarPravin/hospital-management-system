import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentAPI, paymentAPI } from '../../services/api';
import { FiDollarSign, FiCreditCard, FiArrowLeft, FiCheck } from 'react-icons/fi';

/**
 * Payment Page - process payment for an appointment.
 */
export default function Payment() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const methods = [
        { value: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
        { value: 'UPI', label: 'UPI Payment', icon: '📱' },
        { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
        { value: 'CASH', label: 'Cash', icon: '💵' },
    ];

    useEffect(() => {
        fetchAppointment();
    }, [appointmentId]);

    const fetchAppointment = async () => {
        try {
            const res = await appointmentAPI.getById(appointmentId);
            setAppointment(res.data.data);
        } catch (err) {
            setError('Appointment not found');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setError('');
        setProcessing(true);
        try {
            const res = await paymentAPI.makePayment({
                appointmentId: parseInt(appointmentId),
                amount: appointment.consultationFee,
                paymentMethod,
            });
            setSuccess(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-lg mx-auto animate-fade-in">
                <div className="glass-card p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                        <FiCheck className="text-green-400" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-dark-100 mb-2">Payment Successful!</h2>
                    <p className="text-dark-400 mb-4">Transaction ID: {success.transactionId}</p>
                    <div className="glass p-4 rounded-xl mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-dark-400">Amount Paid</span>
                            <span className="text-dark-100 font-semibold">₹{success.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-dark-400">Method</span>
                            <span className="text-dark-100">{success.paymentMethod}</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/patient/appointments')}
                        className="gradient-btn px-6 py-2.5 rounded-xl text-white font-medium">
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors">
                <FiArrowLeft /> Back
            </button>

            <h1 className="text-2xl font-bold text-dark-100">Make Payment</h1>

            {/* Appointment Summary */}
            {appointment && (
                <div className="glass-card p-6">
                    <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">Appointment Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-dark-400">Doctor</span>
                            <span className="text-dark-100">{appointment.doctorName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-dark-400">Specialization</span>
                            <span className="text-dark-100">{appointment.doctorSpecialization}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-dark-400">Date</span>
                            <span className="text-dark-100">{new Date(appointment.appointmentDateTime).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-dark-700/50">
                            <span className="text-dark-200 font-medium">Total Amount</span>
                            <span className="text-xl font-bold gradient-text">₹{appointment.consultationFee}</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            {/* Payment Methods */}
            <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                    {methods.map(m => (
                        <button
                            key={m.value}
                            onClick={() => setPaymentMethod(m.value)}
                            className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === m.value
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-dark-700 hover:border-dark-500'
                                }`}
                        >
                            <span className="text-2xl">{m.icon}</span>
                            <p className="text-sm font-medium text-dark-200 mt-2">{m.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-3 gradient-btn rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {processing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : (
                    <>
                        <FiCreditCard /> Pay ₹{appointment?.consultationFee}
                    </>
                )}
            </button>
        </div>
    );
}
