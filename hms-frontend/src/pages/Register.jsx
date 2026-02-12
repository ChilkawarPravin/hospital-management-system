import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiUserPlus } from 'react-icons/fi';

/**
 * Register Page - handles new user registration with role selection.
 */
export default function Register() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', role: 'PATIENT',
        // Patient fields
        age: '', gender: '', bloodGroup: '', address: '', emergencyContact: '',
        // Doctor fields
        specialization: '', qualification: '', experienceYears: '', consultationFee: '', bio: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...formData };
            if (payload.age) payload.age = parseInt(payload.age);
            if (payload.experienceYears) payload.experienceYears = parseInt(payload.experienceYears);
            if (payload.consultationFee) payload.consultationFee = parseFloat(payload.consultationFee);
            const data = await register(payload);
            navigate(data.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isDoctor = formData.role === 'DOCTOR';

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-btn flex items-center justify-center mb-4">
                        <FiUserPlus className="text-2xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
                    <p className="text-dark-400 mt-2">Join HMS as a Patient or Doctor</p>
                </div>

                <div className="glass-card p-8">
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div className="flex gap-3 p-1 bg-dark-800/50 rounded-xl">
                            <button type="button"
                                onClick={() => setFormData({ ...formData, role: 'PATIENT' })}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!isDoctor ? 'gradient-btn text-white' : 'text-dark-400 hover:text-dark-200'
                                    }`}>
                                Patient
                            </button>
                            <button type="button"
                                onClick={() => setFormData({ ...formData, role: 'DOCTOR' })}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${isDoctor ? 'gradient-btn text-white' : 'text-dark-400 hover:text-dark-200'
                                    }`}>
                                Doctor
                            </button>
                        </div>

                        {/* Common Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Full Name *</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                                        className="input-field pl-10" placeholder="John Doe" required />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Email *</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                        className="input-field pl-10" placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Password *</label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange}
                                        className="input-field pl-10" placeholder="Min 6 characters" required minLength={6} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Phone</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        className="input-field pl-10" placeholder="9876543210" />
                                </div>
                            </div>
                        </div>

                        {/* Role-Specific Fields */}
                        {isDoctor ? (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Doctor Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Specialization *</label>
                                        <select name="specialization" value={formData.specialization} onChange={handleChange}
                                            className="input-field" required>
                                            <option value="">Select Specialization</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Ophthalmology">Ophthalmology</option>
                                            <option value="General Medicine">General Medicine</option>
                                            <option value="Gynecology">Gynecology</option>
                                            <option value="ENT">ENT</option>
                                            <option value="Psychiatry">Psychiatry</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">Qualification</label>
                                        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange}
                                            className="input-field" placeholder="e.g. MD, MBBS" />
                                    </div>
                                    <div>
                                        <label className="input-label">Experience (years)</label>
                                        <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange}
                                            className="input-field" placeholder="e.g. 5" min="0" />
                                    </div>
                                    <div>
                                        <label className="input-label">Consultation Fee (₹)</label>
                                        <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange}
                                            className="input-field" placeholder="e.g. 500" min="0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Bio</label>
                                    <textarea name="bio" value={formData.bio} onChange={handleChange}
                                        className="input-field" rows="2" placeholder="Brief description about yourself..."></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Patient Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="input-label">Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleChange}
                                            className="input-field" placeholder="e.g. 30" min="1" max="150" />
                                    </div>
                                    <div>
                                        <label className="input-label">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                            <option value="">Select</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">Blood Group</label>
                                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field">
                                            <option value="">Select</option>
                                            <option value="A+">A+</option><option value="A-">A-</option>
                                            <option value="B+">B+</option><option value="B-">B-</option>
                                            <option value="O+">O+</option><option value="O-">O-</option>
                                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                                        className="input-field" placeholder="Your address" />
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full py-3 gradient-btn rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                            ) : (
                                <>
                                    <FiUserPlus /> Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-dark-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
