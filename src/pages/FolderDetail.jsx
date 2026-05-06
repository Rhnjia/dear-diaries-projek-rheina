import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Edit, BookOpen, Music, Headphones, Folder, Lock } from 'lucide-react';

export default function FolderDetail() {
    const { id } = useParams();
    const [folder, setFolder] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDiary, setSelectedDiary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFolderAndDiaries();
    }, [id]);

    const fetchFolderAndDiaries = async () => {
        try {
            const token = localStorage.getItem('token');
            if (id === 'all') {
                setFolder({ name: 'Uncategorized', isSecret: false });
                const diariesRes = await axios.get(`http://localhost:5000/api/diary`, {
                    headers: { Authorization: token }
                });
                setDiaries(diariesRes.data.filter(d => !d.folderId));
            } else {
                // Fetch folder info
                const folderRes = await axios.get(`http://localhost:5000/api/folder`, {
                    headers: { Authorization: token }
                });
                const currentFolder = folderRes.data.find(f => f._id === id);
                if (!currentFolder) return navigate('/dashboard');
                setFolder(currentFolder);

                // Fetch diaries in this folder
                const diariesRes = await axios.get(`http://localhost:5000/api/diary?folderId=${id}`, {
                    headers: { Authorization: token }
                });
                setDiaries(diariesRes.data);
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getSpotifyEmbed = (url) => {
        if (!url) return null;
        try {
            const trackId = url.split('track/')[1]?.split('?')[0];
            if (trackId) return `https://open.spotify.com/embed/track/${trackId}`;
            const playlistId = url.split('playlist/')[1]?.split('?')[0];
            if (playlistId) return `https://open.spotify.com/embed/playlist/${playlistId}`;
            return null;
        } catch (e) { return null; }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50">
            <span className="loading loading-spinner loading-lg text-pink-500"></span>
        </div>
    );

    const handleDeleteDiary = async (e, diaryId) => {
        e.stopPropagation();
        if (!window.confirm('Yakin mau hapus catatan ini? Kenangan ini bakal hilang selamanya lho... 🥺')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/diary/${diaryId}`, {
                headers: { Authorization: token }
            });
            setDiaries(diaries.filter(d => d._id !== diaryId));
        } catch (err) {
            console.error('Failed to delete diary', err);
            alert('Gagal menghapus catatan: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 p-4 md:p-6" data-theme="cupcake">
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 bg-white/40 backdrop-blur-md p-4 md:p-6 rounded-3xl border-2 border-pink-100 shadow-sm gap-6">
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <Link to="/dashboard" className="btn btn-circle btn-sm md:btn-md btn-ghost text-pink-500 shrink-0">
                        <ArrowLeft size={20} className="md:size-6" />
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                        <Folder size={28} className={`${folder?.isSecret ? "text-purple-400" : "text-pink-400"} shrink-0 md:size-8`} />
                        <div className="overflow-hidden">
                            <h1 className="text-xl md:text-3xl font-black text-gray-800 flex items-center gap-2 truncate">
                                {folder?.name}
                                {folder?.isSecret && <Lock size={16} className="text-purple-400 md:size-5" />}
                            </h1>
                            <p className="text-gray-500 font-bold text-xs md:text-sm">{diaries.length} Catatan</p>
                        </div>
                    </div>
                </div>
                <Link 
                    to={`/create?folderId=${id}`} 
                    className="btn btn-md md:btn-lg bg-pink-500 hover:bg-pink-600 border-none text-white font-black shadow-xl gap-3 w-full md:w-auto px-8 md:px-12 tracking-wide transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus size={22} />
                    Tambah Catatan
                </Link>
            </header>

            <main className="max-w-6xl mx-auto">
                {diaries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-2 border-pink-100">
                        <BookOpen className="w-24 h-24 text-pink-200 mx-auto mb-4" strokeWidth={1.5} />
                        <h2 className="text-2xl font-black text-gray-400">Folder ini masih kosong...</h2>
                        <p className="text-gray-400 mb-8 font-bold">Mulai isi kenanganmu di folder ini!</p>
                        <Link to={`/create?folderId=${id}`} className="btn btn-outline border-2 border-cyan-400 text-cyan-500 font-black">
                            Tulis Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {diaries.map(diary => (
                            <div key={diary._id} className="card bg-white shadow-xl hover:shadow-2xl transition-all border-2 border-pink-100 hover:border-pink-300 group overflow-hidden">
                                {diary.mediaUrl && (
                                    <figure className="h-48 overflow-hidden">
                                        <img 
                                            src={`http://localhost:5000${diary.mediaUrl}`} 
                                            alt="Diary" 
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </figure>
                                )}
                                <div className="card-body p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-black text-gray-800 line-clamp-1">{diary.title}</h3>
                                        <div className="flex gap-2">
                                            <Link to={`/edit/${diary._id}`} className="text-gray-300 hover:text-cyan-500 p-1 bg-cyan-50 rounded-lg transition-colors" title="Edit Catatan">
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={(e) => handleDeleteDiary(e, diary._id)}
                                                className="text-gray-300 hover:text-red-500 p-1 bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Catatan"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-bold mb-4 line-clamp-3">
                                        {diary.content}
                                    </p>
                                    <button 
                                        onClick={() => setSelectedDiary(diary)}
                                        className="btn btn-sm btn-ghost border-2 border-pink-50 text-pink-500 font-black"
                                    >
                                        Baca Selengkapnya
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Detail (Copied from Dashboard) */}
            {selectedDiary && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl bg-white border-4 border-pink-200 rounded-3xl p-8 overflow-y-auto max-h-[90vh]">
                        <h3 className="font-black text-3xl text-gray-800 mb-4">{selectedDiary.title}</h3>
                        <div className="badge bg-cyan-100 text-cyan-600 border-none font-bold p-3 mb-6">
                            {new Date(selectedDiary.date).toLocaleDateString()}
                        </div>

                        {selectedDiary.mediaUrl && (
                            <div className="mb-6 rounded-2xl overflow-hidden border-2 border-pink-100">
                                <img src={`http://localhost:5000${selectedDiary.mediaUrl}`} className="w-full" />
                            </div>
                        )}

                        {selectedDiary.spotifyUrl && getSpotifyEmbed(selectedDiary.spotifyUrl) && (
                            <div className="mb-6">
                                <iframe style={{ borderRadius: '12px' }} src={getSpotifyEmbed(selectedDiary.spotifyUrl)} width="100%" height="152" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            </div>
                        )}

                        {selectedDiary.audioUrl && (
                            <div className="mb-6 p-4 bg-purple-50 rounded-2xl border-2 border-purple-100">
                                <p className="text-purple-600 font-bold mb-2 flex items-center gap-2">
                                    <Headphones size={20} /> Audio Terlampir
                                </p>
                                <audio controls className="w-full">
                                    <source src={`http://localhost:5000${selectedDiary.audioUrl}`} type="audio/mpeg" />
                                </audio>
                            </div>
                        )}

                        <p className="text-lg text-gray-600 font-bold leading-relaxed whitespace-pre-wrap">{selectedDiary.content}</p>
                        <div className="modal-action">
                            <button onClick={() => setSelectedDiary(null)} className="btn bg-pink-500 text-white border-none font-black px-8">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
