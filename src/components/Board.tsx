import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Star, Heart } from 'lucide-react';
import { Avatar } from './Avatar';

export const Board = () => {
  const { players, turnIndex, rollDice, history, questions } = useGameStore();

  const getPlayerScore = (playerIndex: number) => {
    return history.reduce((sum, record) => {
      const score = playerIndex === 0 ? record.player1Score : record.player2Score;
      return sum + (Number(score) || 0);
    }, 0);
  };

  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.discussed).length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      
      <div className="flex justify-between w-full mb-8 bg-white/40 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 z-10 relative">
        {players.map((p, i) => (
          <div key={p?.id || i} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${turnIndex === i ? 'bg-white/60 shadow-md scale-105 border border-primary/20' : 'opacity-70'}`}>
            <Avatar avatarData={p.avatar} className="w-16 h-16 text-4xl border-2 border-white/60 bg-white/50" />
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
              <p className="text-sm font-black text-primary">Score: {getPlayerScore(i)} ⭐</p>
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={rollDice}
        className="mb-12 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-full shadow-2xl shadow-primary/40 text-xl flex items-center gap-3 z-10 relative"
      >
        <Star fill="currentColor" size={24} /> Lanjut Deep Talk!
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/40 backdrop-blur-md p-8 pt-10 rounded-[2rem] shadow-xl border border-white/60 flex flex-col items-center text-center z-0 relative"
      >
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Heart className="text-primary w-10 h-10" fill="currentColor" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-800 mb-2">Progress Perjalanan Kalian</h2>
        <p className="text-gray-600 font-medium mb-12">
          Kalian sudah membahas <span className="font-bold text-primary text-lg">{answeredQuestions}</span> dari <span className="font-bold text-gray-800 text-lg">{totalQuestions}</span> pertanyaan.
        </p>

        <div className="w-full relative px-6 mb-4">
          
          {/* 1. LAYER AVATAR (COUPLE TOKEN MELAYANG DI ATAS) - z-20 */}
          <div className="absolute -top-12 left-6 right-6 h-0 z-20">
            <motion.div
              initial={false}
              animate={{ left: `${progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              // -translate-x-1/2 memastikan grup avatar ini selalu berada pas di tengah garis progress
              className="absolute h-12 flex items-center justify-center -translate-x-1/2" 
            >
              {/* Container untuk membuat avatar tumpang tindih (Overlap) */}
              <div className="flex items-center">
                {players.map((p, index) => (
                  <div 
                    key={p.id} 
                    className={`relative ${index > 0 ? '-ml-4' : ''}`} // Margin negatif agar saling menempel/tumpang tindih
                    style={{ zIndex: players.length - index }}
                  >
                    <Avatar 
                      avatarData={p.avatar} 
                      // Ditambahkan bg-white agar jika pakai emoji/png transparan, tidak terlihat bertumpuk berantakan
                      className="w-12 h-12 text-3xl border-4 border-white drop-shadow-lg bg-white" 
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 2. LAYER PATH / PROGRESS BAR (DI BAWAH) - z-10 */}
          <div className="w-full h-5 bg-white/60 rounded-full shadow-inner border border-white/80 overflow-hidden relative flex items-center z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary relative flex items-center justify-end pr-3"
            >
              {progressPercentage > 0 && (
                <Star className="text-white w-4 h-4 opacity-80" fill="currentColor" />
              )}
            </motion.div>
          </div>
        </div>
        
        <div className="mt-6 text-sm font-black text-gray-400 uppercase tracking-widest">
          {progressPercentage}% Completed
        </div>
      </motion.div>
      
    </div>
  );
};