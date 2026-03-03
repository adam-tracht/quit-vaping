import { useState } from 'react';
import { Lock } from 'lucide-react';
import { verifyPassword, loadAppData } from '@/utils/storage';

interface PasswordProtectProps {
  onUnlock: () => void;
}

export function PasswordProtect({ onUnlock }: PasswordProtectProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = loadAppData();

    if (verifyPassword(password, data.password)) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text">Quit Vaping</h1>
          <p className="text-text-muted mt-2">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-lg bg-surface border ${
                error ? 'border-danger' : 'border-border'
              } text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-danger text-sm mt-2">Incorrect password. Try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Unlock
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Default password: <code className="bg-surface px-2 py-1 rounded">quit</code>
        </p>
      </div>
    </div>
  );
}
