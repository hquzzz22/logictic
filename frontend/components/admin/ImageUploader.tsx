'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ImageUploaderProps {
  /** URL ảnh hiện tại (single) */
  value?: string;
  /** Danh sách URL ảnh (multiple) */
  values?: string[];
  /** Callback khi upload xong — single mode */
  onChange?: (url: string) => void;
  /** Callback khi upload xong — multiple mode */
  onChangeMultiple?: (urls: string[]) => void;
  /** Cho phép upload nhiều ảnh */
  multiple?: boolean;
  label?: string;
}

export default function ImageUploader({
  value,
  values = [],
  onChange,
  onChangeMultiple,
  multiple = false,
  label = 'Hình ảnh',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // Validate
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" không phải file ảnh`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" vượt quá 5MB`);
          return;
        }
      }

      setUploading(true);
      try {
        if (multiple && onChangeMultiple) {
          const urls = await Promise.all(Array.from(files).map(uploadFile));
          onChangeMultiple([...values, ...urls]);
          toast.success(`Đã upload ${urls.length} ảnh`);
        } else if (onChange) {
          const url = await uploadFile(files[0]);
          onChange(url);
          toast.success('Đã upload ảnh');
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const msg = error.response?.data?.message || error.message || 'Upload thất bại';
        toast.error(`Upload lỗi: ${msg}`);
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [multiple, onChange, onChangeMultiple, values]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (url: string) => {
    if (multiple && onChangeMultiple) {
      onChangeMultiple(values.filter((v) => v !== url));
    } else if (onChange) {
      onChange('');
    }
  };

  // ---- SINGLE MODE ----
  if (!multiple) {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="relative w-28 h-28 rounded-xl border-2 border-dashed border-border bg-stone-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {value ? (
              <>
                <Image src={value} alt="preview" fill className="object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => removeImage(value)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <ImageIcon className="h-8 w-8 text-stone-300" />
            )}
          </div>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex-1 h-28 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Đang upload...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center px-2">
                  Kéo thả hoặc <span className="text-primary font-medium">click để chọn ảnh</span>
                </span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WEBP — tối đa 5MB</span>
              </>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  // ---- MULTIPLE MODE ----
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>

      {/* Existing images */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {values.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
              <Image src={url} alt={`ảnh ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[9px] text-center py-0.5 font-bold">
                  Ảnh chính
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`h-28 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Đang upload...</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground text-center px-2">
              Kéo thả hoặc <span className="text-primary font-medium">click để chọn ảnh</span>
            </span>
            <span className="text-xs text-muted-foreground">Có thể chọn nhiều ảnh — tối đa 5MB/ảnh</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
