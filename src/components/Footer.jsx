import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Youtube, Music } from 'lucide-react';
import SoundToggle from '@/components/SoundToggle';
import ContactForm from '@/components/ContactForm';

const SOCIALS = [
  { label: 'WhatsApp', href: 'https://wa.me/79958998990', icon: MessageCircle, display: '+7 995 899-89-90' },
  { label: 'Telegram', href: 'https://t.me/ShvartsBlack', icon: Send, display: '@ShvartsBlack' },
  { label: 'VK', href: 'https://vk.ru/shvarts_black', icon: MessageCircle, display: 'vk.ru/shvarts_black' },
  { label: 'Яндекс Музыка', href: 'https://music.yandex.ru/artist/25427216', icon: Music, display: 'Яндекс Музыка' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCbz9RyraI-oyH3QQkoxz27g', icon: Youtube, display: 'YouTube' },
  { label: 'Bandlink', href: 'https://band.link/GPEMW', icon: Music, display: 'Bandlink' },
];

const NAV = [
  ['Поэзия', '/poetry'],
  ['Музыка', '/music'],
  ['Шёпот', '/poetry/istorii-i-skazki'],
  ['Тишина', null],
  ['Биография', '/biography'],
  ['Новости', '/news'],
  ['СМИ', '/media'],
];

export default function Footer() {
  return (
    <footer className="ink-bg mt-32 relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[0.8fr_1.4fr_0.8fr] divide-y md:divide-y-0 md:divide-x md:border-x border-[rgba(253,252,248,0.1)] divide-[rgba(253,252,248,0.1)]">
          {/* Brand + nav */}
          <div className="pb-8 md:px-8 md:pb-0">
            <div className="font-serif-display text-3xl tracking-tight">ШВАРЦ ЧÖРНЫЙ</div>
            <p className="font-ui text-[12px] tracking-[0.15em] uppercase text-[#A9A9A9] mt-3 whitespace-normal lg:whitespace-nowrap">Источник гармонических вибраций</p>
            <ul className="mt-6 space-y-2 font-ui text-sm text-[#A9A9A9]">
              {NAV.map(([l, t]) => (
                <li key={l}>{t ? <Link to={t} className="hover:text-[#FDFCF8] transition-colors">{l}</Link> : <span className="text-[#6B6B6B]">{l}</span>}</li>
              ))}
            </ul>
          </div>

          {/* Contact form */}
          <div className="py-8 md:px-8 md:py-0">
            <div className="w-full max-w-xl mx-auto">
              <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-5">Связаться с автором</p>
              <ContactForm />
            </div>
          </div>

          {/* Socials */}
          <div className="pt-8 md:pl-8 md:pt-0">
            <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#A9A9A9] mb-3">Контакты и соцсети</p>
            <ul className="space-y-2.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 font-ui text-sm text-[#A9A9A9] hover:text-[#FDFCF8] transition-colors">
                    <s.icon size={15} strokeWidth={1.5} className="text-[#C5A059] group-hover:text-[#FDFCF8] transition-colors flex-shrink-0" />
                    <span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#6B6B6B] block">{s.label}</span>
                      {s.display}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-[rgba(253,252,248,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#6B6B6B]">© ШВАРЦ ЧÖРНЫЙ</p>
          <SoundToggle dark />
        </div>
      </div>
    </footer>
  );
}