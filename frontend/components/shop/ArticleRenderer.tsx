import React from 'react';
import { slugify } from '@/lib/slugify';
interface Block {
  id: string;
  type: string;
  data: any;
}

export default function ArticleRenderer({ content }: { content: string }) {
  let blocks: Block[] = [];
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.blocks) {
      blocks = parsed.blocks;
    }
  } catch (e) {
    // If it's not JSON, render it as plain text
    return (
      <div className="prose prose-stone max-w-none text-foreground leading-relaxed">
        {content.split('\n').map((paragraph, i) => (
          paragraph.trim() ? (
            <p key={i} className="mb-4 text-base text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ) : <br key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="prose prose-stone max-w-none text-foreground leading-relaxed">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={block.id}
                className="mb-4 text-base text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          case 'header': {
            const level = Number(block.data.level) || 2;
            const Tag = `h${level}` as any;
            const rawText = block.data.text || "";
            const textOnly = rawText.replace(/<[^>]*>?/gm, "").trim();
            // Create ID using slugify
            const id = textOnly ? (slugify(textOnly) || `heading-${block.id}`) : `heading-${block.id}`;
            const sizeClass =
              level === 2
                ? "text-2xl md:text-[1.65rem] mt-10 mb-4"
                : level === 3
                ? "text-xl mt-7 mb-3"
                : "text-lg mt-6 mb-2";
            return (
              <Tag
                key={block.id}
                id={id}
                className={`font-bold text-stone-900 scroll-mt-24 leading-snug ${sizeClass}`}
                dangerouslySetInnerHTML={{ __html: rawText }}
              />
            );
          }
          case 'list': {
            const isOrdered = block.data.style === 'ordered';
            const ListTag = isOrdered ? 'ol' : 'ul';
            return (
              <ListTag
                key={block.id}
                className={`pl-6 mb-5 space-y-2 text-muted-foreground ${isOrdered ? 'list-decimal' : 'list-disc'}`}
              >
                {block.data.items.map((item: any, i: number) => {
                  const htmlContent = typeof item === 'string' ? item : (item.content || '');
                  const subItems = typeof item === 'object' && Array.isArray(item.items) && item.items.length > 0 ? item.items : null;
                  return (
                    <li key={i} className="leading-relaxed">
                      <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
                      {subItems && (
                        <ListTag className={`pl-6 mt-2 space-y-1.5 ${isOrdered ? 'list-decimal' : 'list-disc'}`}>
                          {subItems.map((subItem: any, j: number) => {
                            const subHtml = typeof subItem === 'string' ? subItem : (subItem.content || '');
                            return <li key={j} dangerouslySetInnerHTML={{ __html: subHtml }} />;
                          })}
                        </ListTag>
                      )}
                    </li>
                  );
                })}
              </ListTag>
            );
          }
          case 'image':
            return (
              <figure key={block.id} className="my-8">
                <img src={block.data.file.url} alt={block.data.caption || 'Image'} className="w-full rounded-2xl" />
                {block.data.caption && (
                  <figcaption className="text-center text-sm text-stone-500 mt-2">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );
          case 'quote':
            return (
              <blockquote key={block.id} className="border-l-4 border-primary pl-4 italic text-stone-600 my-6">
                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                {block.data.caption && <cite className="block mt-2 text-sm text-stone-400">— {block.data.caption}</cite>}
              </blockquote>
            );
          default:
            return <p key={block.id} className="text-stone-400">[Unsupported block type: {block.type}]</p>;
        }
      })}
    </div>
  );
}
