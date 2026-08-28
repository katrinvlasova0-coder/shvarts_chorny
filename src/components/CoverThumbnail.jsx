import React, { useState } from 'react';
import { Expand, X } from 'lucide-react';

export default function CoverThumbnail({ src, alt = 'Обложка', label = 'Обложка' }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;

  return (
    <>
      <figure className="w-40 md:w-48 group cursor-pointer" onClick={() => setOpen(true)}>
        <div className="relative overflow-hidden border border-[#FDFCF8]/20 hover:border-[#FDFCF8]/50 transition-colors">
          <img src={src} alt={alt} className="w-full block" />
          <span className="absolute inset-0 flex items-center justify-center bg-[#080808]/0 group-hover:bg-[#080808]/40 transition-colors">
            <Expand size={20} className="text-[#FDFCF8] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
          </span>
        </div>
        <figcaption className="font-ui text-[9px] uppercase tracking-[0.25em] text-[#FDFCF8]/50 mt-2 text-center">{label}</figcaption>
      </figure>

      {open && (
        <div className="fixed inset-0 z-[100] bg-[#080808]/95 flex items-center justify-center p-4 md:p-10" onClick={() => setOpen(false)}>
          <button aria-label="Закрыть" className="absolute top-5 right-5 text-[#FDFCF8]/70 hover:text-[#FDFCF8] transition-colors">
            <X size={28} strokeWidth={1.5} />
          </button>
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}