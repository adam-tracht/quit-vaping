import { useState, useEffect, useMemo } from 'react';
import { PasswordProtect } from './components/auth/PasswordProtect';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProgressView } from './components/progress/ProgressView';
import { Settings } from './components/settings/Settings';
import { Navigation } from './components/common/Navigation';
import { PWAPrompt } from './components/common/PWAPrompt';
import { IOSInstallBanner } from './components/common/iOSInstallBanner';
import { SyncStatusIndicator } from './components/common/SyncStatus';
import { useReminders } from './hooks/useReminders';
import { usePWAPrompt } from './hooks/usePWAPrompt';
import { useLocalStorage } from './hooks/useLocalStorage';
import { startOfDay, differenceInDays } from 'date-fns';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'progress' | 'settings'>('dashboard');
  const { data, isLoaded, syncStatus, syncError, logVape } = useLocalStorage();
  const { needsPermission } = useReminders();
  const { shouldShowiOSPrompt, shouldShowNativePrompt, promptInstall, dismissPrompt } = usePWAPrompt();

  // Calculate today's vape count
  const todayVapeCount = useMemo(() => {
    if (!data) return 0;
    const today = startOfDay(new Date());
    return data.cravings.filter(log => {
      const logDate = startOfDay(new Date(log.timestamp));
      return differenceInDays(today, logDate) === 0;
    }).length;
  }, [data]);

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

  return (
    <div className="min-h-screen bg-background text-text">
      <SyncStatusIndicator status={syncStatus} error={syncError} />
      <div className="max-w-md mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <Dashboard
            onLogVape={logVape}
            todayVapeCount={todayVapeCount}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView onNavigate={setCurrentView} />
        )}

        {currentView === 'settings' && (
          <Settings onNavigate={setCurrentView} />
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
