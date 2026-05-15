import { useGameStore } from './store/useGameStore';
import { UploadScreen } from './components/UploadScreen';
import { SetupScreen } from './components/SetupScreen';
import { Board } from './components/Board';
import { QuestionCard } from './components/QuestionCard';
import { SummaryScreen } from './components/SummaryScreen';
import { IceBreakerScreen } from './components/IceBreakerScreen'; // IMPORT INI
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { step, totalQuestionsAsked, setStep } = useGameStore();

  return (
    // <div className="min-h-screen bg-romantic-gradient overflow-x-hidden font-sans text-gray-900">
    // <div className="min-h-screen bg-[url('/bg-couple.jpg')] bg-cover bg-center bg-fixed overflow-x-hidden font-sans text-gray-900">
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden font-sans text-gray-900"
      style={{ backgroundImage: "url('/bg-couple.jpg')" }}
    >
      
      {(step === 'playing' || step === 'question') && (
        <motion.div 
          initial={{ y: -20 }} animate={{ y: 0 }}
          className="fixed top-4 right-4 z-40 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-xs font-bold"
        >
          📝 Questions Asked: {totalQuestionsAsked}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 'upload' && <UploadScreen key="upload" />}
        {step === 'setup' && <SetupScreen key="setup" />}
        
        {(step === 'playing' || step === 'question') && (
          <div key="game" className="min-h-screen flex flex-col items-center justify-center p-4">
            <Board />
            
            {step === 'playing' && (
              <button 
                onClick={() => setStep('summary')}
                className="mt-12 text-gray-500 hover:text-primary font-bold text-sm underline underline-offset-4 transition-colors"
              >
                Selesaikan Permainan & Download Report
              </button>
            )}

            <AnimatePresence>
              {step === 'question' && <QuestionCard />}
            </AnimatePresence>
          </div>
        )}

        {/* INI LAYAR ICE BREAKER NYA */}
        {step === 'icebreaker' && <IceBreakerScreen key="icebreaker" />}
        
        {step === 'summary' && <SummaryScreen key="summary" />}
      </AnimatePresence>
    </div>
  );
}

export default App;