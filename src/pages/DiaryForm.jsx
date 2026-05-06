import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Type, AlignLeft, Image as ImageIcon, Music, Headphones, Sparkles, Folder } from 'lucide-react';

export default function DiaryForm() {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const folderId = queryParams.get('folderId');
    
    const isEdit = !!id;
    const [form, setForm] = useState({ title: '', content: '', spotifyUrl: '' });
    const [photo, setPhoto] = useState(null);
    const [audio, setAudio] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState('');
    const [existingAudio, setExistingAudio] = useState('');
    const [diaryFolderId, setDiaryFolderId] = useState(folderId);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) {
            const fetchDiary = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`http://localhost:5000/api/diary/${id}`, {
                        headers: { Authorization: token }
                    });
                    const { title, content, spotifyUrl, mediaUrl, audioUrl, folderId: fid } = res.data;
                    setForm({ title, content, spotifyUrl: spotifyUrl || '' });
                    setExistingPhoto(mediaUrl);
                    setExistingAudio(audioUrl);
                    setDiaryFolderId(fid);
                } catch (err) {
                    console.error('Failed to fetch diary', err);
                    navigate('/dashboard');
                } finally {
                    setFetching(false);
                }
            };
            fetchDiary();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('content', form.content);
            formData.append('spotifyUrl', form.spotifyUrl);
            if (diaryFolderId) formData.append('folderId', diaryFolderId);
            if (photo) formData.append('photo', photo);
            if (audio) formData.append('audio', audio);

            const url = isEdit 
                ? `http://localhost:5000/api/diary/${id}` 
                : 'http://localhost:5000/api/diary';
            const method = isEdit ? 'put' : 'post';

            await axios[method](url, formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setTimeout(() => {
                if (diaryFolderId) navigate(`/folder/${diaryFolderId}`);
                else navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Failed to save', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <span className="loading loading-spinner loading-lg text-pink-500"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 p-6" data-theme="cupcake">
            <header className="max-w-4xl mx-auto flex items-center gap-4 mb-10 relative">
                {success && (
                    <div className="alert alert-success absolute -top-16 left-0 right-0 shadow-lg border-none bg-cyan-400 text-white font-bold">
                        <span>Catatan berhasil disimpan!</span>
                    </div>
                )}
                <Link to="/dashboard" className="btn btn-ghost text-pink-500">
                    <ArrowLeft size={24} />
                </Link>
                <div className="flex items-center gap-3">
                    <img 
                        src="/Dear Diary....png" 
                        alt="Logo" 
                        className="w-12 h-12 object-contain" 
                    />
                    <h1 className="text-3xl font-black text-gray-800">
                        {isEdit ? 'Edit Catatan' : 'Catatan Baru'}
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="card bg-white shadow-2xl border-2 border-pink-200">
                    <div className="card-body p-8 space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-lg flex items-center gap-2 text-pink-600">
                                    <Folder size={20} className="text-pink-500" />
                                    Nama Folder (Judul)
                                </span>
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                placeholder="Kenangan Manis..."
                                className="input input-bordered w-full text-2xl font-black border-2 border-pink-200 focus:border-pink-400 bg-white text-gray-800 placeholder:text-pink-300 focus:outline-none"
                                required
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lg flex items-center gap-2 text-pink-600">
                                        <ImageIcon size={20} className="text-pink-400" />
                                        Lampiran Foto
                                    </span>
                                </label>
                                <input 
                                    type="file" 
                                    className="file-input file-input-bordered file-input-primary w-full bg-pink-50 border-pink-200" 
                                    accept="image/*"
                                    onChange={e => setPhoto(e.target.files[0])}
                                />
                                {isEdit && existingPhoto && !photo && (
                                    <p className="text-xs text-gray-400 mt-2 italic">*Foto tersimpan akan tetap ada</p>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lg flex items-center gap-2 text-pink-600">
                                        <Headphones size={20} className="text-purple-400" />
                                        Lampiran Lagu (Device)
                                    </span>
                                </label>
                                <input 
                                    type="file" 
                                    className="file-input file-input-bordered file-input-secondary w-full bg-purple-50 border-purple-200" 
                                    accept="audio/*"
                                    onChange={e => setAudio(e.target.files[0])}
                                />
                                {isEdit && existingAudio && !audio && (
                                    <p className="text-xs text-gray-400 mt-2 italic">*Lagu tersimpan akan tetap ada</p>
                                )}
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-bold text-lg flex items-center gap-2 text-gray-600">
                                        <Music size={20} className="text-cyan-400" />
                                        Soundtrack Spotify
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={form.spotifyUrl}
                                    placeholder="Tautan lagu Spotify di sini"
                                    className="input input-bordered w-full border-2 border-cyan-200 bg-white focus:border-cyan-400 text-gray-800 placeholder:text-cyan-300"
                                    onChange={e => setForm({ ...form, spotifyUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-lg flex items-center gap-2 text-pink-600">
                                    <AlignLeft size={20} className="text-cyan-500" />
                                    Isi Diary
                                </span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full min-h-[300px] text-lg font-semibold leading-relaxed border-2 border-pink-100 focus:border-pink-300 bg-white text-gray-800 placeholder:text-pink-200 focus:outline-none"
                                value={form.content}
                                placeholder="Tuangkan semua isi hatimu..."
                                required
                                onChange={e => setForm({ ...form, content: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="card-actions justify-end pt-6">
                            <button 
                                type="submit" 
                                className="btn btn-lg bg-pink-500 hover:bg-pink-600 border-none text-white font-black shadow-xl gap-3 px-12 md:px-16 tracking-wide transition-all transform hover:scale-105 active:scale-95"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : <Save size={24} />}
                                {isEdit ? 'Update Catatan' : 'Simpan Catatan'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
