import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Download, RotateCcw, HeartHandshake, Image as ImageIcon, DownloadCloud } from 'lucide-react';
import { exportToExcel } from '../utils/reportGenerator';
import { Avatar } from './Avatar';

export const SummaryScreen = () => {
  const { players, history, photos, resetGame } = useGameStore(); // IMPORT resetGame

  const p1Total = history.reduce((sum, record) => sum + (Number(record.player1Score) || 0), 0);
  const p2Total = history.reduce((sum, record) => sum + (Number(record.player2Score) || 0), 0);
  const validHistoryLength = history.length > 0 ? history.length : 1; 
  const p1Average = (p1Total / validHistoryLength).toFixed(1);
  const p2Average = (p2Total / validHistoryLength).toFixed(1);
  const p1AvgNum = parseFloat(p1Average);
  const p2AvgNum = parseFloat(p2Average);

  let winnerText = "Kalian Seimbang! 💖";
  if (p1AvgNum > p2AvgNum) winnerText = `${players[0]?.name || 'Player 1'} Lebih Terbuka! 🎉`;
  if (p2AvgNum > p1AvgNum) winnerText = `${players[1]?.name || 'Player 2'} Lebih Terbuka! 🎉`;

  const handleDownloadSinglePhoto = (photoDataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = photoDataUrl;
    link.download = `CoupleQuest_Memory_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllPhotos = () => {
    photos.forEach((photo, index) => {
      setTimeout(() => {
        handleDownloadSinglePhoto(photo, index);
      }, index * 300); 
    });
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-romantic-gradient p-6 overflow-y-auto py-12">
    // <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg-couple.jpg')] bg-cover bg-center bg-fixed p-6 overflow-y-auto py-12">
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed p-6 overflow-y-auto py-12"
      style={{ backgroundImage: "url('/bg-couple.jpg')" }}
    >
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] w-full max-w-2xl border border-white/50 shadow-2xl text-center mb-8 mt-8">
        
        {p1AvgNum === p2AvgNum ? (
          <HeartHandshake className="w-20 h-20 text-primary mx-auto mb-4" />
        ) : (
          <Trophy className="w-20 h-20 text-accent mx-auto mb-4" />
        )}
        
        <h1 className="text-4xl font-black text-gray-800 mb-2">{winnerText}</h1>
        <p className="text-gray-600 mb-8">Kalian telah mendiskusikan {history.length} pertanyaan secara mendalam.</p>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {players.map((p, index) => {
            const isP1 = index === 0;
            const avgScore = isP1 ? p1Average : p2Average;
            const isWinner = isP1 ? p1AvgNum > p2AvgNum : p2AvgNum > p1AvgNum;
            
            return (
              <div key={p?.id || index} className={`p-6 rounded-3xl transition-all ${isWinner ? 'bg-white/70 border-2 border-accent scale-105 shadow-lg' : 'bg-white/30'}`}>
                <Avatar avatarData={p.avatar} className="w-24 h-24 text-6xl mx-auto mb-3" />
                <h3 className="font-bold text-xl text-gray-800">{p?.name || `Player ${index + 1}`}</h3>
                <p className="text-primary font-black text-5xl my-2">⭐ {avgScore}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Average Score</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {history.length > 0 && (
            <button 
              onClick={() => exportToExcel(history, players)}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Download size={20} /> Download Report (Excel)
            </button>
          )}

          {photos.length > 0 && (
            <button 
              onClick={handleDownloadAllPhotos}
              className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-lg"
            >
              <DownloadCloud size={20} /> Download Semua Foto ({photos.length})
            </button>
          )}

          {/* UPDATE: Gunakan resetGame dari store, bukan window.reload */}
          <button 
            onClick={() => resetGame()}
            className="w-full py-4 bg-white/60 text-gray-800 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/80 transition-colors mt-2"
          >
            <RotateCcw size={20} /> Main Lagi (Reset Data)
          </button>
        </div>
      </motion.div>

      {photos.length > 0 && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="w-full max-w-2xl bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/50 shadow-2xl text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ImageIcon className="text-primary" size={28} />
            <h2 className="text-2xl font-black text-gray-800">Memori Perjalanan Ini</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo, idx) => (
              <div key={idx} className="bg-white p-3 pb-4 rounded-sm shadow-xl border border-gray-200 transform hover:scale-105 transition-transform rotate-1 flex flex-col" style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <div className="aspect-square bg-gray-100 overflow-hidden mb-3 relative group">
                  <img src={photo} alt={`Memory ${idx+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDownloadSinglePhoto(photo, idx)}
                      className="bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transform hover:scale-110 transition-all"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center px-1">
                  <p className="text-xs font-bold text-gray-400 font-handwriting">Jeda ke-{idx + 1}</p>
                  <button 
                    onClick={() => handleDownloadSinglePhoto(photo, idx)}
                    className="md:hidden text-gray-400 hover:text-primary"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};