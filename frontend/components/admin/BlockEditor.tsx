'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type, Heading2, Heading3, Heading4, Image as ImageIcon, List, ListOrdered,
  CheckSquare, Quote, Code, Video, Plus, GripVertical,
  Search, ChevronUp, X as XIcon, RefreshCw, ChevronRight
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';
import api from '@/lib/api';

// ===== TYPES =====
export type BlockType =
  | 'paragraph' | 'heading2' | 'heading3' | 'heading4'
  | 'image' | 'unordered-list' | 'ordered-list'
  | 'checklist' | 'quote' | 'code' | 'video';

export interface ChecklistItem { text: string; checked: boolean; }

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  items?: string[];
  checklistItems?: ChecklistItem[];
  imageUrl?: string;
  videoUrl?: string;
  language?: string;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const blockTypes: { type: BlockType; label: string; icon: typeof Type }[] = [
  { type: 'paragraph', label: 'Đoạn văn', icon: Type },
  { type: 'heading2', label: 'Heading 2', icon: Heading2 },
  { type: 'heading3', label: 'Heading 3', icon: Heading3 },
  { type: 'heading4', label: 'Heading 4', icon: Heading4 },
  { type: 'unordered-list', label: 'Unordered List', icon: List },
  { type: 'ordered-list', label: 'Ordered List', icon: ListOrdered },
  { type: 'checklist', label: 'Checklist', icon: CheckSquare },
  { type: 'image', label: 'Hình ảnh', icon: ImageIcon },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'quote', label: 'Trích dẫn', icon: Quote },
  { type: 'code', label: 'Code', icon: Code },
];

function generateId() { return Math.random().toString(36).slice(2, 10); }

function createBlock(type: BlockType): Block {
  const base = { id: generateId(), type, content: '' };
  switch (type) {
    case 'unordered-list':
    case 'ordered-list':
      return { ...base, items: [''] };
    case 'checklist':
      return { ...base, checklistItems: [{ text: '', checked: false }] };
    case 'image':
      return { ...base, imageUrl: '' };
    case 'video':
      return { ...base, videoUrl: '' };
    case 'code':
      return { ...base, language: 'javascript' };
    default:
      return base;
  }
}

// ===== MAIN COMPONENT =====
export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, [blocks, onChange]);

  const addBlock = (type: BlockType, afterIndex: number) => {
    const nb = [...blocks];
    nb.splice(afterIndex + 1, 0, createBlock(type));
    onChange(nb);
  };

  const addBlockAtEnd = (type: BlockType) => {
    onChange([...blocks, createBlock(type)]);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, dir: 'up' | 'down') => {
    const t = dir === 'up' ? index - 1 : index + 1;
    if (t < 0 || t >= blocks.length) return;
    const nb = [...blocks];
    [nb[index], nb[t]] = [nb[t], nb[index]];
    onChange(nb);
  };

  const convertBlock = (id: string, newType: BlockType) => {
    onChange(blocks.map((b) => {
      if (b.id !== id) return b;
      const converted = createBlock(newType);
      converted.id = b.id;
      converted.content = b.content;
      return converted;
    }));
  };

  // Paste text → tạo paragraph block
  const handleEditorPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text/plain');
    if (!text.trim()) return;
    // Nếu click vào vùng trống (không phải input/textarea)
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;
    e.preventDefault();
    const lines = text.split('\n').filter(l => l.trim());
    const newBlocks = lines.map(line => ({ ...createBlock('paragraph'), content: line }));
    onChange([...blocks, ...newBlocks]);
  };

  // Click vào vùng trống → focus block cuối hoặc tạo mới
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target === editorRef.current) {
      addBlockAtEnd('paragraph');
    }
  };

  return (
    <div>
      {/* Toolbar nhanh */}
      <QuickToolbar onAdd={addBlockAtEnd} />

      {/* Editor area */}
      <div
        ref={editorRef}
        className="min-h-[200px] pt-2 pb-8"
        onPaste={handleEditorPaste}
        onClick={handleEditorClick}
      >
        <div className="space-y-0">
          {blocks.map((block, index) => (
            <BlockRow
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              onUpdate={(u) => updateBlock(block.id, u)}
              onAdd={(type) => addBlock(type, index)}
              onRemove={() => removeBlock(block.id)}
              onMove={(dir) => moveBlock(index, dir)}
              onConvert={(type) => convertBlock(block.id, type)}
            />
          ))}
        </div>

        {/* Nút thêm cuối */}
        <AddTrigger onAdd={(type) => addBlockAtEnd(type)} />
      </div>
    </div>
  );
}

// ===== QUICK TOOLBAR — thanh công cụ nhanh ở trên =====
const toolbarItems: { type: BlockType; label: string; icon: typeof Type }[] = [
  { type: 'paragraph', label: 'Văn bản', icon: Type },
  { type: 'heading2', label: 'Tiêu đề', icon: Heading2 },
  { type: 'image', label: 'Hình ảnh', icon: ImageIcon },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'unordered-list', label: 'Danh sách', icon: List },
  { type: 'checklist', label: 'Checklist', icon: CheckSquare },
  { type: 'code', label: 'Code', icon: Code },
  { type: 'quote', label: 'Trích dẫn', icon: Quote },
];

function QuickToolbar({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-2 mb-2 border border-border rounded-xl bg-muted/20">
      {toolbarItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => onAdd(item.type)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white rounded-lg transition-all border border-transparent hover:border-border hover:shadow-sm"
            title={`Thêm ${item.label}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ===== BLOCK ROW — mỗi block với controls bên trái =====
interface BlockRowProps {
  block: Block;
  index: number;
  totalBlocks: number;
  onUpdate: (u: Partial<Block>) => void;
  onAdd: (type: BlockType) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
  onConvert: (type: BlockType) => void;
}

function BlockRow({ block, index, totalBlocks, onUpdate, onAdd, onRemove, onMove, onConvert }: BlockRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  return (
    <div className="group relative flex items-start gap-1 py-0.5">
      {/* Left controls: + and grip/menu */}
      <div className="flex items-center gap-0.5 pt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0">
        {/* + button */}
        <AddTrigger onAdd={onAdd} compact />
        {/* Grip / menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground/60 hover:text-foreground cursor-grab"
            title="Thao tác"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Context menu — dropdown nhỏ */}
          {menuOpen && (
            <BlockContextMenu
              block={block}
              index={index}
              totalBlocks={totalBlocks}
              onConvert={(type) => { onConvert(type); setMenuOpen(false); }}
              onMove={(dir) => { onMove(dir); setMenuOpen(false); }}
              onRemove={() => { onRemove(); setMenuOpen(false); }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0">
        <BlockRenderer block={block} onChange={onUpdate} />
      </div>
    </div>
  );
}

// ===== CONTEXT MENU — giống ảnh mẫu =====
interface ContextMenuProps {
  block: Block;
  index: number;
  totalBlocks: number;
  onConvert: (type: BlockType) => void;
  onMove: (dir: 'up' | 'down') => void;
  onRemove: () => void;
  onClose: () => void;
}

function BlockContextMenu({ block, index, totalBlocks, onConvert, onMove, onRemove, onClose }: ContextMenuProps) {
  const [filter, setFilter] = useState('');
  const [showConvert, setShowConvert] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  const convertTypes = blockTypes.filter((bt) => bt.type !== block.type && bt.label.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-border rounded-xl shadow-xl w-56 py-1.5 text-sm">
      {/* Filter */}
      <div className="px-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-lg">
          <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/50"
            placeholder="Filter"
          />
        </div>
      </div>

      {/* Current block type highlighted */}
      {!showConvert && filter === '' && (
        <div className="px-2 py-1">
          {blockTypes.filter(bt => bt.type === block.type).map(bt => {
            const Icon = bt.icon;
            return (
              <div key={bt.type} className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-[#fff0ef] text-brand-700">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{bt.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Convert to submenu */}
      {!showConvert && filter === '' ? (
        <>
          <div className="border-t border-border my-1" />
          <button
            type="button"
            onClick={() => setShowConvert(true)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/60 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span>Convert to</span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <div className="border-t border-border my-1" />
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/60 transition-colors disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
            <span>Di lên</span>
          </button>
          <button
            type="button"
            onClick={() => onRemove()}
            className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
          >
            <XIcon className="h-4 w-4" />
            <span>Xoá</span>
          </button>
        </>
      ) : (
        /* Convert list or filtered results */
        <div className="max-h-[200px] overflow-y-auto px-1 py-1">
          {convertTypes.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground text-center text-xs">Không tìm thấy</div>
          ) : (
            convertTypes.map((bt) => {
              const Icon = bt.icon;
              return (
                <button
                  key={bt.type}
                  type="button"
                  onClick={() => onConvert(bt.type)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{bt.label}</span>
                </button>
              );
            })
          )}
          {showConvert && filter === '' && (
            <button
              type="button"
              onClick={() => setShowConvert(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              ← Quay lại
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ===== ADD TRIGGER — nút + nhỏ hoặc dòng text =====
function AddTrigger({ onAdd, compact }: { onAdd: (type: BlockType) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { setFilter(''); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const filtered = blockTypes.filter((bt) => bt.label.toLowerCase().includes(filter.toLowerCase()));

  if (compact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground/60 hover:text-primary transition-colors"
          title="Thêm block"
        >
          <Plus className="h-4 w-4" />
        </button>
        {open && <AddDropdown filtered={filtered} filter={filter} setFilter={setFilter} inputRef={inputRef} onSelect={(type) => { onAdd(type); setOpen(false); }} />}
      </div>
    );
  }

  return (
    <div className="relative pl-14" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 py-2.5 px-3 text-sm rounded-lg transition-all ${open ? 'text-primary bg-primary/5' : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/30'}`}
      >
        <Plus className="h-4 w-4" />
        <span>Nhấn Tab hoặc &apos;/&apos; để chọn loại nội dung...</span>
      </button>
      {open && <AddDropdown filtered={filtered} filter={filter} setFilter={setFilter} inputRef={inputRef} onSelect={(type) => { onAdd(type); setOpen(false); }} />}
    </div>
  );
}

// ===== ADD DROPDOWN =====
function AddDropdown({ filtered, filter, setFilter, inputRef, onSelect }: {
  filtered: typeof blockTypes;
  filter: string;
  setFilter: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: (type: BlockType) => void;
}) {
  return (
    <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-border rounded-xl shadow-xl w-56 py-1.5">
      <div className="px-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-lg">
          <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/50"
            placeholder="Filter"
          />
        </div>
      </div>
      <div className="max-h-[280px] overflow-y-auto py-1 px-1">
        {filtered.length === 0 ? (
          <div className="px-3 py-3 text-sm text-muted-foreground text-center">Không tìm thấy</div>
        ) : filtered.map((bt) => {
          const Icon = bt.icon;
          return (
            <button
              key={bt.type}
              type="button"
              onClick={() => onSelect(bt.type)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left"
            >
              <Icon className="h-4 w-4 text-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{bt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===== BLOCK RENDERER =====
function BlockRenderer({ block, onChange }: { block: Block; onChange: (u: Partial<Block>) => void }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <textarea
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Nhập đoạn văn..."
          className="w-full px-3 py-2 border border-transparent hover:border-border focus:border-primary/30 rounded-lg text-sm focus:outline-none resize-none min-h-[44px] leading-relaxed bg-transparent focus:bg-[#fff0ef]/30 transition-all"
          rows={2}
        />
      );
    case 'heading2':
      return (
        <input type="text" value={block.content} onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Heading 2..."
          className="w-full px-3 py-2 border border-transparent hover:border-border focus:border-primary/30 rounded-lg text-2xl font-bold focus:outline-none bg-transparent focus:bg-[#fff0ef]/30 transition-all" />
      );
    case 'heading3':
      return (
        <input type="text" value={block.content} onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Heading 3..."
          className="w-full px-3 py-2 border border-transparent hover:border-border focus:border-primary/30 rounded-lg text-xl font-bold focus:outline-none bg-transparent focus:bg-[#fff0ef]/30 transition-all" />
      );
    case 'heading4':
      return (
        <input type="text" value={block.content} onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Heading 4..."
          className="w-full px-3 py-2 border border-transparent hover:border-border focus:border-primary/30 rounded-lg text-lg font-semibold focus:outline-none bg-transparent focus:bg-[#fff0ef]/30 transition-all" />
      );
    case 'image':
      return <ImageBlock block={block} onChange={onChange} />;
    case 'video':
      return <VideoUploader value={block.videoUrl} onChange={(url) => onChange({ videoUrl: url })} />;
    case 'quote':
      return (
        <div className="border-l-4 border-primary/40 bg-primary/5 rounded-r-lg px-4 py-2">
          <textarea value={block.content} onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Nhập trích dẫn..." rows={2}
            className="w-full bg-transparent text-sm italic focus:outline-none resize-none min-h-[44px] leading-relaxed" />
        </div>
      );
    case 'code':
      return (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800">
            <Code className="h-3.5 w-3.5 text-gray-400" />
            <input type="text" value={block.language || ''} onChange={(e) => onChange({ language: e.target.value })}
              placeholder="ngôn ngữ" className="bg-transparent text-xs text-gray-300 focus:outline-none w-24" />
          </div>
          <textarea value={block.content} onChange={(e) => onChange({ content: e.target.value })}
            placeholder="// Code..." rows={4}
            className="w-full px-4 py-3 bg-gray-900 text-green-400 font-mono text-sm focus:outline-none resize-none min-h-[80px]" />
        </div>
      );
    case 'unordered-list':
    case 'ordered-list':
      return <ListBlock block={block} onChange={onChange} ordered={block.type === 'ordered-list'} />;
    case 'checklist':
      return <ChecklistBlock block={block} onChange={onChange} />;
    default:
      return null;
  }
}

// ===== IMAGE BLOCK — tự mở file picker, hiển thị full width =====
function ImageBlock({ block, onChange }: { block: Block; onChange: (u: Partial<Block>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Tự mở file picker ngay khi block được tạo và chưa có ảnh
  useEffect(() => {
    if (!block.imageUrl) {
      setTimeout(() => inputRef.current?.click(), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { return; }
    if (file.size > 5 * 1024 * 1024) { return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange({ imageUrl: data.url });
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  // Đang upload
  if (uploading) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Đang tải ảnh lên...</p>
        </div>
      </div>
    );
  }

  // Chưa có ảnh — vùng drop nhỏ gọn
  if (!block.imageUrl) {
    return (
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-xl bg-muted/20 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <div className="text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-1" />
          <p className="text-sm text-muted-foreground">Chọn ảnh hoặc kéo thả vào đây</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    );
  }

  // Đã có ảnh — hiển thị full width đẹp
  return (
    <div className="group/img relative">
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {/* Ảnh full width, giữ đúng tỷ lệ gốc */}
      <div className="relative rounded-xl overflow-hidden bg-stone-50 border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.imageUrl}
          alt={block.content || ''}
          className="w-full h-auto block"
          style={{ display: 'block' }}
        />
        {/* Overlay controls khi hover */}
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center gap-3 opacity-0 group-hover/img:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-white text-foreground text-sm font-medium rounded-lg shadow-lg hover:bg-muted transition-colors"
          >
            Đổi ảnh
          </button>
          <button
            type="button"
            onClick={() => onChange({ imageUrl: '' })}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Caption */}
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Chú thích ảnh..."
        className="w-full mt-2 px-3 py-2 border border-border rounded-lg text-sm text-center text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 focus:text-foreground"
      />
    </div>
  );
}

function ListBlock({ block, onChange, ordered }: { block: Block; onChange: (u: Partial<Block>) => void; ordered: boolean }) {
  const items = block.items || [''];
  const updateItem = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange({ items: n }); };
  const addItem = () => onChange({ items: [...items, ''] });
  const removeItem = (i: number) => { if (items.length <= 1) return; onChange({ items: items.filter((_, idx) => idx !== i) }); };
  const handleKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter') { e.preventDefault(); const n = [...items]; n.splice(i + 1, 0, ''); onChange({ items: n }); }
    if (e.key === 'Backspace' && items[i] === '' && items.length > 1) { e.preventDefault(); removeItem(i); }
  };
  return (
    <div className="space-y-1 pl-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group/item">
          <span className="text-sm text-muted-foreground w-5 text-right flex-shrink-0">{ordered ? `${i + 1}.` : '•'}</span>
          <input type="text" value={item} onChange={(e) => updateItem(i, e.target.value)} onKeyDown={(e) => handleKey(e, i)}
            placeholder="Nhập mục..."
            className="flex-1 px-2 py-1.5 border border-transparent hover:border-border focus:border-primary/30 rounded-md text-sm focus:outline-none bg-transparent focus:bg-[#fff0ef]/30 transition-all" />
          <button type="button" onClick={() => removeItem(i)}
            className="opacity-0 group-hover/item:opacity-100 text-muted-foreground/40 hover:text-red-500 transition-all">
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-xs text-primary hover:underline flex items-center gap-1 pl-7">
        <Plus className="h-3 w-3" /> Thêm mục
      </button>
    </div>
  );
}

// ===== CHECKLIST =====
function ChecklistBlock({ block, onChange }: { block: Block; onChange: (u: Partial<Block>) => void }) {
  const items = block.checklistItems || [{ text: '', checked: false }];
  const updateItem = (i: number, u: Partial<ChecklistItem>) => { onChange({ checklistItems: items.map((item, idx) => idx === i ? { ...item, ...u } : item) }); };
  const addItem = () => onChange({ checklistItems: [...items, { text: '', checked: false }] });
  const removeItem = (i: number) => { if (items.length <= 1) return; onChange({ checklistItems: items.filter((_, idx) => idx !== i) }); };
  const handleKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter') { e.preventDefault(); const n = [...items]; n.splice(i + 1, 0, { text: '', checked: false }); onChange({ checklistItems: n }); }
  };
  return (
    <div className="space-y-1 pl-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group/item">
          <input type="checkbox" checked={item.checked} onChange={(e) => updateItem(i, { checked: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0" />
          <input type="text" value={item.text} onChange={(e) => updateItem(i, { text: e.target.value })} onKeyDown={(e) => handleKey(e, i)}
            placeholder="Nhập mục..."
            className={`flex-1 px-2 py-1.5 border border-transparent hover:border-border focus:border-primary/30 rounded-md text-sm focus:outline-none bg-transparent focus:bg-[#fff0ef]/30 transition-all ${item.checked ? 'line-through text-muted-foreground' : ''}`} />
          <button type="button" onClick={() => removeItem(i)}
            className="opacity-0 group-hover/item:opacity-100 text-muted-foreground/40 hover:text-red-500 transition-all">
            <XIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-xs text-primary hover:underline flex items-center gap-1 pl-7">
        <Plus className="h-3 w-3" /> Thêm mục
      </button>
    </div>
  );
}

// ===== HELPERS & EXPORTS =====
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

export function blocksToHtml(blocks: Block[]): string {
  return blocks.map((b) => {
    switch (b.type) {
      case 'paragraph': return b.content ? `<p>${b.content}</p>` : '';
      case 'heading2': return b.content ? `<h2>${b.content}</h2>` : '';
      case 'heading3': return b.content ? `<h3>${b.content}</h3>` : '';
      case 'heading4': return b.content ? `<h4>${b.content}</h4>` : '';
      case 'image': return b.imageUrl ? `<figure><img src="${b.imageUrl}" alt="${b.content || ''}" />${b.content ? `<figcaption>${b.content}</figcaption>` : ''}</figure>` : '';
      case 'video': {
        if (!b.videoUrl) return '';
        const ytId = getYouTubeId(b.videoUrl);
        if (ytId) return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${ytId}" allowfullscreen></iframe></div>`;
        return `<div class="video-embed"><video src="${b.videoUrl}" controls></video></div>`;
      }
      case 'quote': return b.content ? `<blockquote>${b.content}</blockquote>` : '';
      case 'code': return b.content ? `<pre><code class="language-${b.language || ''}">${b.content}</code></pre>` : '';
      case 'unordered-list': return b.items?.length ? `<ul>${b.items.filter(Boolean).map((i) => `<li>${i}</li>`).join('')}</ul>` : '';
      case 'ordered-list': return b.items?.length ? `<ol>${b.items.filter(Boolean).map((i) => `<li>${i}</li>`).join('')}</ol>` : '';
      case 'checklist': return b.checklistItems?.length ? `<ul class="checklist">${b.checklistItems.filter(i => i.text).map((i) => `<li class="${i.checked ? 'checked' : ''}">${i.text}</li>`).join('')}</ul>` : '';
      default: return '';
    }
  }).filter(Boolean).join('\n');
}

export function htmlToBlocks(html: string): Block[] {
  if (!html || html.trim() === '') return [];
  return [{ id: generateId(), type: 'paragraph', content: html.replace(/<[^>]*>/g, '') }];
}
