import { useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Camera, Forward, Sparkles, Image as ImageIcon, Upload, BookHeart, HeartHandshake } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import Webcam from 'react-webcam';

// --- DATA KISAH INSPIRATIF ISLAMI ---
const ISLAMIC_STORIES = [
  {
    title: "Cinta Dalam Diam",
    figures: "Ali bin Abi Thalib & Fatimah Az-Zahra",
    story: "Cinta Ali kepada Fatimah dijaga dengan sangat luar biasa dalam diam, hingga setan pun tidak tahu menahu urusan cinta mereka. Ketika akhirnya mereka dipersatukan dalam ikatan suci pernikahan, kesederhanaan menjadi pilar mereka. Kisah ini mengajarkan bahwa cinta yang dijaga karena Allah akan berbuah manis pada waktunya."
  },
  {
    title: "Support System Terbaik",
    figures: "Khadijah & Rasulullah ﷺ",
    story: "Ketika wahyu pertama turun, Rasulullah ﷺ pulang dalam keadaan gemetar dan ketakutan. Khadijah RA tidak menghakimi atau banyak bertanya, melainkan menyelimuti beliau dan menenangkan hatinya dengan keyakinan penuh. Inilah esensi pasangan sejati: menjadi tempat pulang yang menenangkan di saat dunia terasa berat."
  },
  {
    title: "Visi Akhirat & Mahar Paling Mulia",
    figures: "Abu Thalhah & Ummu Sulaim",
    story: "Ummu Sulaim dilamar oleh Abu Thalhah yang saat itu sangat kaya namun belum memeluk Islam. Ummu Sulaim menolak harta dan berkata, 'Maharku adalah keislamanmu.' Abu Thalhah bersyahadat, dan itulah mahar paling mulia. Kisah ini mengingatkan bahwa cinta sejati adalah yang menyelamatkan pasangan hingga ke akhirat."
  },
  {
    title: "Kesabaran yang Mengubah Hati",
    figures: "Umar bin Khattab & Istrinya",
    story: "Seorang sahabat datang ke rumah Umar bin Khattab untuk mengeluhkan omelan istrinya. Namun sampai di sana, ia malah mendengar istri Umar sedang mengomel, dan Umar yang ditakuti musuh itu hanya diam mendengarkan. Umar berkata, 'Istriku telah memasakkan makananku, mencucikan pakaianku, dan menyusui anak-anakku. Maka aku bersabar atas sedikit kekurangannya.' Ajaran indah tentang toleransi dan apresiasi dalam rumah tangga."
  }
];

export const IceBreakerScreen = () => {
  const { saveIceBreakerPhoto, resumeFromIceBreaker, lastIceBreakerMilestone, iceBreakerType } = useGameStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  // Ambil cerita secara acak setiap kali layar ini dirender
  const randomStory = useMemo(() => {
    return ISLAMIC_STORIES[Math.floor(Math.random() * ISLAMIC_STORIES.length)];
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      setShowCamera(false);
    }
  }, [webcamRef]);

  // --- RENDER UI KISAH ISLAMI ---
  if (iceBreakerType === 'story') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/90 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full relative overflow-hidden"
        >
          {/* Ornamen Background Estetik */}
          <div className="absolute -top-10 -right-10 text-emerald-100 opacity-50 rotate-12">
            <BookHeart size={150} />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-full mb-6 shadow-sm">
              <HeartHandshake size={32} />
            </div>
            
            <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-2">Jeda Inspirasi</h2>
            <h3 className="text-2xl font-black text-gray-800 mb-1">{randomStory.title}</h3>
            <p className="text-md font-semibold text-emerald-700 mb-6 font-serif italic">"{randomStory.figures}"</p>
            
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8 relative">
              <span className="absolute -top-3 -left-2 text-4xl text-emerald-200 font-serif">"</span>
              <p className="text-gray-600 leading-relaxed text-sm relative z-10 text-justify">
                {randomStory.story}
              </p>
              <span className="absolute -bottom-6 -right-2 text-4xl text-emerald-200 font-serif">"</span>
            </div>

            <button 
              onClick={resumeFromIceBreaker}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30"
            >
              Lanjutkan Perjalanan <Forward size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDER UI PHOTO BOOTH (Tetap Sama) ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }} 
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="bg-white p-6 pb-8 rounded-sm shadow-2xl max-w-md w-full text-center relative border-[12px] border-white"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
      >
        <div className="absolute -top-6 -right-6 bg-accent text-white p-3 rounded-full shadow-lg rotate-12">
          <Sparkles fill="currentColor" />
        </div>

        <h2 className="text-3xl font-black text-gray-800 mt-2 mb-1">Time Out! 📸</h2>
        <p className="text-gray-500 font-medium mb-6">Kalian berhasil melewati {lastIceBreakerMilestone} pertanyaan. Waktunya simpan momen ini!</p>

        {preview ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200">
              <img src={preview} alt="Captured" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => saveIceBreakerPhoto(preview)}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg mb-3"
            >
              Simpan & Lanjut Main
            </button>
            <button 
              onClick={() => setPreview(null)}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 underline"
            >
              Ulangi
            </button>
          </motion.div>
        ) : showCamera ? (
          <div className="mb-6 flex flex-col items-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-black mb-4 relative shadow-inner">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }} 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={capturePhoto}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg mb-3"
            >
              <Camera size={20} /> Jepret!
            </button>
            <button 
              onClick={() => setShowCamera(false)}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 underline"
            >
              Batal Buka Kamera
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center mb-6 border-2 border-dashed border-gray-300">
              <ImageIcon size={48} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 max-w-[200px]">Ayo selfie berdua dengan ekspresi paling konyol!</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowCamera(true)}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
              >
                <Camera size={20} /> Buka Kamera Langsung
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
              >
                <Upload size={18} /> Upload dari File / Galeri
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*"
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>
        )}

        {!preview && !showCamera && (
          <button 
            onClick={resumeFromIceBreaker}
            className="flex items-center justify-center w-full gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors mt-4"
          >
            Nggak usah, lanjut aja <Forward size={16} />
          </button>
        )}
      </motion.div>
    </div>
  );
};