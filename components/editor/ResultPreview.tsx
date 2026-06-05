'use client';

import { Download, Loader2, CheckCircle2, XCircle, SplitSquareHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type EditedResult } from '@/components/editor/EditingFlow';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ResultPreviewProps {
  results: EditedResult[];
  styleName: string;
  format: 'post' | 'story';
}

export function ResultPreview({ results, styleName, format }: ResultPreviewProps) {
  // post = 1:1 square, story = 9:16 portrait
  const aspectClass = format === 'story' ? 'aspect-[9/16]' : 'aspect-square';
  const [compareId, setCompareId] = useState<string | null>(null);

  if (results.length === 0) return null;

  const downloadImage = (result: EditedResult) => {
    if (!result.editedBase64 || !result.editedMimeType) return;
    const ext = result.editedMimeType.split('/')[1] ?? 'png';
    const link = document.createElement('a');
    link.href = `data:${result.editedMimeType};base64,${result.editedBase64}`;
    link.download = `${result.sourceName.replace(/\.[^.]+$/, '')}-${styleName.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    link.click();
  };

  const downloadAll = () => {
    results.filter((r) => r.status === 'done').forEach(downloadImage);
  };

  const doneCount = results.filter((r) => r.status === 'done').length;

  return (
    <div className="space-y-5">
      {/* Download all */}
      {doneCount > 1 && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={downloadAll}>
            <Download className="w-4 h-4" />
            Download all ({doneCount})
          </Button>
        </div>
      )}

      {/* Result cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((result) => (
          <div
            key={result.sourceId}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Image area */}
            <div className={cn('relative bg-gray-50', aspectClass)}>
              {/* Loading skeleton */}
              {result.status === 'processing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Applying {styleName}…</p>
                  <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {result.status === 'pending' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.sourcePreview}
                    alt={result.sourceName}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-gray-400 font-medium">Queued</p>
                  </div>
                </div>
              )}

              {result.status === 'done' && result.editedBase64 && (
                <>
                  {compareId === result.sourceId ? (
                    // Side-by-side compare
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={result.sourcePreview}
                          alt="Before"
                          className="w-[200%] h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">
                          Before
                        </span>
                      </div>
                      <div className="w-px bg-white/60 z-10" />
                      <div className="w-1/2 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:${result.editedMimeType};base64,${result.editedBase64}`}
                          alt="After"
                          className="w-[200%] h-full object-cover object-right"
                        />
                        <span className="absolute bottom-2 right-2 text-xs font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">
                          After
                        </span>
                      </div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`data:${result.editedMimeType};base64,${result.editedBase64}`}
                      alt={`${result.sourceName} edited`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </>
              )}

              {result.status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center bg-red-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.sourcePreview}
                    alt={result.sourceName}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <XCircle className="relative w-8 h-8 text-red-400" />
                  <p className="relative text-xs text-red-600 font-medium">Edit failed</p>
                  {result.error && (
                    <p className="relative text-xs text-red-400 max-w-[180px] truncate">{result.error}</p>
                  )}
                </div>
              )}

              {/* Status badge */}
              {result.status === 'done' && (
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    Done
                  </div>
                </div>
              )}
            </div>

            {/* Card footer */}
            <div className="p-3 space-y-2">
              <p className="text-sm font-medium text-gray-800 truncate">{result.sourceName}</p>
              {result.status === 'done' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => downloadImage(result)}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      'h-8 text-xs px-2',
                      compareId === result.sourceId && 'border-purple-400 text-purple-600'
                    )}
                    onClick={() =>
                      setCompareId(compareId === result.sourceId ? null : result.sourceId)
                    }
                    title="Compare before/after"
                  >
                    <SplitSquareHorizontal className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
