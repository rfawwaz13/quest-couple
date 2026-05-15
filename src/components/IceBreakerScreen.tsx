import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Forward, BookHeart, Globe } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import Webcam from 'react-webcam';

const ALL_STORIES = [
  // ISLAMIC STORIES
  { type: 'islami', title: "Cinta Dalam Diam", figures: "Ali bin Abi Thalib & Fatimah Az-Zahra", story: "Cinta Ali kepada Fatimah dijaga dalam diam hingga setan pun tidak tahu. Kisah ini mengajarkan bahwa cinta yang dijaga karena Allah akan berbuah manis pada waktunya." },
  { type: 'islami', title: "Support System Terbaik", figures: "Khadijah & Rasulullah ﷺ", story: "Khadijah RA menyelimuti dan menenangkan Rasulullah ﷺ saat wahyu pertama turun. Pasangan sejati adalah tempat pulang yang paling menenangkan." },
  { type: 'islami', title: "Mahar Paling Mulia", figures: "Abu Thalhah & Ummu Sulaim", story: "Ummu Sulaim menolak harta dan meminta keislaman Abu Thalhah sebagai mahar. Cinta sejati adalah yang menyelamatkan hingga ke akhirat." },
  // GENERAL WORLD STORIES
  { type: 'general', title: "Monumen Cinta Abadi", figures: "Shah Jahan & Mumtaz Mahal", story: "Taj Mahal dibangun selama 22 tahun sebagai bukti cinta kaisar kepada istrinya. Mengingatkan kita bahwa dedikasi dan kesetiaan melampaui waktu." },
  { type: 'general', title: "Cinta di Balik Surat", figures: "John & Abigail Adams", story: "Lewat 1.100 surat selama perang, mereka tetap terhubung secara intelektual dan emosional. Komunikasi adalah kunci menjaga api cinta tetap menyala." },
  { type: 'general', title: "Pengorbanan Tanpa Batas", figures: "Pierre & Marie Curie", story: "Bekerja berdampingan di laboratorium dingin demi ilmu pengetahuan. Mereka membuktikan bahwa visi yang sama memperkuat ikatan dua manusia." },
  { type: 'general', title: "Kesetiaan Sang Penulis", figures: "Mark Twain & Olivia Langdon", story: "Twain menulis surat cinta setiap hari selama puluhan tahun. Ia berkata: 'Di mana pun dia berada, di situlah surga.' Menghargai pasangan setiap hari adalah kunci kebahagiaan." }
];

export const IceBreakerScreen = () => {
  const { saveIceBreakerPhoto, nextIceBreaker, lastIceBreakerMilestone, iceBreakerQueue } = useGameStore();
  const currentType = iceBreakerQueue[0];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const randomStory = useMemo(() => ALL_STORIES[Math.floor(Math.random() * ALL_STORIES.length)], [lastIceBreakerMilestone]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) { setPreview(imageSrc); setShowCamera(false); }
  }, [webcamRef]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${currentType === 'story' ? 'bg-emerald-900/90' : 'bg-black/80'}`}>
      <AnimatePresence mode="wait">
        {currentType === 'story' ? (
          <motion.div key="story" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center">
            <div className={`p-4 rounded-full mb-6 mx-auto w-fit ${randomStory.type === 'islami' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              {randomStory.type === 'islami' ? <BookHeart size={32} /> : <Globe size={32} />}
            </div>
            <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-2">Kisah Inspirasi {randomStory.type === 'islami' ? 'Islami' : 'Dunia'}</h2>
            <h3 className="text-2xl font-black text-gray-800 mb-1">{randomStory.title}</h3>
            <p className="text-md font-semibold text-primary mb-6 italic">{randomStory.figures}</p>
            <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100 text-justify text-sm text-gray-600 leading-relaxed italic">
              "{randomStory.story}"
            </div>
            <button onClick={nextIceBreaker} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
              Lanjutkan Perjalanan <Forward size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div key="photo" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 pb-8 rounded-sm shadow-2xl max-w-md w-full text-center border-[12px] border-white">
             <h2 className="text-3xl font-black text-gray-800 mb-1">Photo Booth! 📸</h2>
             <p className="text-gray-500 mb-6">Milestone {lastIceBreakerMilestone} Pertanyaan!</p>
             {preview ? (
               <div className="mb-6">
                 <img src={preview} className="w-full aspect-square object-cover rounded-lg mb-4" />
                 <button onClick={() => { saveIceBreakerPhoto(preview); setPreview(null); }} className="w-full py-4 bg-primary text-white rounded-xl font-bold">Simpan Foto</button>
               </div>
             ) : showCamera ? (
               <div className="mb-6">
                 <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full aspect-square object-cover rounded-lg mb-4" />
                 <button onClick={capturePhoto} className="w-full py-4 bg-primary text-white rounded-xl font-bold">Jepret!</button>
               </div>
             ) : (
               <div className="flex flex-col gap-3">
                 <button onClick={() => setShowCamera(true)} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Camera size={20} /> Buka Kamera</button>
                 <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold">Upload Foto</button>
                 <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => {
                   const file = e.target.files?.[0];
                   if(file) { const r = new FileReader(); r.onloadend = () => setPreview(r.result as string); r.readAsDataURL(file); }
                 }} />
                 <button onClick={nextIceBreaker} className="mt-4 text-gray-400 font-bold underline">Skip Foto</button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};