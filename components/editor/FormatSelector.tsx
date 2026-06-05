'use client';

import { cn } from '@/lib/utils';

export type ImageFormat = 'post' | 'story';

interface FormatOption {
  id: ImageFormat;
  label: string;
  ratio: string;
  description: string;
  width: number;
  height: number;
}

export const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'post',
    label: 'Beitrag',
    ratio: '1:1',
    description: 'Quadratisch · Feed Post',
    width: 1024,
    height: 1024,
  },
  {
    id: 'story',
    label: 'Story',
    ratio: '9:16',
    description: 'Hochformat · Story / Reels',
    width: 1024,
    height: 1536,
  },
];

interface FormatSelectorProps {
  selected: ImageFormat;
  onChange: (format: ImageFormat) => void;
}

export function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  return (
    <div className="flex gap-3">
      {FORMAT_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 flex-1',
              isSelected
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-200'
            )}
          >
            {/* Aspect ratio preview box */}
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
              <div
                className={cn(
                  'rounded border-2 transition-colors',
                  isSelected ? 'border-purple-500 bg-purple-200' : 'border-gray-300 bg-gray-100',
                  opt.id === 'post' ? 'w-6 h-6' : 'w-4 h-6'
                )}
              />
            </div>
            <div className="text-left">
              <div className={cn('font-semibold text-sm', isSelected ? 'text-purple-700' : 'text-gray-800')}>
                {opt.label}
                <span className={cn('ml-1.5 text-xs font-normal', isSelected ? 'text-purple-500' : 'text-gray-400')}>
                  {opt.ratio}
                </span>
              </div>
              <div className="text-xs text-gray-400">{opt.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
