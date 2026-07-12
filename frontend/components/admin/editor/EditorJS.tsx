// @ts-nocheck
'use client';

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
}

export default function EditorJSComponent({ onChange, token, initialData }: EditorJSComponentProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const isReady = useRef(false);

  useEffect(() => {
    // Nếu đã có editor instance → không tạo thêm
    if (isReady.current || editorRef.current) return;
    isReady.current = true;

    // Đảm bảo holder tồn tại và trống
    const holder = document.getElementById('editorjs-holder');
    if (!holder) return;
    holder.innerHTML = ''; // clear nếu có gì thừa

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const editor = new EditorJS({
      holder: 'editorjs-holder',
      placeholder: "Nhấn Tab hoặc '/' để chọn loại nội dung...",
      autofocus: true,
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
                  const data = await res.json();
                  return { success: 1, file: { url: data.url } };
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
        } catch {}
      },
    });

    editorRef.current = editor;

    // ── Word/Web Paste Handler ──
    const handlePaste = async (e: ClipboardEvent) => {
      const html = e.clipboardData?.getData('text/html') || '';
      if (!html || !html.includes('<')) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const children = Array.from(doc.body.children);

      const blocks: Array<{ type: string; data: Record<string, unknown> }> = [];

      children.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const cls = el.className || '';
        const style = (el as HTMLElement).style?.cssText || '';

        let level = 0;
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
          level = parseInt(tag[1]);
        } else {
          const msoMatch =
            cls.match(/MsoHeading(\d)/i) ||
            style.match(/mso-style-name:\s*heading\s*(\d)/i);
          if (msoMatch) level = parseInt(msoMatch[1]);
        }

        const text = el.innerHTML?.trim();
        if (!text || text === '&nbsp;') return;

        if (level > 0) {
          const clampedLevel = Math.max(2, Math.min(4, level));
          blocks.push({ type: 'header', data: { text, level: clampedLevel } });
        } else if (['ul', 'ol'].includes(tag)) {
          const items = Array.from(el.querySelectorAll('li')).map((li) => li.innerHTML.trim());
          if (items.length) {
            blocks.push({ type: 'list', data: { style: tag === 'ol' ? 'ordered' : 'unordered', items } });
          }
        } else {
          blocks.push({ type: 'paragraph', data: { text } });
        }
      });

      if (blocks.length === 0) return;

      e.preventDefault();
      e.stopPropagation();

      await editor.isReady;
      for (const block of blocks) {
        editor.blocks.insert(block.type, block.data);
      }
    };

    // Dùng lại biến holder đã khai báo ở trên (không khai báo lại)
    holder.addEventListener('paste', handlePaste as EventListener, true);

    return () => {
      holder.removeEventListener('paste', handlePaste as EventListener, true);
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try { editorRef.current.destroy(); } catch {}
      }
      editorRef.current = null;
      isReady.current = false;
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
      <div id="editorjs-holder" className="prose prose-slate max-w-none" />
    </div>
  );
}
