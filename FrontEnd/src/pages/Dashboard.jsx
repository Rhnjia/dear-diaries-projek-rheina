import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, Plus, LogOut, BookOpen, PenLine, Calendar, Music, Headphones, Check, X, Folder, Lock, ShieldCheck, Gamepad2 } from 'lucide-react';
import GameCenter from '../components/GameCenter';

export default function Dashboard() {
    const [folders, setFolders] = useState([]);
    const [orphanCount, setOrphanCount] = useState(0);
    const [user, setUser] = useState(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Folder Logic
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [folderPin, setFolderPin] = useState('');
    
    // PIN Verification
    const [verifyingFolder, setVerifyingFolder] = useState(null);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    // Game Center
    const [showGameCenter, setShowGameCenter] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/folder', {
                headers: { Authorization: token }
            });
            setFolders(res.data);

            // Fetch orphans
            const diaryRes = await axios.get('http://localhost:5000/api/diary', {
                headers: { Authorization: token }
            });
            const orphans = diaryRes.data.filter(d => !d.folderId);
            setOrphanCount(orphans.length);
        } catch (err) {
            console.error('Failed to fetch folders', err);
        }
    };

    const handleDeleteFolder = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Hapus koleksi ini? Catatan di dalamnya tidak akan terhapus tapi jadi tidak punya folder.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/folder/${id}`, {
                headers: { Authorization: token }
            });
            fetchFolders();
        } catch (err) {
            console.error('Failed to delete folder', err);
        }
    };

    const handleCreateOrUpdateFolder = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = {
                name: newFolderName,
                isSecret,
                pin: isSecret ? folderPin : null
            };

            if (editingFolder) {
                await axios.put(`http://localhost:5000/api/folder/${editingFolder._id}`, data, {
                    headers: { Authorization: token }
                });
            } else {
                await axios.post('http://localhost:5000/api/folder', data, {
                    headers: { Authorization: token }
                });
            }

            setNewFolderName('');
            setIsSecret(false);
            setFolderPin('');
            setShowFolderModal(false);
            setEditingFolder(null);
            fetchFolders();
        } catch (err) {
            console.error('Failed to save folder', err);
        }
    };

    const startEditFolder = (e, folder) => {
        e.stopPropagation();
        setEditingFolder(folder);
        setNewFolderName(folder.name);
        setIsSecret(folder.isSecret);
        setFolderPin(folder.pin || '');
        setShowFolderModal(true);
    };

    const handleFolderClick = (folder) => {
        if (folder.isSecret) {
            setVerifyingFolder(folder);
            setPinInput('');
            setPinError(false);
        } else {
            navigate(`/folder/${folder._id}`);
        }
    };

    const verifyPinAndOpen = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `http://localhost:5000/api/folder/verify-pin/${verifyingFolder._id}`,
                { pin: pinInput },
                { headers: { Authorization: token } }
            );
            if (res.data.ok) {
                navigate(`/folder/${verifyingFolder._id}`);
                setVerifyingFolder(null);
            }
        } catch (err) {
            setPinError(true);
            setPinInput('');
        }
    };

    const handleProfileUpload = async (blob) => {
        if (!blob) return;
        setUploadingProfile(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('profilePic', blob, 'profile.jpg');
            const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
                headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
            });
            const newUser = res.data;
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
        } catch (err) { console.error(err); } finally { setUploadingProfile(false); }
    };

    const cropAndUpload = () => {
        const img = document.getElementById('preview-img');
        const canvas = document.createElement('canvas');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const { naturalWidth, naturalHeight } = img;
        const aspect = naturalWidth / naturalHeight;
        ctx.save();
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.clip();
        const drawWidth = aspect > 1 ? (size * aspect * zoom) : (size * zoom);
        const drawHeight = aspect > 1 ? (size * zoom) : (size / aspect * zoom);
        const dx = (size - drawWidth) / 2 + position.x;
        const dy = (size - drawHeight) / 2 + position.y;
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        ctx.restore();
        canvas.toBlob((blob) => {
            handleProfileUpload(blob);
            setProfilePreview(null);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
        }, 'image/jpeg', 0.9);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 p-4 md:p-6 relative" data-theme="cupcake">
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-pink-100 shadow-sm gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto text-center md:text-left">
                    <img src="/Dear Diary....png" alt="Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowGameCenter(true)}
                            className="btn btn-circle bg-pink-100 text-pink-500 border-none hover:bg-pink-200 shadow-md"
                            title="Main Game"
                        >
                            <Gamepad2 size={24} />
                        </button>
                        <div className="relative group">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-pink-300 overflow-hidden bg-white shadow-lg relative">
                                {user?.profilePic ? (
                                    <img src={`http://localhost:5000${user.profilePic}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-pink-300 font-black text-2xl">R</div>
                                )}
                                {uploadingProfile && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <span className="loading loading-spinner text-pink-500"></span>
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-cyan-400 p-1.5 md:p-2 rounded-full cursor-pointer shadow-md hover:bg-cyan-500">
                                <Plus size={14} className="text-white md:size-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setProfilePreview({ file, url: reader.result });
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-pink-500 to-cyan-600 bg-clip-text text-transparent pb-1">Dear Diary</h1>
                            <p className="text-gray-700 font-bold text-sm md:text-base">Halo, {user?.username}!</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-end">
                    <button onClick={() => setShowFolderModal(true)} className="btn btn-md md:btn-lg bg-pink-500 hover:bg-pink-600 border-none text-white font-black shadow-xl gap-3 flex-1 md:flex-none px-6 md:px-10 tracking-wide transition-all transform hover:scale-105 active:scale-95">
                        <Folder size={20} /> <span className="hidden xs:inline">Koleksi Baru</span><span className="xs:hidden">Koleksi</span>
                    </button>
                    <button onClick={handleLogout} className="btn btn-md md:btn-lg btn-ghost text-gray-400 hover:text-pink-500 px-4 md:px-6 hover:bg-pink-50 rounded-2xl">
                        <LogOut size={22} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4">
                {folders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-2 border-pink-100">
                        <Folder className="w-24 h-24 text-pink-200 mx-auto mb-4" strokeWidth={1.5} />
                        <h2 className="text-2xl font-black text-gray-700">Kamu belum punya koleksi...</h2>
                        <p className="text-gray-600 mb-8 font-bold">Bikin satu buat mulai simpan kenanganmu!</p>
                        <button onClick={() => setShowFolderModal(true)} className="btn btn-outline border-2 border-cyan-500 text-cyan-600 font-black">Buat Folder</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {orphanCount > 0 && (
                            <div className="group flex flex-col items-center">
                                <div 
                                    onClick={() => navigate('/folder/all')}
                                    className="w-full aspect-square bg-cyan-50/80 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-cyan-200 hover:border-cyan-400 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group-hover:-translate-y-2"
                                >
                                    <div className="absolute top-0 left-0 w-1/2 h-4 bg-cyan-200 rounded-br-xl"></div>
                                    <Folder size={64} strokeWidth={1.5} className="text-cyan-400 mb-2" />
                                    <div className="absolute bottom-3 right-3 bg-cyan-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {orphanCount}
                                    </div>
                                </div>
                                <span className="mt-3 text-sm font-black text-gray-700 truncate w-full text-center">Uncategorized</span>
                            </div>
                        )}
                        {folders.map(folder => (
                            <div key={folder._id} className="group flex flex-col items-center">
                                <div 
                                    onClick={() => handleFolderClick(folder)}
                                    className={`w-full aspect-square rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group-hover:-translate-y-2 ${folder.isSecret ? 'bg-purple-50 border-purple-100 hover:border-purple-300' : 'bg-pink-100 border-pink-50 hover:border-pink-300'}`}
                                >
                                    <div className={`absolute top-0 left-0 w-1/2 h-4 rounded-br-xl ${folder.isSecret ? 'bg-purple-200' : 'bg-pink-200'}`}></div>
                                    <Folder size={64} strokeWidth={1.5} className={folder.isSecret ? 'text-purple-400 mb-2' : 'text-pink-400 mb-2'} />
                                    {folder.isSecret && <Lock size={16} className="absolute bottom-3 right-3 text-purple-400" />}
                                    
                                    <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-all z-20">
                                        <button 
                                            onClick={(e) => startEditFolder(e, folder)}
                                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:text-cyan-500 shadow-sm"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDeleteFolder(e, folder._id)}
                                            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:text-red-500 shadow-md transition-all active:scale-90"
                                            title="Hapus Koleksi"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <span className="mt-3 text-sm font-black text-gray-700 truncate w-full text-center">{folder.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Folder Creation Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => { setShowFolderModal(false); setEditingFolder(null); setNewFolderName(''); setIsSecret(false); setFolderPin(''); }}
                    ></div>
                    <form onSubmit={handleCreateOrUpdateFolder} className="relative z-10 bg-white border-4 border-pink-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="font-black text-2xl mb-6 flex items-center gap-2 text-pink-600">
                            {editingFolder ? <Edit size={24} className="text-pink-500" /> : <Folder size={24} className="text-pink-500" />}
                            {editingFolder ? 'Edit Koleksi' : 'Buat Koleksi Baru'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-pink-600 mb-2">Nama Folder</label>
                                <input 
                                    type="text" required value={newFolderName}
                                    onChange={e => setNewFolderName(e.target.value)}
                                    placeholder="Kenangan 2024..." 
                                    className="w-full px-4 py-3 bg-white text-gray-800 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none placeholder:text-pink-300 font-semibold text-lg" 
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => { setIsSecret(prev => !prev); if (isSecret) setFolderPin(''); }}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold cursor-pointer ${isSecret ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Lock size={20} />
                                    <span>Kunci Folder? (Secret)</span>
                                </div>
                                <div className={`w-12 h-6 rounded-full transition-all relative ${isSecret ? 'bg-purple-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${isSecret ? 'left-7' : 'left-1'}`}></div>
                                </div>
                            </button>
                            {isSecret && (
                                <div>
                                    <label className="block font-bold text-purple-600 mb-2">PIN Keamanan (6 Angka)</label>
                                    <input 
                                        type="text" required maxLength="6" value={folderPin}
                                        onChange={e => setFolderPin(e.target.value.replace(/\D/g, ''))}
                                        placeholder="123456" 
                                        className="w-full px-4 py-3 bg-white text-gray-800 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none text-center tracking-[0.5em] text-2xl font-black placeholder:text-purple-200" 
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 mt-8 justify-end">
                            <button 
                                type="button" 
                                onClick={() => { setShowFolderModal(false); setEditingFolder(null); setNewFolderName(''); setIsSecret(false); setFolderPin(''); }} 
                                className="px-6 py-3 font-black text-gray-500 hover:text-gray-700 rounded-2xl hover:bg-gray-100 transition-all"
                            >Batal</button>
                            <button type="submit" className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95">
                                {editingFolder ? 'Simpan' : 'Buat'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* PIN Verification Modal */}
            {verifyingFolder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setVerifyingFolder(null)}></div>
                    <div className="relative z-10 bg-white border-4 border-purple-300 rounded-3xl p-8 text-center w-full max-w-sm shadow-2xl">
                        <ShieldCheck size={48} className="text-purple-500 mx-auto mb-4 animate-bounce" />
                        <h3 className="font-black text-2xl mb-2 text-gray-800">Folder Ini Terkunci 🔒</h3>
                        <p className="text-gray-600 font-semibold mb-6">Masukkan 6 digit PIN untuk membuka</p>
                        <input 
                            type="password" autoFocus maxLength="6"
                            value={pinInput}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setPinInput(val);
                                if (val.length === 6) {
                                    const token = localStorage.getItem('token');
                                    axios.post(
                                        `http://localhost:5000/api/folder/verify-pin/${verifyingFolder._id}`,
                                        { pin: val },
                                        { headers: { Authorization: token } }
                                    ).then(res => {
                                        if (res.data.ok) {
                                            navigate(`/folder/${verifyingFolder._id}`);
                                            setVerifyingFolder(null);
                                        }
                                    }).catch(() => {
                                        setPinError(true);
                                        setPinInput('');
                                    });
                                }
                            }}
                            placeholder="• • • • • •"
                            className={`w-full px-4 py-4 bg-white text-gray-900 text-center text-3xl font-black tracking-[0.5em] mb-4 border-4 rounded-2xl focus:outline-none placeholder:text-purple-200 ${pinError ? 'border-red-400' : 'border-purple-300 focus:border-purple-500'}`}
                        />
                        {pinError && <p className="text-red-500 font-bold text-sm mb-2">PIN salah! Coba lagi ya. 🥺</p>}
                        <button 
                            onClick={() => setVerifyingFolder(null)} 
                            className="mt-4 px-8 py-2 font-black text-gray-600 hover:text-gray-800 rounded-2xl hover:bg-gray-100 transition-all"
                        >Batal</button>
                    </div>
                </div>
            )}

            {/* Profile Adjustment Modal (Kept from before) */}
            {profilePreview && (
                <div className="modal modal-open">
                    <div className="modal-box bg-white border-4 border-cyan-200 rounded-3xl p-8 text-center">
                        <h3 className="font-black text-2xl text-gray-800 mb-4">Sesuaiin Foto Profil ✨</h3>
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-48 h-48 rounded-full border-4 border-pink-300 overflow-hidden relative cursor-move"
                                onMouseDown={e => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); }}
                                onMouseMove={e => isDragging && setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })}
                                onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}>
                                <img id="preview-img" src={profilePreview.url} alt="P" className="w-full h-full object-cover pointer-events-none"
                                    style={{ transform: `scale(${zoom}) translate(${position.x/zoom}px, ${position.y/zoom}px)` }} />
                            </div>
                            <input type="range" min="1" max="5" step="0.1" value={zoom} onChange={e => setZoom(e.target.value)} className="range range-primary" />
                            <div className="flex gap-4 w-full">
                                <button onClick={() => setProfilePreview(null)} className="btn btn-ghost flex-1">Batal</button>
                                <button onClick={cropAndUpload} className="btn bg-cyan-400 text-white flex-1">Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <GameCenter isOpen={showGameCenter} onClose={() => setShowGameCenter(false)} />
        </div>
    );
}
