export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // bỏ dấu tiếng Việt
    .replace(/đ/g, "d")               // đ → d
    .replace(/[^a-z0-9]+/g, "-")      // mọi ký tự không phải chữ/số → -
    .replace(/-{2,}/g, "-")           // gộp nhiều --- thành 1
    .replace(/^-+|-+$/g, "");         // cắt - ở đầu và cuối
}
