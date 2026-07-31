"use client";

import { useState, useEffect } from "react";
import { slugify } from "@/lib/slugify";
import { useTranslations } from "next-intl";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ blocks }: { blocks: any[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const t = useTranslations('BlogPage');

  useEffect(() => {
    // Helper: decode HTML entities using the browser DOM
    const decodeHtmlEntities = (html: string): string => {
      const el = document.createElement("div");
      el.innerHTML = html;
      return el.textContent || el.innerText || "";
    };

    // Lấy H2, H3 và H4
    const extracted = blocks
      .filter((b) => b.type === "header" && [2, 3, 4].includes(Number(b.data.level)))
      .map((b, i) => {
        const rawText = b.data.text || "";
        const textOnly = decodeHtmlEntities(rawText.replace(/<[^>]*>?/gm, "")).trim();
        const id = slugify(textOnly) || `heading-${b.id || i}`;
        return { id, text: textOnly, level: Number(b.data.level) };
      });
    setHeadings(extracted);
  }, [blocks]);

  // Scroll Spy logic
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px", // Kích hoạt khi thẻ H đi vào vùng nửa trên màn hình
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (headings.length < 1) return null;

  return (
    <div className="bg-stone-50 border border-stone-200 shadow-sm rounded-2xl overflow-hidden">
      {/* Header Sidebar */}
      <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-2 bg-white">
        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <h3 className="font-bold text-stone-900 uppercase tracking-wider text-sm">
          {t('tableOfContents') || 'Mục lục bài viết'}
        </h3>
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={`
                ${heading.level === 3 ? "ml-4" : ""}
                ${heading.level === 4 ? "ml-8" : ""}
              `}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`text-left transition-all duration-200 w-full line-clamp-2 border-l-[3px] pl-3 py-1.5 rounded-r-md ${
                  heading.level === 2 ? "text-[0.95rem] font-medium" :
                  heading.level === 3 ? "text-[0.875rem]" : "text-[0.8rem]"
                } ${
                  activeId === heading.id 
                    ? "text-primary font-bold border-primary bg-primary/5" 
                    : "text-stone-600 border-transparent hover:border-stone-200 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
