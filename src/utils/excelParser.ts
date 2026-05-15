// src/utils/excelParser.ts
import * as XLSX from 'xlsx';
import type { Question } from '../store/useGameStore';
// import { Question } from '../store/useGameStore';

export const parseExcel = async (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        // Ambil sheet pertama otomatis
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Parse ke JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];
        
        const questions: Question[] = jsonData.map((row, index) => ({
          id: index,
          category: row['Kategori'] || 'General',
          text: row['Pertanyaan Diskusi'] || row['Pertanyaan'] || 'Pertanyaan tidak valid',
          discussed: false
        })).filter(q => q.text !== 'Pertanyaan tidak valid'); // Filter baris kosong

        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};