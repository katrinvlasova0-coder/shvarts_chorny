import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import AtmosphereBackground from '@/components/AtmosphereBackground';
import { ChevronLeft } from 'lucide-react';

export default function PoetryCategory() {
  const { categorySlug } = useParams();
  const [cat, setCat] = useState(null);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cats = await base44.entities.PoetryCategory.filter({ slug: categorySlug });
        setCat(cats?.[0] || null);
        const ps = await base44.entities.Poem.filter({ category: categorySlug, status: 'published' }, 'sortOrder', 200);
        setPoems(ps || []);
      } catch {} finally { setLoading(false); }
    })();
  }, [categorySlug]);

  const animType = cat?.animationType || (categorySlug === 'purga' ? 'snow' : 'none');

  return (
    <div className="relative min-h-screen">
      <SEO title={`${cat?.name || 'Категория'} — ШВАРЦ ЧÖРНЫЙ`} description={cat?.description} image={cat?.coverImage} />
      <AtmosphereBackground type={animType} image={cat?.background} overlay={cat ? 0.85 : 0.92} />

      <div className="relative z-10 pt-28 md:pt-36 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Link to="/poetry" className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-[#FDFCF8]/70 hover:text-[#FDFCF8] transition-colors mb-8">
            <ChevronLeft size={14} strokeWidth={1.5} /> Все стихи
          </Link>

          {loading ? (
            <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FDFCF8]/30 border-t-[#FDFCF8] rounded-full animate-spin" /></div>
          ) : (
            <>
              <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Категория</p>
              <h1 className="font-serif-display text-5xl md:text-8xl text-[#FDFCF8] leading-none">{cat?.name || categorySlug}</h1>
              {cat?.description && <p className="font-serif-display text-xl italic text-[#FDFCF8]/70 mt-6 max-w-2xl">{cat.description}</p>}

              <div className="mt-16">
                {poems.map((p, i) => (
                  <div key={p.id} className="border-b border-[#FDFCF8]/15">
                    <Link to={`/poetry/${categorySlug}/${p.slug}`} className="group block py-6 transition-all duration-500 hover:pl-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-ui text-[10px] tracking-[0.2em] text-[#FDFCF8]/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="font-serif-display text-2xl md:text-3xl text-[#FDFCF8] group-hover:text-[#C5A059] transition-colors leading-tight">{p.title}</h3>
                          </div>
                          {p.excerpt && <p className="font-serif-display italic text-[#FDFCF8]/60 mt-2 line-clamp-2">{p.excerpt}</p>}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {p.creationYear && <span className="font-ui text-[11px] tracking-[0.15em] text-[#FDFCF8]/50">{p.creationYear}</span>}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {!poems.length && <p className="font-serif-display italic text-[#FDFCF8]/50 py-10">В этой категории пока нет произведений.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
