import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Forward, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import Webcam from 'react-webcam';

export const IceBreakerScreen = () => {
  const { saveIceBreakerPhoto, skipIceBreaker, lastIceBreakerMilestone } = useGameStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  // Handle upload dari File Explorer / Galeri
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

  // Handle jepretan langsung dari Live Camera
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      setShowCamera(false); // Tutup live camera setelah jepret
    }
  }, [webcamRef]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }} 
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="bg-white p-6 pb-8 rounded-sm shadow-2xl max-w-md w-full text-center relative border-[12px] border-white"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} // Polaroid aesthetic
      >
        <div className="absolute -top-6 -right-6 bg-accent text-white p-3 rounded-full shadow-lg rotate-12">
          <Sparkles fill="currentColor" />
        </div>

        <h2 className="text-3xl font-black text-gray-800 mt-2 mb-1">Time Out! 📸</h2>
        <p className="text-gray-500 font-medium mb-6">Kalian berhasil melewati {lastIceBreakerMilestone} pertanyaan. Waktunya simpan momen ini!</p>

        {preview ? (
          // STATE 3: PREVIEW FOTO HASIL JEPRET/UPLOAD
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
          // STATE 2: LIVE CAMERA MENYALA
          <div className="mb-6 flex flex-col items-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-black mb-4 relative shadow-inner">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }} // Memaksa kamera depan di HP
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
          // STATE 1: PILIHAN TOMBOL
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

        {/* Tombol Skip selalu ada jika belum ada preview dan kamera mati */}
        {!preview && !showCamera && (
          <button 
            onClick={skipIceBreaker}
            className="flex items-center justify-center w-full gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors mt-4"
          >
            Nggak usah, lanjut aja <Forward size={16} />
          </button>
        )}
      </motion.div>
    </div>
  );
};