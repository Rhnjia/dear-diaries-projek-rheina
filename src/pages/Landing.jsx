import { Link } from 'react-router-dom';
import { BookOpen, PenLine, Shield, Sparkles, Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 overflow-x-hidden" data-theme="cupcake">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="text-center max-w-2xl">
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-pink-200 blur-3xl rounded-full opacity-30 animate-pulse-slow"></div>
            <img 
              src="/Dear Diary....png" 
              alt="Dear Diary Logo" 
              className="w-70 h-70 mx-auto drop-shadow-2xl animate-float relative z-10 object-contain"
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent mb-6 leading-normal pb-4">
            Dear Diary
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-600 mb-10">Tempat cerita kecil kamu</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-pink-500 hover:bg-pink-600 border-none text-white px-8">
              <PenLine size={24} strokeWidth={2.5} />
              Mulai Nulis
            </Link>
            <Link to="/login" className="btn btn-lg gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-white hover:bg-gray-50 border-2 border-cyan-400 text-cyan-600 px-8">
              <BookOpen size={24} strokeWidth={2.5} />
              Masuk
            </Link>
          </div>
          <div className="mt-16 animate-bounce text-pink-300">
            <p className="font-black text-sm uppercase tracking-widest mb-2 text-center">Scroll kebawah</p>
            <div className="w-1 h-6 bg-pink-200 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-800 mb-4 italic underline decoration-cyan-400 decoration-8 underline-offset-8">Apa aja yang ada di sini?</h2>
            <p className="text-xl font-bold text-gray-500">Dibuat spesial buat nampung semua perasaan kamu </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-white p-8 shadow-xl border-2 border-pink-100 hover:border-pink-300 transition-all">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-500">
                <Shield size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Privasi Terjaga</h3>
              <p className="text-gray-500 font-bold leading-relaxed">Ceritamu cuma kamu yang tau. Dilengkapin dengan sistem keamanan yang bikin aman.</p>
            </div>

            <div className="card bg-white p-8 shadow-xl border-2 border-cyan-100 hover:border-cyan-300 transition-all">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 text-cyan-500">
                <Heart size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Simpan Kenangan</h3>
              <p className="text-gray-500 font-bold leading-relaxed">Tulis semua kejadian hari ini, besok, dan selamanya tanpa takut kehilangan jejak.</p>
            </div>

            <div className="card bg-white p-8 shadow-xl border-2 border-pink-100 hover:border-pink-300 transition-all">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-500">
                <Sparkles size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Desain Gemes</h3>
              <p className="text-gray-500 font-bold leading-relaxed">Tampilan yang nyaman jadi bikin nulis kerasa seruu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-12 px-6 border-t-2 border-pink-100 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Dear Diary
          </h3>
          <p className="text-gray-400 font-black tracking-widest uppercase text-sm">
            rheina fairuz s1 sistem informasi 2023 all right reserved
          </p>
          <div className="mt-6 flex justify-center gap-2 text-pink-200">
            <Heart size={16} fill="currentColor" />
            <Heart size={16} fill="currentColor" />
            <Heart size={16} fill="currentColor" />
          </div>
        </div>
      </footer>
    </div>
  );
}