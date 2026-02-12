import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { FiSave } from 'react-icons/fi';

export default function DoctorProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try { const res = await doctorAPI.getProfile(); setProfile(res.data.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        try { const res = await doctorAPI.updateProfile(profile); setProfile(res.data.data); setMsg('Profile updated!'); }
        catch (err) { setMsg('Update failed'); }
        finally { setSaving(false); }
    };

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-100">My Profile</h1>
            <div className="glass-card p-6">
                {msg && <div className={`mb-4 p-3 rounded-lg text-sm ${msg.includes('failed') ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-green-500/10 text-green-400 border border-green-500/30'}`}>{msg}</div>}
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="input-label">Name</label><input type="text" name="name" value={profile?.name || ''} onChange={handleChange} className="input-field" /></div>
                        <div><label className="input-label">Phone</label><input type="tel" name="phone" value={profile?.phone || ''} onChange={handleChange} className="input-field" /></div>
                        <div><label className="input-label">Specialization</label><input type="text" name="specialization" value={profile?.specialization || ''} onChange={handleChange} className="input-field" /></div>
                        <div><label className="input-label">Qualification</label><input type="text" name="qualification" value={profile?.qualification || ''} onChange={handleChange} className="input-field" /></div>
                        <div><label className="input-label">Experience (years)</label><input type="number" name="experienceYears" value={profile?.experienceYears || ''} onChange={handleChange} className="input-field" /></div>
                        <div><label className="input-label">Consultation Fee (₹)</label><input type="number" name="consultationFee" value={profile?.consultationFee || ''} onChange={handleChange} className="input-field" /></div>
                    </div>
                    <div><label className="input-label">Bio</label><textarea name="bio" value={profile?.bio || ''} onChange={handleChange} className="input-field" rows="3" /></div>
                    <button type="submit" disabled={saving} className="gradient-btn px-6 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50">
                        {saving ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div> : <><FiSave /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
