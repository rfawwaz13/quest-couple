import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Camera } from 'lucide-react';
import { Avatar } from './Avatar';

const EMOJI_AVATARS = ['🦊', '🐰', '🐯', '🐼', '🐸', '🦄', '🦖', '🐙', '👾', '🧑‍🚀'];

export const SetupScreen = () => {
  const { setPlayers, setStep } = useGameStore();
  
  const [p1Name, setP1Name] = useState('Bubu');
  const [p1Avatar, setP1Avatar] = useState(EMOJI_AVATARS[0]);
  
  const [p2Name, setP2Name] = useState('Dudu');
  const [p2Avatar, setP2Avatar] = useState(EMOJI_AVATARS[1]);

  const fileInputP1 = useRef<HTMLInputElement>(null);
  const fileInputP2 = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setAvatar: (data: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStart = () => {
    setPlayers([
      { id: 1, name: p1Name, position: 0, score: 0, avatar: p1Avatar },
      { id: 2, name: p2Name, position: 0, score: 0, avatar: p2Avatar }
    ]);
    setStep('playing');
  };

  const AvatarOptions = ({ currentAvatar, setAvatar, fileInputRef, handleUpload }: any) => (
    <div className="flex flex-col gap-3 p-4 bg-white/50 rounded-2xl mt-4">
      <div className="flex gap-2.5 justify-center flex-wrap">
        {EMOJI_AVATARS.map(a => (
          <button 
            key={a} 
            onClick={() => setAvatar(a)} 
            className={`flex items-center justify-center rounded-xl w-12 h-12 text-3xl transition-all ${currentAvatar === a ? 'bg-primary/20 scale-110 border-2 border-primary/40' : 'hover:bg-white/50 border border-white/70'}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="border-t border-white/80 pt-3 flex flex-col items-center gap-2">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Atau gunakan foto</p>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full font-bold text-sm shadow-sm border border-gray-200"
        >
          <Camera size={18} />
          {currentAvatar.startsWith('data:image/') ? "Ganti Foto" : "Upload Foto Kalian"}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/png, image/jpeg, image/webp"
          className="hidden" 
          onChange={(e) => handleUpload(e, setAvatar)} 
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-romantic-gradient p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl w-full max-w-xl border border-white/50 shadow-2xl my-8">
        <h2 className="text-3xl font-black text-center text-gray-800 mb-8">Siapa yang main? 🎮</h2>
        
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4 border-b-2 border-primary/30 pb-2">
            <Avatar avatarData={p1Avatar} className="w-16 h-16 text-4xl" />
            <input 
              className="flex-1 bg-transparent text-xl font-bold text-gray-800 focus:border-primary outline-none" 
              value={p1Name} 
              onChange={e => setP1Name(e.target.value)} 
              placeholder="Nama Player 1" 
            />
          </div>
          <AvatarOptions 
            currentAvatar={p1Avatar} 
            setAvatar={setP1Avatar} 
            fileInputRef={fileInputP1}
            handleUpload={handlePhotoUpload}
          />
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4 border-b-2 border-secondary/30 pb-2">
            <Avatar avatarData={p2Avatar} className="w-16 h-16 text-4xl" />
            <input 
              className="flex-1 bg-transparent text-xl font-bold text-gray-800 focus:border-secondary outline-none" 
              value={p2Name} 
              onChange={e => setP2Name(e.target.value)} 
              placeholder="Nama Player 2" 
            />
          </div>
          <AvatarOptions 
            currentAvatar={p2Avatar} 
            setAvatar={setP2Avatar} 
            fileInputRef={fileInputP2}
            handleUpload={handlePhotoUpload}
          />
        </div>

        <button onClick={handleStart} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xl hover:bg-black transition-all transform hover:scale-105 shadow-xl shadow-gray-900/10">
          Start Journey 🚀
        </button>
      </motion.div>
    </div>
  );
};