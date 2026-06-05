'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatFileSize, isValidImageType, MAX_FILE_SIZE } from '@/lib/utils';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const newErrors: string[] = [];
      const newImages: UploadedImage[] = [];

      Array.from(files).forEach((file) => {
        if (!isValidImageType(file)) {
          newErrors.push(`${file.name}: unsupported format (use JPEG, PNG, or WebP)`);
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          newErrors.push(`${file.name}: exceeds 10 MB limit`);
          return;
        }
        const preview = URL.createObjectURL(file);
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          preview,
          name: file.name,
          size: file.size,
        });
      });

      setErrors(newErrors);
      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, onImagesChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onImagesChange(images.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-[1.01]'
            : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50'
        )}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-colors',
              isDragging ? 'bg-purple-200' : 'bg-white shadow-sm'
            )}
          >
            <Upload className={cn('w-6 h-6', isDragging ? 'text-purple-600' : 'text-gray-400')} />
          </div>
          <div>
            <p className="font-semibold text-gray-700">
              {isDragging ? 'Drop your images here' : 'Upload images'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Drag & drop or click to browse · JPEG, PNG, WebP · Max 10 MB each
            </p>
          </div>
          {images.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="mt-1"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <ImageIcon className="w-4 h-4" />
              Choose files
            </Button>
          )}
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay with name */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">{img.name}</p>
                  <p className="text-white/70 text-xs">{formatFileSize(img.size)}</p>
                </div>
              </div>
              {/* Remove button */}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add more button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-purple-300 hover:text-purple-500 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs font-medium">Add more</span>
          </button>
        </div>
      )}
    </div>
  );
}
