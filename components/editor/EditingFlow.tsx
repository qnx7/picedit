'use client';

import { useState, useCallback } from 'react';
import { ImageUpload, type UploadedImage } from '@/components/upload/ImageUpload';
import { StyleSelector } from '@/components/styles/StyleSelector';
import { ResultPreview } from '@/components/editor/ResultPreview';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type PresetStyle, getStyleById } from '@/lib/styles';
import {
  Sparkles,
  RotateCcw,
  ChevronRight,
  Upload,
  Palette,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EditedResult {
  sourceId: string;
  sourceName: string;
  sourcePreview: string;
  editedBase64?: string;
  editedMimeType?: string;
  error?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
}

type Step = 'upload' | 'style' | 'results';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
  { id: 'style', label: 'Choose Style', icon: <Palette className="w-4 h-4" /> },
  { id: 'results', label: 'Results', icon: <ImageIcon className="w-4 h-4" /> },
];

export function EditingFlow() {
  const [step, setStep] = useState<Step>('upload');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<PresetStyle | null>(null);
  const [results, setResults] = useState<EditedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiNotConfigured, setApiNotConfigured] = useState(false);

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  const handleApplyStyle = useCallback(async () => {
    if (!selectedStyle || images.length === 0) return;

    setIsProcessing(true);
    setApiNotConfigured(false);
    setStep('results');

    // Initialize results as pending
    const initial: EditedResult[] = images.map((img) => ({
      sourceId: img.id,
      sourceName: img.name,
      sourcePreview: img.preview,
      status: 'pending',
    }));
    setResults(initial);

    // Process images sequentially to avoid hammering the API
    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      // Mark as processing
      setResults((prev) =>
        prev.map((r) => (r.sourceId === img.id ? { ...r, status: 'processing' } : r))
      );

      try {
        const base64 = await fileToBase64(img.file);
        const res = await fetch('/api/edit-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: img.file.type,
            styleId: selectedStyle.id,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error === 'IMAGE_EDITING_NOT_CONFIGURED') {
            setApiNotConfigured(true);
            // Mark remaining as error
            setResults((prev) =>
              prev.map((r) =>
                r.sourceId === img.id || r.status === 'pending'
                  ? { ...r, status: 'error', error: 'API not configured' }
                  : r
              )
            );
            break;
          }
          throw new Error(data.error || 'Edit failed');
        }

        setResults((prev) =>
          prev.map((r) =>
            r.sourceId === img.id
              ? {
                  ...r,
                  status: 'done',
                  editedBase64: data.imageBase64,
                  editedMimeType: data.mimeType,
                }
              : r
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setResults((prev) =>
          prev.map((r) => (r.sourceId === img.id ? { ...r, status: 'error', error: message } : r))
        );
      }
    }

    setIsProcessing(false);
  }, [images, selectedStyle]);

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setSelectedStyle(null);
    setResults([]);
    setStep('upload');
    setApiNotConfigured(false);
  };

  const processedCount = results.filter((r) => r.status === 'done' || r.status === 'error').length;
  const progress = results.length > 0 ? (processedCount / results.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">PicEdit</span>
          </div>

          {/* Step indicators */}
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-1">
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                    idx === currentStepIndex
                      ? 'bg-purple-100 text-purple-700'
                      : idx < currentStepIndex
                      ? 'text-gray-400'
                      : 'text-gray-300'
                  )}
                >
                  {s.icon}
                  {s.label}
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                )}
              </div>
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500">
            <RotateCcw className="w-4 h-4" />
            Start over
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Upload step */}
        {step === 'upload' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload your photos</h2>
              <p className="text-gray-500 mt-1">Add the images you want to transform</p>
            </div>
            <ImageUpload images={images} onImagesChange={setImages} />
            {images.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={() => setStep('style')}>
                  Continue to style selection
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Style step */}
        {step === 'style' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose a style</h2>
              <p className="text-gray-500 mt-1">
                Select the aesthetic preset to apply to your {images.length} image
                {images.length !== 1 ? 's' : ''}
              </p>
            </div>
            <StyleSelector
              selectedStyleId={selectedStyle?.id ?? null}
              onSelect={setSelectedStyle}
            />
            {selectedStyle && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-2xl">{selectedStyle.emoji}</span>
                  <div>
                    <p className="font-semibold text-purple-900 text-sm">{selectedStyle.name}</p>
                    <p className="text-xs text-purple-600">{selectedStyle.mood}</p>
                  </div>
                </div>
                <Button onClick={handleApplyStyle} className="w-full sm:w-auto">
                  <Sparkles className="w-4 h-4" />
                  Apply style to {images.length} image{images.length !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results step */}
        {step === 'results' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isProcessing ? 'Applying style...' : 'Your edited photos'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {selectedStyle?.name} preset ·{' '}
                  {isProcessing
                    ? `${processedCount} of ${results.length} done`
                    : `${results.filter((r) => r.status === 'done').length} edited`}
                </p>
              </div>
              {!isProcessing && (
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                  Edit new photos
                </Button>
              )}
            </div>

            {/* Progress bar */}
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-gray-400 text-right">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}

            {/* API not configured notice */}
            {apiNotConfigured && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-900">AI editing not configured</p>
                  <p className="text-sm text-amber-700">
                    Add your <code className="font-mono bg-amber-100 px-1 rounded">OPENAI_API_KEY</code>{' '}
                    to <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> to enable
                    real AI image editing. See the README for setup instructions.
                  </p>
                </div>
              </div>
            )}

            <ResultPreview
              results={results}
              styleName={selectedStyle?.name ?? ''}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Converts a File to a base64 data string (without the data URL prefix)
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:image/xxx;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
