import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { resetAllData } from '@/utils/storage';

export function DataReset() {
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (confirmText === 'RESET') {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="bg-danger/10 rounded-xl p-4 border border-danger/30">
      <div className="flex items-center gap-2 mb-4">
        <Trash2 className="w-5 h-5 text-danger" />
        <h3 className="text-danger font-semibold">Reset All Data</h3>
      </div>

      {!showConfirm ? (
        <div>
          <p className="text-text-muted text-sm mb-3">
            This will permanently delete all your craving logs, settings, and progress. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-2 bg-danger/20 text-danger border border-danger/30 rounded-lg hover:bg-danger/30 transition-colors"
          >
            Reset All Data
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-text-muted text-sm">
            Type <code className="bg-danger/20 px-2 py-1 rounded text-danger">RESET</code> to confirm
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type RESET to confirm"
            className="w-full px-3 py-2 bg-background border border-danger/30 rounded-lg text-text focus:outline-none focus:border-danger"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText('');
              }}
              className="flex-1 py-2 bg-background text-text rounded-lg hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              disabled={confirmText !== 'RESET'}
              className="flex-1 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
