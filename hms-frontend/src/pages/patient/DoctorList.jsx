import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../../services/api';
import { FiSearch, FiStar, FiDollarSign, FiCalendar } from 'react-icons/fi';

/**
 * Doctor List Page - browse and filter doctors by specialization.
 */
export default function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const specializations = [
        'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics',
        'Neurology', 'Ophthalmology', 'General Medicine', 'Gynecology', 'ENT', 'Psychiatry'
    ];

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        let result = doctors;
        if (search) {
            result = result.filter(d =>
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                d.specialization.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (specialization) {
            result = result.filter(d =>
                d.specialization.toLowerCase() === specialization.toLowerCase()
            );
        }
        setFiltered(result);
    }, [search, specialization, doctors]);

    const fetchDoctors = async () => {
        try {
            const res = await doctorAPI.getAll();
            setDoctors(res.data.data || []);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-dark-100">Find Doctors</h1>
                <p className="text-dark-400 mt-1">Browse and book appointments with specialists</p>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                            placeholder="Search doctors by name or specialization..."
                        />
                    </div>
                    <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="input-field md:w-56"
                    >
                        <option value="">All Specializations</option>
                        {specializations.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Doctor Cards */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FiSearch className="mx-auto text-dark-500 mb-3" size={36} />
                    <p className="text-dark-400 text-lg">No doctors found</p>
                    <p className="text-dark-500 text-sm mt-1">Try adjusting your search filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(doctor => (
                        <div key={doctor.id} className="glass-card p-6 flex flex-col">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl gradient-btn flex items-center justify-center text-white text-xl font-bold shrink-0">
                                    {doctor.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-dark-100 truncate">{doctor.name}</h3>
                                    <p className="text-sm text-primary-400">{doctor.specialization}</p>
                                    {doctor.qualification && (
                                        <p className="text-xs text-dark-400 mt-0.5">{doctor.qualification}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 flex-1">
                                {doctor.experienceYears && (
                                    <div className="flex items-center gap-2 text-sm text-dark-300">
                                        <FiStar className="text-yellow-400" size={14} />
                                        <span>{doctor.experienceYears} years experience</span>
                                    </div>
                                )}
                                {doctor.consultationFee && (
                                    <div className="flex items-center gap-2 text-sm text-dark-300">
                                        <FiDollarSign className="text-green-400" size={14} />
                                        <span>₹{doctor.consultationFee} consultation fee</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    <span className={doctor.available ? 'text-green-400' : 'text-red-400'}>
                                        {doctor.available ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>

                            {doctor.bio && (
                                <p className="text-xs text-dark-400 mb-4 line-clamp-2">{doctor.bio}</p>
                            )}

                            <button
                                onClick={() => navigate(`/patient/book-appointment/${doctor.id}`)}
                                disabled={!doctor.available}
                                className="w-full py-2.5 gradient-btn rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiCalendar size={14} />
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
