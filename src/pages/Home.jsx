import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Shuffle, ArrowRight } from 'lucide-react';
import { playPageFlip } from '@/lib/sound';
import BackgroundSlideshow from '@/components/BackgroundSlideshow';

const HERO_IMG = 'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/19b7ec68c_generated_1255c9a3.png';
const MANUSCRIPT_IMG = 'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/2e7ea7d15_generated_76229a94.png';

const SHEPOT_CATS = ['istorii-i-skazki', 'poemmy-i-piessy'];

const SECONDARY = [
  { label: 'Биография', to: '/biography' },
  { label: 'Новости', to: '/news' },
  { label: 'СМИ', to: '/media' },
];

export default function Home() {
  const navigate = useNavigate();
  const [poems, setPoems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [news, setNews] = useState([]);
  const [shepot, setShepot] = useState([]);
  const [randomLoading, setRandomLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const featuredTitles = [
          'Я Бодлеровский флер',
          'Я Член Союза Писателей',
          'Ух твой ебн',
          'Профсоюзы абьюза',
          'Начинаю жопою',
        ];
        const [ps, al, nw, sh] = await Promise.all([
          base44.entities.Poem.filter({ status: 'published', title: { $in: featuredTitles } }, '-created_date', 200),
          base44.entities.MusicAlbum.list('-created_date', 3),
          base44.entities.NewsArticle.list('-date', 3),
          base44.entities.Poem.filter({ status: 'published', category: { $in: SHEPOT_CATS } }, 'sortOrder', 200),
        ]);
        const ordered = featuredTitles
          .map(t => (ps || []).find(p => p.title === t))
          .filter(Boolean);
        setPoems(ordered.length ? ordered : (ps || []));
        setPoems(ps || []);
        setAlbums(al || []);
        setNews(nw || []);
        setShepot(sh || []);
      } catch {}
    })();
  }, []);

  const openRandom = async () => {
    setRandomLoading(true);
    playPageFlip();
    try {
      const all = await base44.entities.Poem.filter({ status: 'published' }, '-created_date', 200);
      if (all && all.length) {
        const r = all[Math.floor(Math.random() * all.length)];
        navigate(`/poetry/${r.category}/${r.slug}`);
      }
    } catch {} finally { setRandomLoading(false); }
  };

  const openRandomTrack = async () => {
    setTrackLoading(true);
    playPageFlip();
    try {
      const all = await base44.entities.MusicTrack.list('-created_date', 200);
      if (all && all.length) {
        const r = all[Math.floor(Math.random() * all.length)];
        navigate(`/music/album/${r.album}/${r.slug}`);
      }
    } catch {} finally { setTrackLoading(false); }
  };

  return (
    <>
      <SEO title="ШВАРЦ ЧÖРНЫЙ — Поэзия • Музыка • Истории"
        description="Цифровой архив поэта и композитора Шварца Чорного. Стихи, музыка, истории, биография."
        image={HERO_IMG}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Person', name: 'ШВАРЦ ЧÖРНЫЙ',
          jobTitle: ['Поэт','Композитор','Писатель','Драматург'], url: window.location.href }} />

      <div className="fixed inset-0 z-0 pointer-events-none"><BackgroundSlideshow variant="light" opacity={0.5} /></div>
      <div className="relative z-10">
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex flex-col justify-center overflow-hidden">
        <BackgroundSlideshow variant="dark" opacity={0.85} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full">
          <p className="font-ui text-[8px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.4em] whitespace-nowrap text-[#FDFCF8]/60 mb-6 text-reveal">Мифы • Апокрифы • Абсурд бытия • Явь снов</p>
          <h1 className="font-serif-display text-[#FDFCF8] text-6xl sm:text-7xl md:text-9xl leading-[0.9] tracking-tight text-reveal" style={{ animationDelay: '0.1s' }}>
            ШВАРЦ<br />ЧÖРНЫЙ
          </h1>
          <p className="font-serif-display text-xl md:text-2xl font-bold not-italic text-[#FDFCF8] mt-8 text-reveal" style={{ animationDelay: '0.3s' }}>
            Источник гармонических вибраций
          </p>
          <p className="font-ui text-[8px] sm:text-[12px] uppercase tracking-[0.15em] sm:tracking-[0.25em] whitespace-nowrap text-[#FDFCF8]/50 mt-3 text-reveal" style={{ animationDelay: '0.4s' }}>
            Поэзия • Музыка • Шёпот • Тишина • ASMR
          </p>
        </div>
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
          <div className="animate-bounce font-ui text-[10px] uppercase tracking-[0.3em] text-[#FDFCF8]/40">Листай</div>
        </div>
      </section>

      {/* ENTRIES */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(8,8,8,0.08)]">
          <Link to="/poetry"
            className="group gold-shimmer bg-[#FDFCF8] p-6 md:p-8 hover:bg-[#080808] transition-colors duration-500">
            <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-[#A9A9A9] group-hover:text-[#C5A059] transition-colors">I</span>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-3 text-[#080808] group-hover:text-[#FDFCF8] transition-colors leading-none">Поэзия</h2>
            <ArrowRight size={16} strokeWidth={1} className="mt-4 text-[#6B6B6B] group-hover:text-[#FDFCF8] transition-colors" />
          </Link>
          <Link to="/music"
            className="group gold-shimmer bg-[#FDFCF8] p-6 md:p-8 hover:bg-[#080808] transition-colors duration-500">
            <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-[#A9A9A9] group-hover:text-[#C5A059] transition-colors">II</span>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-3 text-[#080808] group-hover:text-[#FDFCF8] transition-colors leading-none">Музыка</h2>
            <ArrowRight size={16} strokeWidth={1} className="mt-4 text-[#6B6B6B] group-hover:text-[#FDFCF8] transition-colors" />
          </Link>
          <Link to="/poetry/istorii-i-skazki"
            className="group gold-shimmer bg-[#FDFCF8] p-6 md:p-8 hover:bg-[#080808] transition-colors duration-500">
            <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-[#A9A9A9] group-hover:text-[#C5A059] transition-colors">III</span>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-3 text-[#080808] group-hover:text-[#FDFCF8] transition-colors leading-none">Шёпот</h2>
            <ArrowRight size={16} strokeWidth={1} className="mt-4 text-[#6B6B6B] group-hover:text-[#FDFCF8] transition-colors" />
          </Link>
          <div className="group gold-shimmer bg-[#FDFCF8] p-6 md:p-8 hover:bg-[#080808]/40 transition-colors duration-500">
            <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-[#A9A9A9]">IV</span>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-3 text-[#A9A9A9] leading-none">Тишина</h2>
            <ArrowRight size={16} strokeWidth={1} className="mt-4 text-[#D9D9D9]" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10">
          {SECONDARY.map((s) => (
            <Link key={s.to} to={s.to} className="font-ui text-[12px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] transition-colors">
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* RANDOM */}
      <section className="ink-bg py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-10">Случайное произведение</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#FDFCF8]/10 max-w-3xl mx-auto">
            <button onClick={openRandom} disabled={randomLoading}
              className="group bg-[#080808] p-8 md:p-10 text-center hover:bg-[#FDFCF8] transition-colors disabled:opacity-50">
              <Shuffle size={20} strokeWidth={1.5} className="mx-auto text-[#C5A059] group-hover:text-[#080808] transition-colors" />
              <h2 className="font-serif-display text-2xl md:text-3xl text-[#FDFCF8] group-hover:text-[#080808] leading-tight mt-4 transition-colors">Позвольте книге открыть самой себя</h2>
              <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9] group-hover:text-[#6B6B6B] mt-3 inline-block transition-colors">{randomLoading ? 'Открываю…' : 'Открыть стих'}</span>
            </button>
            <button onClick={openRandomTrack} disabled={trackLoading}
              className="group bg-[#080808] p-8 md:p-10 text-center hover:bg-[#FDFCF8] transition-colors disabled:opacity-50">
              <Shuffle size={20} strokeWidth={1.5} className="mx-auto text-[#C5A059] group-hover:text-[#080808] transition-colors" />
              <h2 className="font-serif-display text-2xl md:text-3xl text-[#FDFCF8] group-hover:text-[#080808] leading-tight mt-4 transition-colors">Позвольте музыке открыть себя самой</h2>
              <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9] group-hover:text-[#6B6B6B] mt-3 inline-block transition-colors">{trackLoading ? 'Открываю…' : 'Открыть музыку'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif-display text-4xl">Недавние стихи</h2>
              <Link to="/poetry" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Все →</Link>
            </div>
            <div className="divide-y divide-[rgba(8,8,8,0.08)]">
              {poems.map((p, i) => (
                <Link key={p.id} to={`/poetry/${p.category}/${p.slug}`} className="block py-5 group">
                  <h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{p.title}</h3>
                  {p.excerpt && <p className="font-serif-display italic text-[#6B6B6B] mt-1 line-clamp-1">{p.excerpt}</p>}
                </Link>
              ))}
              {!poems.length && <p className="font-serif-display italic text-[#A9A9A9] py-5">Стихи появятся скоро.</p>}
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif-display text-4xl">Музыка</h2>
              <Link to="/music" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Все →</Link>
            </div>
            <div className="space-y-6">
              {albums.map((a) => (
                <Link key={a.id} to={`/music/album/${a.slug}`} className="flex gap-5 group">
                  <div className="h-20 w-20 flex-shrink-0 bg-[#1a1a1a] overflow-hidden">
                    {a.cover ? <img src={a.cover} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /> :
                      <div className="h-full w-full flex items-center justify-center font-serif-display text-2xl text-[#C5A059]">{a.title?.[0]}</div>}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif-display text-xl group-hover:text-[#8B0000] transition-colors">{a.title}</h3>
                    {a.year && <p className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9]">{a.year}</p>}
                    {a.description && <p className="font-serif-display italic text-sm text-[#6B6B6B] mt-1 line-clamp-2">{a.description}</p>}
                  </div>
                </Link>
              ))}
              {!albums.length && <p className="font-serif-display italic text-[#A9A9A9]">Альбомы появятся скоро.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* MANUSCRIPT QUOTE */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <img src="https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/daafa02ee_sozdai-kartinku-knigi-poeticheskogo-sbor_ChYOA689URus9Cfcjtxn2w_GEi-lV3-RGmCVEs-ZqQ4vg.png" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'grayscale(1) contrast(1.05)', objectPosition: 'center top' }} />
        <div className="absolute inset-0 bg-[#080808]/75" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="font-serif-display text-[13px] sm:text-base md:text-2xl text-[#FDFCF8] leading-relaxed">
            Мысль, слово, мелодия — это тоже волновые процессы, меняющие окружающий мир. Искажающие или проясняющие его. Моё творчество провокативно, и здесь я не изменяю себе и своим антиномиям, где когнитивные искажения моих стихотворных смыслов встряхивают и выводят читателя из эмоционального равновесия или ментального ступора, а мелодический строй моей музыки вызывает ASMR-эффект…
          </p>
          <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mt-8">ШВАРЦ ЧÖРНЫЙ</p>
          <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9] mt-2">Из интервью «Литературной газете»</p>
          <a href="https://lgz.ru/article/vysokie-energii-i-sostoyanie-potoka/" target="_blank" rel="noopener noreferrer"
            className="inline-block mt-6 font-ui text-[11px] uppercase tracking-[0.25em] text-[#FDFCF8] border-b border-[#C5A059]/60 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
            Читать
          </a>
        </div>
      </section>

      {/* NEWS */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif-display text-4xl">Новости</h2>
          <Link to="/news" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Все →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {news.map((n) => (
            <Link key={n.id} to={`/news/${n.slug}`} className="group block">
              {n.cover && <div className="overflow-hidden mb-4 bg-[#eee]"><img src={n.cover} alt="" className="w-full block grayscale group-hover:grayscale-0 transition-all duration-500" /></div>}
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9]">{n.date && new Date(n.date).toLocaleDateString('ru-RU')}</p>
              <h3 className="font-serif-display text-xl mt-2 group-hover:text-[#8B0000] transition-colors">{n.title}</h3>
              {n.excerpt && <p className="font-serif-display italic text-[#6B6B6B] mt-1 line-clamp-2">{n.excerpt}</p>}
            </Link>
          ))}
          {!news.length && <p className="font-serif-display italic text-[#A9A9A9]">Новости появятся скоро.</p>}
        </div>
      </section>
      </div>
    </>
  );
}