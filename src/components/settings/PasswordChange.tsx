import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { hashPassword } from '@/utils/storage';

export function PasswordChange() {
  const { data, updateData } = useLocalStorage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!data) return;

    // Verify current password
    if (hashPassword(currentPassword) !== data.password) {
      setError('Current password is incorrect');
      return;
    }

    // Validate new password
    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Update password
    updateData({ password: hashPassword(newPassword) });
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-primary" />
        <h3 className="text-text font-semibold">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-text-muted block mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-muted block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-muted block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
          />
        </div>

        {error && (
          <p className="text-danger text-sm">{error}</p>
        )}

        {success && (
          <p className="text-secondary text-sm">Password updated successfully!</p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
