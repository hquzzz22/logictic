'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { getImageUrl } from '@/lib/utils';

export default function DynamicFavicon() {
  const { companyInfo, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (!companyInfo?.favicon) return;

    const faviconUrl = getImageUrl(companyInfo.favicon);

    // Remove ALL existing favicon/icon link tags
    const existingLinks = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    );
    existingLinks.forEach((link) => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = faviconUrl + '?v=' + Date.now();
    document.head.appendChild(link);

    // Also set shortcut icon for older browsers
    const shortcut = document.createElement('link');
    shortcut.rel = 'shortcut icon';
    shortcut.type = 'image/png';
    shortcut.href = faviconUrl + '?v=' + Date.now();
    document.head.appendChild(shortcut);
  }, [companyInfo?.favicon]);

  return null;
}
