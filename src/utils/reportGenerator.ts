import * as XLSX from 'xlsx';
// import { ScoreRecord, Player } from '../store/useGameStore';
import type { ScoreRecord, Player } from '../store/useGameStore';

export const exportToExcel = (history: ScoreRecord[], players: Player[]) => {
  const data = history.map((item, index) => ({
    'No': index + 1,
    'Kategori': item.category,
    'Pertanyaan': item.question,
    [`Skor ${players[0].name}`]: item.player1Score,
    [`Skor ${players[1].name}`]: item.player2Score,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relationship Summary");
  
  // Download file
  XLSX.writeFile(wb, `CoupleQuest_Summary_${new Date().toLocaleDateString()}.xlsx`);
};