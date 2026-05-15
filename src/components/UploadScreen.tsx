// src/components/UploadScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { parseExcel } from '../utils/excelParser';
import { useGameStore } from '../store/useGameStore';

export const UploadScreen = () => {
  const setQuestions = useGameStore((state) => state.setQuestions);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const questions = await parseExcel(file);
      if (questions.length > 0) {
        setQuestions(questions);
      } else {
        alert("File kosong atau format salah. Pastikan ada kolom 'Kategori' dan 'Pertanyaan Diskusi'");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-romantic-gradient p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/30 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">CoupleQuest 💖</h1>
        <p className="text-gray-600 mb-8">Upload excel pertanyaan kalian untuk memulai perjalanan deep talk!</p>
        
        <label className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-primary/50 rounded-2xl p-8 hover:bg-white/20 transition-all">
          <UploadCloud className="w-16 h-16 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-gray-700">Klik atau Drop File Excel</span>
          <span className="text-sm text-gray-500 mt-2">Kolom wajib: Kategori, Pertanyaan Diskusi</span>
          <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
        </label>
      </motion.div>
    </div>
  );
};