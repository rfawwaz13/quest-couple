import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { MessageCircle, SkipForward } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from './Avatar';

export const QuestionCard = () => {
  const { activeQuestion, players, answeringPlayerIndex, submitScore, skipQuestion, turnIndex } = useGameStore();
  const [localScoring, setLocalScoring] = useState(false);

  if (!activeQuestion || answeringPlayerIndex === null) return null;

  const currentPlayer = players[answeringPlayerIndex];
  const partnerPlayer = players[answeringPlayerIndex === 0 ? 1 : 0];
  
  const isFirstAnswering = answeringPlayerIndex === turnIndex; 

  const handleSkip = () => {
    setLocalScoring(false);
    skipQuestion();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center relative flex items-center gap-4">
          <Avatar avatarData={currentPlayer.avatar} className="w-16 h-16 text-4xl border-2 border-white/60" />
          <div className="flex-1 text-left">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{activeQuestion.category}</p>
            <h2 className="text-xl font-bold mt-0.5">Giliran {currentPlayer.name} Menjawab</h2>
          </div>
        </div>

        <div className="p-8 text-center">
          <AnimatePresence mode="wait">
            {!localScoring ? (
              <motion.div key="q" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-8">"{activeQuestion.text}"</p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setLocalScoring(true)}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-gray-900/20"
                  >
                    <MessageCircle size={20} /> Saya Sudah Menjawab
                  </button>

                  {isFirstAnswering && (
                    <button 
                      onClick={handleSkip}
                      className="w-full py-3 mt-2 bg-white border-2 border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <SkipForward size={18} /> Simpan Pertanyaan Ini Untuk Nanti
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="s" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <p className="text-lg font-semibold text-gray-600 mb-2">Beri skor untuk {currentPlayer.name}:</p>
                <p className="text-sm text-gray-400 mb-6">( {partnerPlayer.name}, silakan pilih 1-5 berdasarkan kejujuran/kedalaman )</p>
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        submitScore(num);
                        setLocalScoring(false);
                      }}
                      className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xl font-bold hover:bg-accent hover:text-white transition-all shadow-sm"
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};