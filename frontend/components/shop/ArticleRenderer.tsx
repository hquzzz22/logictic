import React from 'react';

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
          case 'header':
            const Tag = `h${block.data.level || 2}` as any;
            return (
              <Tag
                key={block.id}
                className="font-bold text-stone-900 mt-8 mb-4"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={block.id} className="pl-6 mb-4 text-muted-foreground list-inside">
                {block.data.items.map((item: any, i: number) => {
                  const htmlContent = typeof item === 'string' ? item : (item.content || '');
                  const subItems = typeof item === 'object' && Array.isArray(item.items) && item.items.length > 0 ? item.items : null;
                  return (
                    <li key={i} className="mb-2">
                      <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
                      {subItems && (
                        <ListTag className="pl-6 mt-2 list-inside">
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
