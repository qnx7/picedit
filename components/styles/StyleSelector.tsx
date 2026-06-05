'use client';

import { PRESET_STYLES, type PresetStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onSelect: (style: PresetStyle) => void;
}

export function StyleSelector({ selectedStyleId, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {PRESET_STYLES.map((style) => {
        const isSelected = selectedStyleId === style.id;
        return (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={cn(
              'relative text-left rounded-2xl p-4 border-2 transition-all duration-200 group card-hover',
              isSelected
                ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'
            )}
          >
            {/* Gradient swatch */}
            <div
              className={cn(
                'w-full h-16 rounded-xl bg-gradient-to-br mb-3',
                style.gradient
              )}
            />

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}

            {/* Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{style.emoji}</span>
                <span
                  className={cn(
                    'font-semibold text-sm',
                    isSelected ? 'text-purple-700' : 'text-gray-800'
                  )}
                >
                  {style.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{style.description}</p>
              <p
                className="text-xs font-medium"
                style={{ color: style.accentColor }}
              >
                {style.mood}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
