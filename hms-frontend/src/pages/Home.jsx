import { Link } from 'react-router-dom';
import { FiCalendar, FiShield, FiUsers, FiFileText, FiArrowRight } from 'react-icons/fi';

export default function Home() {
    const features = [
        { icon: <FiCalendar size={24} />, title: 'Easy Booking', desc: 'Book appointments with specialists in just a few clicks' },
        { icon: <FiShield size={24} />, title: 'Secure Records', desc: 'Your medical data is encrypted and protected' },
        { icon: <FiUsers size={24} />, title: 'Expert Doctors', desc: 'Browse verified doctors across specializations' },
        { icon: <FiFileText size={24} />, title: 'Digital Prescriptions', desc: 'Access prescriptions anytime, anywhere' },
    ];

    return (
        <div className="min-h-screen gradient-bg">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center font-bold text-white text-sm">H</div>
                    <span className="text-xl font-bold gradient-text">HMS</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="px-4 py-2 text-sm text-dark-300 hover:text-primary-400 transition-colors">Login</Link>
                    <Link to="/register" className="px-5 py-2 text-sm gradient-btn rounded-lg text-white font-medium">Get Started</Link>
                </div>
            </header>

            {/* Hero */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24 text-center">
                <div className="animate-fade-in">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6">
                        ✨ Modern Healthcare Management
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-dark-100 leading-tight mb-6">
                        Your Health,<br /><span className="gradient-text">Our Priority</span>
                    </h1>
                    <p className="text-lg text-dark-400 max-w-2xl mx-auto mb-10">
                        Seamlessly manage appointments, prescriptions, and patient care with our intelligent Hospital Management System.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/register" className="px-8 py-3.5 gradient-btn rounded-xl text-white font-semibold flex items-center gap-2 text-lg">
                            Get Started <FiArrowRight />
                        </Link>
                        <Link to="/login" className="px-8 py-3.5 rounded-xl border border-dark-600 text-dark-200 font-medium hover:border-primary-500/50 hover:text-primary-400 transition-all text-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="glass-card p-6 text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="w-14 h-14 mx-auto rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">{f.icon}</div>
                            <h3 className="font-semibold text-dark-100 mb-2">{f.title}</h3>
                            <p className="text-sm text-dark-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-dark-800 py-8">
                <p className="text-center text-dark-500 text-sm">© 2025 HMS - Hospital Management System. All rights reserved.</p>
            </footer>
        </div>
    );
}
