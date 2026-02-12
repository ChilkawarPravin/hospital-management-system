import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ========== Auth API ==========
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

// ========== Doctor API ==========
export const doctorAPI = {
    getAll: () => api.get('/doctors'),
    getById: (id) => api.get(`/doctors/${id}`),
    getBySpecialization: (spec) => api.get(`/doctors/specialization/${spec}`),
    getProfile: () => api.get('/doctors/profile'),
    updateProfile: (data) => api.put('/doctors/profile', data),
    updateAvailability: (available) => api.put('/doctors/availability', { available }),
};

// ========== Patient API ==========
export const patientAPI = {
    getProfile: () => api.get('/patients/profile'),
    updateProfile: (data) => api.put('/patients/profile', data),
};

// ========== Appointment API ==========
export const appointmentAPI = {
    book: (data) => api.post('/appointments', data),
    getPatientAppointments: () => api.get('/appointments/patient'),
    getDoctorAppointments: () => api.get('/appointments/doctor'),
    getDoctorTodayAppointments: () => api.get('/appointments/doctor/today'),
    getById: (id) => api.get(`/appointments/${id}`),
    updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
};

// ========== Payment API ==========
export const paymentAPI = {
    makePayment: (data) => api.post('/payments', data),
    getByAppointment: (appointmentId) => api.get(`/payments/appointment/${appointmentId}`),
};

// ========== Prescription API ==========
export const prescriptionAPI = {
    create: (data) => api.post('/prescriptions', data),
    getByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),
    getPatientPrescriptions: () => api.get('/prescriptions/patient'),
    getDoctorPrescriptions: () => api.get('/prescriptions/doctor'),
};

export default api;
