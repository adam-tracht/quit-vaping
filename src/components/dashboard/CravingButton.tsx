import { Sparkles } from 'lucide-react';

interface CravingButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export function CravingButton({ onPress, disabled }: CravingButtonProps) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`
        w-full py-4 px-3 rounded-xl font-bold text-lg transition-all duration-300
        ${disabled
          ? 'bg-surface text-text-muted cursor-not-allowed'
          : 'bg-gradient-to-br from-primary to-primary-dark text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20'
        }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        <Sparkles className={`w-5 h-5 ${disabled ? 'opacity-50' : 'animate-pulse'}`} />
        <span>I'm Craving</span>
      </div>
    </button>
  );
}
