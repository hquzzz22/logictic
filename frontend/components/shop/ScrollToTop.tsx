'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function ScrollToTop() {
  const pathname = usePathname();

  // Tắt browser scroll restoration để không tự khôi phục vị trí cũ khi F5/back
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll lên đầu mỗi khi đường dẫn thay đổi (bao gồm cả lần mount đầu)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    // Scroll ngay (sync) trước paint
    window.scrollTo(0, 0);
    // Scroll lại lần nữa sau khi đã render hoàn tất, đề phòng các effect khác kéo xuống
    const id = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      // Lần cuối sau khi mọi effect đã chạy xong
      window.setTimeout(() => window.scrollTo(0, 0), 50);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
