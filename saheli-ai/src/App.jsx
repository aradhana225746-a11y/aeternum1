import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import PeriodTrackerPage from './pages/PeriodTrackerPage';
import VoiceAssistant from './components/VoiceAssistant';

export default function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assess" element={<AssessmentPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/symptoms" element={<SymptomCheckerPage />} />
          <Route path="/tracker" element={<PeriodTrackerPage />} />
        </Routes>
        <VoiceAssistant />
      </BrowserRouter>
    </TranslationProvider>
  );
}
