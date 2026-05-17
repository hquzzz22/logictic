'use client';

import { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export default function FloatingContact() {
  const [expanded, setExpanded] = useState(false);
  const { contactButtons, fetchSettings } = useSettingsStore();

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const phone = contactButtons?.phone;
  const zalo = contactButtons?.zalo;
  const messenger = contactButtons?.messenger;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Backdrop — click ra ngoài để đóng */}
      {expanded && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setExpanded(false)} />
      )}

      {/* Expanded options */}
      {expanded && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Phone */}
          <a
            href={`tel:${phone?.number || '0123456789'}`}
            className="flex items-center gap-3 bg-white rounded-full shadow-lg border border-border pl-4 pr-5 py-2.5 hover:shadow-xl transition-all group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Gọi ngay</div>
              <div className="text-xs text-muted-foreground">{phone?.label || '0123 456 789'}</div>
            </div>
          </a>

          {/* Zalo */}
          <a
            href={zalo?.id || 'https://zalo.me/0123456789'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full shadow-lg border border-border pl-4 pr-5 py-2.5 hover:shadow-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src="/logo_zalo.png" alt="Zalo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Chat Zalo</div>
              <div className="text-xs text-muted-foreground">Phản hồi nhanh</div>
            </div>
          </a>

          {/* Messenger */}
          <a
            href={messenger?.id || 'https://m.me/nongsanshop'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full shadow-lg border border-border pl-4 pr-5 py-2.5 hover:shadow-xl transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#0695FF] via-[#A334FA] to-[#FF6968] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.453 5.497 3.733 7.188v3.569l3.405-1.869A11.28 11.28 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.07 12.451l-2.55-2.717-4.98 2.717 5.478-5.814 2.613 2.717 4.916-2.717-5.477 5.814z"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Messenger</div>
              <div className="text-xs text-muted-foreground">Chat Facebook</div>
            </div>
          </a>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 ${
          expanded
            ? 'bg-gray-700 text-white rotate-0'
            : 'bg-primary text-white animate-bounce-gentle'
        }`}
        title="Liên hệ đặt hàng"
      >
        {expanded ? (
          <X className="h-6 w-6" />
        ) : (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
