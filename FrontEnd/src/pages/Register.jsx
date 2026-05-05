import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, Shield, PenLine } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', pin: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', form);
            setSuccess('Akun berhasil dibuat! Mengalihkan...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data || err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 flex items-center justify-center p-4" data-theme="cupcake">
            <div className="card w-full max-w-lg bg-white shadow-2xl border-2 border-pink-200 relative overflow-visible">
                {error && (
                    <div className="alert alert-error absolute -top-16 left-0 right-0 shadow-lg border-none bg-red-400 text-white font-bold">
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="alert alert-success absolute -top-16 left-0 right-0 shadow-lg border-none bg-cyan-400 text-white font-bold">
                        <span>{success}</span>
                    </div>
                )}
                <div className="card-body">
                    <div className="text-center mb-6">
                        <img 
                            src="/Dear Diary....png" 
                            alt="Logo" 
                            className="w-24 h-24 mx-auto mb-3 object-contain drop-shadow-md" 
                        />
                        <h2 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent pb-2 leading-relaxed">
                            Daftar Dear Diary
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-lg flex items-center gap-2 text-gray-700">
                                    <User size={20} strokeWidth={2.5} className="text-pink-500" />
                                    Username
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                className="input w-full input-lg font-semibold border-2 border-pink-200 focus:border-cyan-400 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                required
                                onChange={e => setForm({ ...form, username: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black text-lg flex items-center gap-2 text-gray-800">
                                    <Mail size={20} strokeWidth={2.5} className="text-pink-500" />
                                    Email
                                </span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="input w-full input-lg font-semibold border-2 border-pink-200 focus:border-cyan-400 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                required
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black text-lg flex items-center gap-2 text-gray-800">
                                    <Lock size={20} strokeWidth={2.5} className="text-pink-500" />
                                    Password
                                </span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password rahasia"
                                className="input w-full input-lg font-semibold border-2 border-pink-200 focus:border-cyan-400 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                required
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black text-lg flex items-center gap-2 text-gray-800">
                                    <Shield size={20} strokeWidth={2.5} className="text-pink-500" />
                                    PIN Keamanan
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="6 digit PIN"
                                maxLength="6"
                                className="input w-full input-lg font-semibold border-2 border-pink-200 focus:border-cyan-400 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none text-center tracking-widest"
                                required
                                onChange={e => setForm({ ...form, pin: e.target.value })}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn w-full btn-lg font-black text-lg gap-2 shadow-lg hover:shadow-xl bg-pink-500 hover:bg-pink-600 border-none text-white"
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : <PenLine size={24} strokeWidth={2.5} />}
                            Mulai Menulis
                        </button>
                    </form>
                    <div className="divider font-bold text-gray-400">ATAU</div>
                    <p className="text-center font-bold text-lg text-gray-600">
                        Sudah punya akun? <Link to="/login" className="text-cyan-500 hover:text-cyan-600 font-black">Masuk</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
