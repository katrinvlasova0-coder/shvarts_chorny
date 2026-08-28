import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { submitForm } from '@/lib/submitForm';
import { Mail, Loader2, Check } from 'lucide-react';

export default function SubscribeForm({ dark = false }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error'); setMsg('Введите корректный email'); return;
    }
    setState('loading'); setMsg('');
    try {
      // 1. Submit lead to Google Sheets webhook
      await submitForm({
        type: 'subscribe',
        name: name.trim(),
        email: email.trim(),
        subject: 'Рассылка новостей',
        message: 'Подписка на новости',
      });

      // 2. Also attempt Base44 subscribe function
      try {
        await base44.functions.invoke('subscribeNewsletter', { email, name });
      } catch (e) {
        // ignore if backend function is not set up
      }

      setMsg('Спасибо! Вы подписаны на новости.');
      setState('done'); setEmail(''); setName('');
    } catch (err) {
      setState('error');
      setMsg(err?.response?.data?.error || 'Не удалось подписаться. Попробуйте позже.');
    }
  };

  const labelCls = dark ? 'text-[#A9A9A9]' : 'text-[#6B6B6B]';
  const inputCls = dark
    ? 'bg-transparent border-b border-[#FDFCF8]/25 text-[#FDFCF8] placeholder-[#A9A9A9]/60 focus:border-[#FDFCF8]'
    : 'bg-transparent border-b border-[rgba(8,8,8,0.2)] text-[#080808] placeholder-[#A9A9A9] focus:border-[#080808]';
  const btnText = dark ? 'text-[#FDFCF8]' : 'text-[#080808]';
  const btnHover = dark ? 'hover:text-[#C5A059]' : 'hover:text-[#8B0000]';

  return (
    <form onSubmit={submit} className="w-full">
      <p className={`font-ui text-[10px] uppercase tracking-[0.3em] ${labelCls} mb-3`}>Рассылка новостей</p>
      {state === 'done' ? (
        <p className={`font-serif-display text-lg italic ${dark ? 'text-[#FDFCF8]' : 'text-[#080808]'}`}>{msg}</p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <Mail size={15} className={labelCls} strokeWidth={1.5} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
              placeholder="ваш@gmail.com"
              className={`w-full bg-transparent border-0 border-b py-2 font-ui text-sm focus:outline-none transition-colors ${inputCls}`}
            />
          </div>
          <button
            type="submit"
            disabled={state === 'loading'}
            className={`mt-4 font-ui text-[11px] uppercase tracking-[0.25em] ${btnText} ${btnHover} transition-colors disabled:opacity-50 inline-flex items-center gap-2`}
          >
            {state === 'loading' ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} strokeWidth={1.5} />}
            {state === 'loading' ? 'Подписываю…' : 'Подписаться'}
          </button>
          {state === 'error' && <p className="mt-2 font-ui text-[11px] text-[#8B0000]">{msg}</p>}
        </>
      )}
    </form>
  );
}
