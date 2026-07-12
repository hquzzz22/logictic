'use client';

import { useState, useRef } from 'react';
import { Video, Upload, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface VideoUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function VideoUploader({ value, onChange }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [linkInput, setLinkInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate
    const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowed.includes(file.type)) {
      toast.error('Chỉ hỗ trợ MP4, WebM, OGG');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      toast.error('File video vượt quá 200MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const { data } = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      onChange(data.url);
      toast.success('Đã tải video lên thành công!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Upload video thất bại');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleInsertLink = () => {
    if (!linkInput.trim()) return;
    onChange(linkInput.trim());
    setLinkInput('');
    toast.success('Đã chèn video');
  };

  const handleRemove = () => {
    onChange('');
  };

  // Nếu đã có video
  if (value) {
    const isYouTube = value.includes('youtube.com') || value.includes('youtu.be');
    const youtubeId = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];

    return (
      <div className="border border-border rounded-xl overflow-hidden bg-muted/10">
        <div className="aspect-video bg-black relative">
          {isYouTube && youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <video src={value} controls className="w-full h-full object-contain" />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg z-10"
            title="Xóa video"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-3 py-2 text-xs text-muted-foreground truncate">{value}</div>
      </div>
    );
  }

  // Chưa có video — UI upload
  return (
    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/10">
      <div className="text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-[#ffe4e2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="h-7 w-7 text-[#e62c26]" />
        </div>

        <h4 className="font-bold text-foreground mb-1">Thêm video vào bài viết</h4>
        <p className="text-sm text-muted-foreground mb-5">MP4, WebM, OGG · Tối đa 200MB</p>

        {/* Upload button */}
        {uploading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải lên... {progress}%
            </div>
            <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#e62c26] text-white font-medium rounded-full hover:bg-brand-700 transition-colors shadow-md"
          >
            <Upload className="h-4 w-4" />
            Tải video lên
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground">hoặc</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Link input */}
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleInsertLink())}
              placeholder="Dán link YouTube, Vimeo hoặc URL video..."
              className="w-full pl-9 pr-3 py-2.5 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={handleInsertLink}
            disabled={!linkInput.trim()}
            className="px-5 py-2.5 bg-foreground text-white text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors disabled:opacity-40"
          >
            Chèn
          </button>
        </div>
      </div>
    </div>
  );
}
