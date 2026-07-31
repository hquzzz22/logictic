// @ts-nocheck
'use client';

import { getImageUrl } from '@/lib/utils';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Checklist from '@editorjs/checklist';

let VideoTool: any = null;
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  VideoTool = require('./VideoTool').default;
}

interface EditorJSComponentProps {
  onChange?: (data: Record<string, unknown>) => void;
  token?: string;
  initialData?: Record<string, unknown>;
  holderId?: string;
  editorInstance?: (editor: any) => void;
}

export default function EditorJSComponent({ onChange, token, initialData, holderId = 'editorjs-holder', editorInstance }: EditorJSComponentProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const editor = new EditorJS({
      holder: holderRef.current, // Dùng trực tiếp DOM node reference thay vì string ID để tránh đụng độ React Strict Mode
      placeholder: "Nhấn Tab hoặc '/' để chọn loại nội dung...",
      autofocus: false,
      data: (initialData as any) || undefined,
      i18n: {
        messages: {
          ui: {
            blockTunes: {
              toggler: { 'Click to tune': 'Tuỳ chỉnh', 'or drag to move': 'hoặc kéo để di chuyển' },
            },
            inlineToolbar: { converter: { 'Convert to': 'Chuyển thành' } },
            toolbar: { toolbox: { Add: 'Thêm' } },
          },
          toolNames: {
            Text: 'Đoạn văn', Heading: 'Tiêu đề', List: 'Danh sách',
            Warning: 'Cảnh báo', Checklist: 'Checklist', Quote: 'Trích dẫn',
            Code: 'Code', Delimiter: 'Ngăn cách', Table: 'Bảng',
            Link: 'Link', Image: 'Hình ảnh', Video: 'Video',
            Bold: 'Đậm', Italic: 'Nghiêng',
          },
          tools: {
            warning: { Title: 'Tiêu đề', Message: 'Nội dung cảnh báo' },
            link: { 'Add a link': 'Nhập URL...' },
            stub: { 'The block can not be displayed correctly.': 'Khối này không hiển thị được.' },
          },
          blockTunes: {
            delete: { Delete: 'Xoá', 'Click to delete': 'Bấm để xoá' },
            moveUp: { 'Move up': 'Di lên' },
            moveDown: { 'Move down': 'Di xuống' },
          },
        },
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: { placeholder: 'Nhập tiêu đề...', levels: [2, 3, 4], defaultLevel: 2 },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: { defaultStyle: 'unordered' },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            captionPlaceholder: 'Chú thích ảnh...',
            uploader: {
              async uploadByFile(file: File) {
                const formData = new FormData();
                formData.append('image', file);
                try {
                  const res = await fetch(`${apiUrl}/upload`, {
                    method: 'POST',
                    headers: authHeader,
                    body: formData,
                  });
                  if (!res.ok) throw new Error('Upload failed');
                  const data = await res.json();
                  return { success: 1, file: { url: getImageUrl(data.url) } };
                } catch {
                  return { success: 0 };
                }
              },
              async uploadByUrl(url: string) {
                return { success: 1, file: { url } };
              },
            },
          },
        },
        ...(VideoTool ? { video: { class: VideoTool, config: { token } } } : {}),
        embed: {
          class: Embed,
          config: { services: { youtube: true, vimeo: true } },
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: { rows: 2, cols: 3, withHeadings: true },
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          config: { titlePlaceholder: 'Tiêu đề cảnh báo...', messagePlaceholder: 'Nội dung cảnh báo...' },
        },
        code: {
          class: CodeTool,
          config: { placeholder: 'Nhập code tại đây...' },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: { quotePlaceholder: 'Nhập trích dẫn...', captionPlaceholder: 'Tác giả / Nguồn...' },
        },
        delimiter: Delimiter,
        inlineCode: InlineCode,
        marker: Marker,
      },
      async onChange(api) {
        if (!onChange) return;
        try {
          const outputData = await api.saver.save();
          onChange(outputData as Record<string, unknown>);
        } catch (e) {
          console.error("EditorJS save error:", e);
        }
      },
    });

    editorRef.current = editor;
    if (editorInstance) {
      editorInstance(editor);
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        const editorToDestroy = editorRef.current;
        editorRef.current = null; // Detach immediately to prevent second mount from seeing it
        editorToDestroy.isReady
          .then(() => {
            try { editorToDestroy.destroy(); } catch {}
          })
          .catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[400px] bg-white border border-border rounded-2xl px-6 py-4 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
      {/* Toolbar hint */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pb-3 mb-3 border-b border-border">
        <span>📝 Văn bản</span>
        <span>📰 Tiêu đề</span>
        <span>📷 Hình ảnh</span>
        <span>🎬 Video</span>
        <span>📋 Danh sách</span>
        <span>☑️ Checklist</span>
        <span>📊 Bảng</span>
        <span>⚠️ Cảnh báo</span>
        <span>💻 Code</span>
        <span>💬 Trích dẫn</span>
      </div>
      <div id={holderId} ref={holderRef} className="prose prose-slate max-w-none" />
    </div>
  );
}
