import { useState, useEffect } from 'react';
import { PasswordProtect } from './components/auth/PasswordProtect';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProgressView } from './components/progress/ProgressView';
import { Settings } from './components/settings/Settings';
import { Navigation } from './components/common/Navigation';
import { CravingTimer } from './components/craving/CravingTimer';
import { CravingResult } from './components/craving/CravingResult';
import { QuickLog } from './components/dashboard/QuickLog';
import { PWAPrompt } from './components/common/PWAPrompt';
import { IOSInstallBanner } from './components/common/iOSInstallBanner';
import { SyncStatusIndicator } from './components/common/SyncStatus';
import { useCravings } from './hooks/useCravings';
import { useReminders } from './hooks/useReminders';
import { usePWAPrompt } from './hooks/usePWAPrompt';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { CravingResult as CravingResultType } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'progress' | 'settings'>('dashboard');
  const [showCravingResult, setShowCravingResult] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const { data, isLoaded, syncStatus, syncError, addCraving } = useLocalStorage();
  const { timerState, startTimer, stopTimer, logCraving, quickLog, passedCount, gaveInCount, randomTip } = useCravings({ addCraving, data });
  const { needsPermission } = useReminders();
  const { shouldShowiOSPrompt, shouldShowNativePrompt, promptInstall, dismissPrompt } = usePWAPrompt();

  // Show permission request on second visit (subtle approach)
  useEffect(() => {
    if (needsPermission && isLoaded) {
      const visitCount = localStorage.getItem('visitCount');
      if (visitCount && parseInt(visitCount) >= 2) {
        // Could show a subtle permission request here
      }
      localStorage.setItem('visitCount', String((parseInt(visitCount || '0') + 1)));
    }
  }, [needsPermission, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordProtect onUnlock={() => setIsAuthenticated(true)} />;
  }

  const handleCravingResult = (result: CravingResultType) => {
    logCraving(result);
    setShowCravingResult(false);
    setCurrentView('dashboard');
  };

  const handleCloseTimer = () => {
    setShowCravingResult(true);
  };

  const handleCancelTimer = () => {
    stopTimer();
    setShowCravingResult(false);
  };

  const handleQuickLog = (result: CravingResultType) => {
    quickLog(result);
    setShowQuickLog(false);
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <SyncStatusIndicator status={syncStatus} error={syncError} />
      <div className="max-w-md mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <Dashboard
            onStartCravingTimer={startTimer}
            onQuickLog={() => setShowQuickLog(true)}
            timerActive={timerState.active}
            passedCount={passedCount}
            gaveInCount={gaveInCount}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView onNavigate={setCurrentView} />
        )}

        {currentView === 'settings' && (
          <Settings onNavigate={setCurrentView} />
        )}

        {timerState.active && (
          <CravingTimer
            timerState={timerState}
            onClose={handleCloseTimer}
            onCancel={handleCancelTimer}
            randomTip={randomTip}
          />
        )}

        {showCravingResult && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col p-6">
            <header className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-semibold text-text">How are you feeling?</h1>
              <button
                onClick={handleCancelTimer}
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-text transition-colors"
              >
                ✕
              </button>
            </header>
            <CravingResult onResult={handleCravingResult} />
          </div>
        )}

        {showQuickLog && (
          <QuickLog
            onLog={handleQuickLog}
            onClose={() => setShowQuickLog(false)}
          />
        )}
      </div>

      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      {shouldShowNativePrompt && (
        <PWAPrompt onInstall={promptInstall} onDismiss={dismissPrompt} />
      )}

      {shouldShowiOSPrompt && <IOSInstallBanner onDismiss={dismissPrompt} />}
    </div>
  );
}

export default App;
