// VERSION 2.0 - REFRESHED
import React, { useState, useEffect, useRef } from 'react';
import { X, Gamepad2, Heart, Wind, Music, Shirt, Droplets, Sparkles, Check, ChevronRight, Play, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameCenter({ isOpen, onClose }) {
    const [activeGame, setActiveGame] = useState(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border-4 border-pink-200 relative animate-float max-h-[95vh] flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors z-20"
                >
                    <X size={24} />
                </button>

                {!activeGame ? (
                    <div className="p-8 text-center overflow-y-auto custom-scrollbar">
                        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                            <Gamepad2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Game Center</h2>
                        <p className="text-gray-500 font-bold mb-8">Pilih aktivitas buat naikin mood kamu! ✨</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <GameButton 
                                title="Cute Drop Merge" 
                                desc="Gabungin item lucu! 🍓"
                                icon={<Heart className="text-pink-500" />}
                                onClick={() => setActiveGame('merge')}
                                color="bg-pink-50 hover:bg-pink-100 border-pink-200"
                                fullWidth
                            />
                            
                            <GameButton 
                                title="Breathing Room" 
                                desc="Tarik napas sejenak 💨"
                                icon={<Wind className="text-cyan-500" />}
                                onClick={() => setActiveGame('breath')}
                                color="bg-cyan-50 hover:bg-cyan-100 border-cyan-200"
                            />
                            <GameButton 
                                title="Beat Tap Mini" 
                                desc="Ikuti irama musik! 🎵"
                                icon={<Music className="text-purple-500" />}
                                onClick={() => setActiveGame('beat')}
                                color="bg-purple-50 hover:bg-purple-100 border-purple-200"
                            />
                            <GameButton 
                                title="Dear Day" 
                                desc="Temani harimu hari ini 🌸"
                                icon={<Heart className="text-pink-500" />}
                                onClick={() => setActiveGame('dearDay')}
                                color="bg-pink-50 hover:bg-pink-100 border-pink-200"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col relative overflow-hidden min-h-[600px] h-[80vh]">
                        {activeGame !== 'beat' && (
                            <button 
                                onClick={() => setActiveGame(null)}
                                className="absolute top-4 left-4 text-sm font-bold text-gray-500 hover:text-pink-500 z-50 flex items-center gap-1 bg-white/50 backdrop-blur px-3 py-1 rounded-full shadow-md"
                            >
                                ← Kembali
                            </button>
                        )}
                        
                        {activeGame === 'merge' && <CuteDropMerge />}
                        {activeGame === 'breath' && <BreathingGame />}
                        {activeGame === 'beat' && <BeatTap onBack={() => setActiveGame(null)} />}
                        {activeGame === 'dearDay' && <DearDay onBack={() => setActiveGame(null)} />}
                    </div>
                )}
            </div>
        </div>
    );
}

function GameButton({ title, desc, icon, onClick, color, fullWidth }) {
    return (
        <button 
            onClick={onClick}
            className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all transform hover:scale-102 ${color} ${fullWidth ? 'md:col-span-2' : ''}`}
        >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                {icon}
            </div>
            <div className="text-left">
                <h3 className="font-black text-gray-800">{title}</h3>
                <p className="text-xs font-bold text-gray-500">{desc}</p>
            </div>
        </button>
    );
}

function CuteDropMerge() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [nextItem, setNextItem] = useState(0);
    const LEVELS = [{ icon: '💗', size: 15, color: '#ffecf5' }, { icon: '💕', size: 22, color: '#fcc2d7' }, { icon: '🌸', size: 30, color: '#ffb3c6' }, { icon: '🍓', size: 40, color: '#ff8fab' }, { icon: '🍰', size: 55, color: '#fb6f92' }];
    const engine = useRef({ items: [], mouseX: 150, running: true });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        const loop = () => {
            if (!engine.current.running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath(); ctx.setLineDash([5, 5]); ctx.moveTo(engine.current.mouseX, 0); ctx.lineTo(engine.current.mouseX, canvas.height); ctx.strokeStyle = '#fad2e1'; ctx.stroke(); ctx.setLineDash([]);
             const items = engine.current.items;
             for (let i = 0; i < items.length; i++) {
                const item = items[i];
                item.vy += 0.5; item.y += item.vy; item.x += item.vx; item.vx *= 0.98;
                if (item.y + item.size > canvas.height) { item.y = canvas.height - item.size; item.vy *= -0.3; item.vx *= 0.5; }
                if (item.x - item.size < 0) { item.x = item.size; item.vx *= -0.5; }
                if (item.x + item.size > canvas.width) { item.x = canvas.width - item.size; item.vx *= -0.5; }
                for (let j = i + 1; j < items.length; j++) {
                    const other = items[j];
                    const dx = other.x - item.x; const dy = other.y - item.y; const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < item.size + other.size) {
                         const angle = Math.atan2(dy, dx); const push = (item.size + other.size - dist) / 2;
                         item.x -= Math.cos(angle) * push; item.y -= Math.sin(angle) * push;
                         other.x += Math.cos(angle) * push; other.y += Math.sin(angle) * push;
                         const dvx = other.vx - item.vx; const dvy = other.vy - item.vy;
                         item.vx += dvx * 0.1; item.vy += dvy * 0.1; other.vx -= dvx * 0.1; other.vy -= dvy * 0.1;
                         if (item.level === other.level && item.level < LEVELS.length - 1) {
                             item.dead = true; other.dead = true;
                             engine.current.items.push({ x: (item.x+other.x)/2, y: (item.y+other.y)/2, vx:0, vy:0, level: item.level+1, size: LEVELS[item.level+1].size, id: Date.now()+Math.random() });
                             setScore(s => s + (item.level+1)*10);
                         }
                    }
                }
             }
             engine.current.items = items.filter(i => !i.dead);
             engine.current.items.forEach(item => {
                 const info = LEVELS[item.level];
                 ctx.beginPath(); ctx.arc(item.x, item.y, item.size, 0, Math.PI*2); ctx.fillStyle = info.color; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth=2; ctx.stroke();
                 ctx.font = `${item.size}px Arial`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(info.icon, item.x, item.y);
             });
             ctx.font = '24px Arial'; ctx.fillText(LEVELS[nextItem].icon, engine.current.mouseX, 30);
             animationId = requestAnimationFrame(loop);
        };
        animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [nextItem]);

    return (
        <div className="flex-1 flex flex-col items-center bg-pink-50/30 p-4 pt-12">
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-pink-100 font-black text-pink-500">Score: {score}</div>
            <div className="relative bg-white rounded-3xl border-b-4 border-pink-200 overflow-hidden shadow-inner cursor-pointer w-full max-w-sm aspect-[3/4]"
                 onMouseMove={e => { if(canvasRef.current){ const r = canvasRef.current.getBoundingClientRect(); engine.current.mouseX = e.clientX - r.left; } }}
                 onClick={() => { engine.current.items.push({ x: engine.current.mouseX, y: 50, vx:0, vy:0, level: nextItem, size: LEVELS[nextItem].size, id: Date.now() }); setNextItem(Math.floor(Math.random()*2)); }}>
                <canvas ref={canvasRef} width={384} height={512} className="w-full h-full" />
            </div>
        </div>
    );
}

function BreathingGame() {
    const [phase, setPhase] = useState("Siapppp?"); 
    const [scale, setScale] = useState(1);
    useEffect(() => {
        let mounted = true;
        const cycle = async () => {
            if (!mounted) return;
            setPhase("Tarik Napas... (Inhale)"); setScale(1.5); await new Promise(r => setTimeout(r, 4000));
            if (!mounted) return;
            setPhase("Tahan... (Hold)"); await new Promise(r => setTimeout(r, 2000));
            if (!mounted) return;
            setPhase("Hembuskan... (Exhale)"); setScale(1); await new Promise(r => setTimeout(r, 4000));
            if (mounted) cycle();
        };
        setTimeout(cycle, 1000); return () => { mounted = false; };
    }, []);
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-cyan-50 overflow-hidden">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-200 shadow-[0_0_60px_rgba(165,243,252,0.6)] flex items-center justify-center transition-all duration-[4000ms] ease-in-out" style={{ transform: `scale(${scale})` }}>
                <div className="text-6xl animate-pulse">😌</div>
            </div>
            <h3 className="text-2xl font-black text-cyan-600 mt-12 transition-all duration-500">{phase}</h3>
            <p className="text-gray-400 font-bold mt-2">Tenangkan pikiranmu...</p>
        </div>
    );
}

function BeatTap({ onBack }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('beatTapHigh') || '0'));
    const [missed, setMissed] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("Tap 'Beat' pas di garis!");
    const [dots, setDots] = useState([]);
    
    const frameRef = useRef();
    const spawnRef = useRef(0);
    const audioCtxRef = useRef(null);
    const MAX_MISSES = 10;
    const processedGameOver = useRef(false);

    const playBeep = (freq = 500, type = 'sine') => {
        try {
            if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {}
    };

    const startGame = () => {
        processedGameOver.current = false;
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setMissed(0);
        setDots([]);
        setMessage("Lessgo lessgoo! 🎵");
        
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    };

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const loop = (time) => {
            if (time - spawnRef.current > 600) {
                setDots(prev => [...prev, { y: -100, id: Math.random() }]);
                spawnRef.current = time;
            }

            setDots(prev => {
                const nextDots = [];
                let newMisses = 0;
                
                prev.forEach(d => {
                    const nextY = d.y + 7; 
                    if (nextY > 500) { 
                        newMisses++;
                    } else {
                        nextDots.push({ ...d, y: nextY });
                    }
                });

                if (newMisses > 0) {
                    setMissed(m => {
                        const nextM = m + newMisses;
                        if (nextM >= MAX_MISSES) {
                            setGameOver(true);
                            setIsPlaying(false);
                        }
                        return nextM;
                    });
                    setMessage("Missed!");
                }
                
                return nextDots;
            });
            
            if (!gameOver) frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameRef.current);
    }, [isPlaying, gameOver]);

    useEffect(() => {
        if (gameOver && !processedGameOver.current) {
            processedGameOver.current = true;
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('beatTapHigh', score.toString());
                setMessage("New High Score!");
            } else {
                setMessage("Game Over!");
            }
        }
    }, [gameOver, score, highScore]);

    const handleTap = () => {
        if (gameOver) return;
        playBeep(600);
        
        const hit = dots.find(d => d.y > 360 && d.y < 440);
        
        if (hit) {
            setScore(s => s + 10);
            setMessage("keren sempurna 🔥");
            setDots(prev => prev.filter(d => d.id !== hit.id));
            playBeep(880, 'square'); 
        }
    };

    return (
        <div className="flex-1 flex flex-col relative bg-purple-900 overflow-hidden text-white items-center h-full">
            <div className="flex w-full justify-between px-8 pt-6 z-20 bg-purple-900/50 backdrop-blur-sm pb-4 items-center">
                <button 
                    onClick={onBack}
                    className="mr-6 text-lg font-bold text-white hover:text-purple-300 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full transition-all hover:bg-white/30"
                >
                    ← Back
                </button>
                <div className="flex flex-col text-left">
                    <span className="text-sm text-purple-300 font-bold tracking-widest">SCORE</span>
                    <span className="text-5xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.3)]">{score}</span>
                </div>
                <div className="flex flex-col text-center mx-4">
                    <span className="text-sm text-purple-300 font-bold tracking-widest">MISSED</span>
                    <span className={`text-4xl font-black ${missed > 7 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{missed} / {MAX_MISSES}</span>
                </div>
                <div className="flex flex-col text-right">
                     <span className="text-sm text-yellow-300 font-bold tracking-widest">BEST</span>
                     <span className="text-3xl font-black text-yellow-300">{highScore}</span>
                </div>
            </div>

            <div className="absolute top-24 w-full text-center z-10 pointer-events-none">
                 <p className="font-bold text-3xl text-purple-200 animate-bounce">{message}</p>
            </div>

            <div className="absolute top-[400px] w-full h-2 bg-purple-400 shadow-[0_0_30px_#d8b4fe]"></div>
            <div className="absolute top-[350px] w-36 h-36 border-8 border-purple-400 rounded-full flex items-center justify-center opacity-50 animate-pulse"></div>

            {dots.map(dot => (
                <div key={dot.id} 
                    className="absolute bg-white rounded-full w-24 h-24 shadow-[0_0_25px_white] ring-8 ring-purple-100"
                    style={{ top: dot.y, left: '50%', transform: 'translateX(-50%)' }}
                ></div>
            ))}

            {gameOver && (
                <div className="absolute inset-0 bg-black/85 z-30 flex flex-col items-center justify-center animate-in zoom-in backdrop-blur-sm">
                    <h3 className="text-7xl font-black text-red-500 mb-4 drop-shadow-lg">GAME OVER</h3>
                    <p className="text-gray-300 font-bold text-3xl mb-12">Skor Akhir: {score}</p>
                     <button onClick={startGame} className="btn btn-lg bg-purple-500 hover:bg-purple-600 text-white border-none rounded-full px-12 py-4 text-2xl font-black shadow-xl hover:scale-105 transition-transform">
                        Coba Lagi 🔄
                    </button>
                    <button onClick={onBack} className="mt-8 text-purple-400 font-bold hover:text-white">
                        Keluar
                    </button>
                </div>
            )}

            <div className="mt-auto mb-10 w-full px-12 z-20 pb-4 flex justify-center">
                {!isPlaying && !gameOver ? (
                    <button onClick={startGame} className="w-64 btn btn-lg bg-purple-500 hover:bg-purple-400 text-white border-none font-black text-xl rounded-full shadow-xl ring-4 ring-purple-500/30 hover:scale-105 transition-transform">
                        <Play fill="currentColor" size={24} /> Mulai Beat
                    </button>
                ) : (
                    <button 
                         onPointerDown={(e) => { e.preventDefault(); handleTap(); }}
                         className="w-64 h-24 btn bg-purple-500 hover:bg-purple-400 text-white border-none font-black text-3xl rounded-full shadow-[0_8px_0_#6b21a8] active:shadow-none active:translate-y-2 transition-all ring-4 ring-white/20"
                         disabled={gameOver}
                    >
                        TAP! 💥
                    </button>
                )}
            </div>
        </div>
    );
}

function DearDay({ onBack }) {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({ char: null, outfit: null, bg: null, expression: null });
    const [isSaved, setIsSaved] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [dialog, setDialog] = useState('');

    const CHARACTERS = {
        aisha: { 
            name: 'Aiko', color: 'text-pink-500', bg: 'bg-pink-100', icon: '👧🏻',
            outfits: [
                { id: 'casual', name: 'Casual', icon: '🎀' },
                { id: 'summer', name: 'Seragam', icon: '🏫' },
                { id: 'formal', name: 'Formal', icon: '👗' },
                { id: 'gym', name: 'Olahraga', icon: '👟' },
                { id: 'winter', name: 'Dingin', icon: '🧣' }
            ],
            assets: {
                casual: { base: '/assets/aiko/Casual/Aiko_Smile.png', happy: '/assets/aiko/Casual/Aiko_Smile.png', sad: '/assets/aiko/Casual/Aiko_frown.png', tired: '/assets/aiko/Casual/Aiko_Frown_Blush.png', calm: '/assets/aiko/Casual/Aiko_Smile.png' },
                summer: { base: '/assets/aiko/SummerUniform/Aiko_SummerUni_Smile.png', happy: '/assets/aiko/SummerUniform/Aiko_SummerUni_Smile.png', sad: '/assets/aiko/SummerUniform/Aiko_SummerUni_Frown.png', tired: '/assets/aiko/SummerUniform/Aiko_SummerUni_Frown_Blush.png', calm: '/assets/aiko/SummerUniform/Aiko_SummerUni_Smile.png' },
                formal: { base: '/assets/aiko/Formal/Aiko_formal_smile.png', happy: '/assets/aiko/Formal/Aiko_formal_smile.png', sad: '/assets/aiko/Formal/Aiko_formal_frown.png', tired: '/assets/aiko/Formal/Aiko_formal_frown_blush.png', calm: '/assets/aiko/Formal/Aiko_formal_smile.png' },
                gym: { base: '/assets/aiko/Gym/Aiko_Gym_Smile.png', happy: '/assets/aiko/Gym/Aiko_Gym_Smile.png', sad: '/assets/aiko/Gym/Aiko_Gym_Frown.png', tired: '/assets/aiko/Gym/Aiko_Gym_Frown_Blush.png', calm: '/assets/aiko/Gym/Aiko_Gym_Smile.png' },
                winter: { base: '/assets/aiko/WinterUniform/Aiko_WinterUni_Smile.png', happy: '/assets/aiko/WinterUniform/Aiko_WinterUni_Smile.png', sad: '/assets/aiko/WinterUniform/Aiko_WinterUni_Frown.png', tired: '/assets/aiko/WinterUniform/Aiko_WinterUni_Frown_Blush.png', calm: '/assets/aiko/WinterUniform/Aiko_WinterUni_Smile.png' }
            }
        },
        lily: {
            name: 'Lily', color: 'text-purple-500', bg: 'bg-purple-100', icon: '👱🏻‍♀️',
            outfits: [
                { id: 'casual', name: 'Casual', icon: '👗' },
                { id: 'summer', name: 'Seragam', icon: '🎒' },
                { id: 'winter', name: 'Dingin', icon: '🧣' }
            ],
            assets: {
                casual: { base: '/assets/lily/base/Casual_Open.png', happy: '/assets/lily/base/Casual_Closed_Smile_Blush.png', sad: '/assets/lily/base/Casual_Frown.png', tired: '/assets/lily/base/Casual_Frown_Blush.png', calm: '/assets/lily/base/Casual_Open.png' },
                summer: { base: '/assets/lily/Summer Uniform/SummerUni_Open.png', happy: '/assets/lily/Summer Uniform/SummerUni_Smile_Blush.png', sad: '/assets/lily/Summer Uniform/SummerUni_Frown.png', tired: '/assets/lily/Summer Uniform/SummerUni_Frown_Blush.png', calm: '/assets/lily/Summer Uniform/SummerUni_Open.png' },
                winter: { base: '/assets/lily/Winter Uniform/WinterUni_Open.png', happy: '/assets/lily/Winter Uniform/WinterUni_Smile_Blush.png', sad: '/assets/lily/Winter Uniform/WinterUni_Frown.png', tired: '/assets/lily/Winter Uniform/WinterUni_Frown_Blush.png', calm: '/assets/lily/Winter Uniform/WinterUni_Open.png' }
            }
        }
    };

    const BACKGROUNDS = {
        room:  { name: 'Di Kamar', img: '/assets/background/Backstreet_Spring_Cloudy.png', style: 'text-gray-800' },
        park:  { name: 'Di Taman', img: '/assets/background/Temple_Summer_Day.png',        style: 'text-gray-800' },
        rain:  { name: 'Hujan',    img: '/assets/background/Backstreet_Summer_Rain.png',   style: 'text-white' },
        night: { name: 'Malam',    img: '/assets/background/Backstreet_Spring_Night.png',  style: 'text-white' }
    };

    const EXPRESSIONS = {
        happy: { label: 'Senyum',  icon: '😊', color: 'bg-yellow-100 text-amber-600 hover:bg-yellow-200' },
        sad:   { label: 'Sedih',   icon: '😢', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
        tired: { label: 'Tersipu', icon: '😳', color: 'bg-pink-100 text-pink-600 hover:bg-pink-200' },
        calm:  { label: 'Biasa',   icon: '😌', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' }
    };

    const DIALOGS = {
        aisha: {
            happy: ['Baju ini pas banget! Hari yang cerah ☀️', 'Wah, aku suka banget style ini! 💖', 'Makasih udah pilihin baju ini!'],
            sad:   ['Hmm... boleh juga sih.', 'Bajunya nyaman kok, makasih ya.', 'Aku pakai yang mana aja gapapa... 🫂'],
            tired: ['Bajunya nyaman... jadi pengen rebahan 🛌', 'Makasih ya, lumayan anget bajunya.', 'Cocok buat santai hari ini... 💤'],
            calm:  ['Pilihan yang bagus, kelihatan rapi 🍃', 'Terima kasih, pas banget suasananya.', 'Style ini bikin aku tenang... ✨']
        },
        lily: {
            happy: ['Yey! Bajunya manis banget! 🌸', 'Makasih ya, aku suka style ini!', 'Gimana? Cocok kan sama aku? ✨'],
            sad:   ['Makasih udah pilihin... 🤗', 'Walau lagi murung, bajunya tetep bagus.', 'Suka kok bajunya... makasih ya.'],
            tired: ['Nyaman banget dipakai... ☁️', 'Tinggal cari tempat duduk nih...', 'Makasih ya sayang, bajunya pas.'],
            calm:  ['Elegan dan pas banget... 💭', 'Terima kasih pilihannya.', 'Suasananya jadi makin kerasa... ✨']
        }
    };

    const handleSelect = (key, value) => {
        setSelection(prev => ({ ...prev, [key]: value }));
        if (key === 'char') setStep(2);
        if (key === 'bg') setStep(4);
        if (key === 'expression') {
            const arr = DIALOGS[selection.char][value];
            setDialog(arr[Math.floor(Math.random() * arr.length)]);
            setStep(5);
        }
    };

    const currentBg = (step >= 4 && selection.bg) ? BACKGROUNDS[selection.bg].img : null;
    const currentTextStyle = currentBg ? BACKGROUNDS[selection.bg].style : 'text-gray-800';

    const getCharacterAsset = () => {
        if (!selection.char) return null;
        const charData = CHARACTERS[selection.char];
        const outfitData = charData.assets[selection.outfit || 'casual'];
        if (step < 5 || !selection.expression) return outfitData.base;
        return outfitData[selection.expression] || outfitData.base;
    };

    return (
        <div className="flex-1 flex flex-col relative overflow-y-auto transition-all duration-700 bg-pink-50 h-full">
            {currentBg && (
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${currentBg})` }}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                </div>
            )}

            <div className={`flex justify-between items-center z-10 p-6 relative ${currentTextStyle}`}>
                <button onClick={onBack} className="font-bold flex items-center gap-2 hover:opacity-70 transition-opacity bg-white/40 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-gray-800">
                    <ChevronRight className="rotate-180" /> Kembali
                </button>
                <div className="text-sm font-bold bg-white/40 backdrop-blur-md px-4 py-1 rounded-full shadow-sm text-gray-800">Dress Up 🌸</div>
            </div>

            <div className="flex-1 flex flex-col items-center w-full relative z-10 px-6 pb-6">

                {step === 1 && (
                    <div className="animate-in fade-in zoom-in duration-500 w-full text-center max-w-4xl mx-auto mt-10">
                        <h2 className="text-3xl font-black mb-8 text-gray-800">Siapa yang mau didandanin?</h2>
                        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                            {Object.entries(CHARACTERS).map(([key, char]) => (
                                <button key={key} onClick={() => handleSelect('char', key)} className="group overflow-hidden rounded-[2rem] bg-white border-4 border-transparent hover:border-pink-300 shadow-xl transition-all hover:-translate-y-2 p-4 flex flex-col items-center">
                                    <div className="h-48 w-full overflow-hidden rounded-2xl mb-4 bg-pink-50">
                                        <img src={char.assets.casual.base} alt={char.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <h3 className={`text-2xl font-black ${char.color}`}>{char.name}</h3>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center max-w-5xl mx-auto">
                        <h2 className="text-3xl font-black mb-4 text-gray-800">Pilih Baju (Drag & Drop)</h2>
                        <div className="flex w-full gap-6 mb-6" style={{ height: '420px' }}>
                            <div className="w-44 bg-white/70 backdrop-blur rounded-3xl p-3 border-2 border-pink-200 flex flex-col gap-2 shadow-lg overflow-hidden">
                                <h3 className="font-black text-pink-500 text-center bg-white rounded-full py-1 shadow-sm text-sm shrink-0">Lemari Baju</h3>
                                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
                                    {CHARACTERS[selection.char].outfits.map(outfit => (
                                        <div key={outfit.id} draggable onDragStart={e => e.dataTransfer.setData('outfit', outfit.id)}
                                            className="p-2 bg-white rounded-xl shadow-sm cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-pink-300 transition-all flex flex-col items-center gap-1 group shrink-0">
                                            <div className="text-3xl group-hover:scale-110 transition-transform">{outfit.icon}</div>
                                            <span className="font-bold text-gray-700 text-xs text-center">{outfit.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`flex-1 relative rounded-3xl border-4 border-dashed transition-all flex items-end justify-center overflow-hidden ${isDraggingOver ? 'border-pink-500 bg-pink-100/60 scale-[1.02]' : 'border-pink-300 bg-white/50'}`}
                                onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
                                onDragLeave={() => setIsDraggingOver(false)}
                                onDrop={e => { e.preventDefault(); setIsDraggingOver(false); const id = e.dataTransfer.getData('outfit'); if (id) handleSelect('outfit', id); }}>
                                <img src={getCharacterAsset()} alt="Character" className="h-full max-h-[400px] w-auto object-contain drop-shadow-2xl pointer-events-none transition-all duration-500 origin-bottom" />
                                {!selection.outfit && (
                                    <div className="absolute top-6 animate-bounce">
                                        <p className="bg-white/90 backdrop-blur px-5 py-2 rounded-full font-black text-pink-500 shadow-xl border-2 border-pink-200 text-sm">✨ Tarik baju ke sini! ✨</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setStep(3)} disabled={!selection.outfit}
                            className={`btn btn-lg rounded-full px-16 font-black border-none text-white shadow-xl transition-all ${selection.outfit ? 'bg-pink-500 hover:bg-pink-600 hover:scale-105' : 'bg-gray-300 opacity-50 cursor-not-allowed'}`}>
                            Selanjutnya →
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in zoom-in duration-500 w-full text-center max-w-4xl mx-auto mt-10">
                        <h2 className="text-3xl font-black mb-8 text-gray-800">Pilih Latar Tempat</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(BACKGROUNDS).map(([key, bg]) => (
                                <button key={key} onClick={() => handleSelect('bg', key)} className="group relative h-48 rounded-2xl overflow-hidden border-4 border-transparent hover:border-pink-300 shadow-xl transition-all hover:-translate-y-2">
                                    <img src={bg.img} alt={bg.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4">
                                        <span className="font-black text-xl text-white drop-shadow-lg">{bg.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in zoom-in duration-500 w-full text-center flex flex-col items-center max-w-4xl mx-auto mt-10">
                        <div className="h-48 w-48 rounded-full border-8 border-white shadow-2xl overflow-hidden mb-6 bg-pink-50">
                            <img src={getCharacterAsset()} alt="Character" className="w-full h-full object-cover object-top" />
                        </div>
                        <h2 className={`text-3xl font-black mb-8 ${currentTextStyle} drop-shadow-md`}>Pilih Ekspresi {CHARACTERS[selection.char].name}</h2>
                        <div className="flex justify-center gap-4 flex-wrap max-w-2xl">
                            {Object.entries(EXPRESSIONS).map(([key, exp]) => (
                                <button key={key} onClick={() => handleSelect('expression', key)}
                                    className={`${exp.color} px-6 py-4 rounded-2xl font-black text-xl shadow-lg transition-all hover:scale-105 active:scale-95 border-2 border-white/50 flex items-center gap-2`}>
                                    <span className="text-2xl">{exp.icon}</span> {exp.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col items-center w-full relative max-w-4xl mx-auto" style={{ minHeight: '500px' }}>
                        <div className="absolute bottom-0 z-0 flex items-end justify-center pointer-events-none animate-in zoom-in-95 fade-in duration-1000" style={{ height: '85%' }}>
                            <img src={getCharacterAsset()} alt="Final Character" className="h-full max-h-[420px] w-auto object-contain drop-shadow-2xl origin-bottom" />
                        </div>
                        <div className="z-20 w-full flex flex-col items-center gap-4 mt-auto mb-8 pt-8">
                            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-2 border-pink-100 max-w-lg text-center">
                                <p className="text-xl font-black text-gray-700 leading-relaxed">
                                    {isSaved ? "Sudah tersimpan! Sampai jumpa besok! 👋" : `"${dialog}"`}
                                </p>
                            </div>
                            {!isSaved ? (
                                <button onClick={() => { setIsSaved(true); setTimeout(onBack, 2500); }}
                                    className="btn btn-lg bg-pink-500 hover:bg-pink-600 text-white font-black border-none rounded-full px-12 shadow-[0_8px_0_#be185d] active:shadow-none active:translate-y-2 transition-all hover:scale-105">
                                    <Heart fill="currentColor" size={24} /> Simpan Foto!
                                </button>
                            ) : (
                                <div className="bg-white/95 px-8 py-4 rounded-full text-pink-500 font-black text-xl flex items-center gap-3 shadow-2xl border-4 border-pink-200">
                                    <Sparkles /> Disimpan!
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
