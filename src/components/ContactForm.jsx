import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { submitForm } from '@/lib/submitForm';
import { Loader2, Check, Send } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error'); setMsg('Введите корректный email'); return;
    }
    if (!message.trim()) {
      setState('error'); setMsg('Введите сообщение'); return;
    }
    setState('loading'); setMsg('');
    try {
      // 1. Send lead to Google Sheets webhook
      await submitForm({
        type: 'contact',
        name: name.trim(),
        email: email.trim(),
        subject: 'Связаться с автором',
        message: message.trim(),
      });

      // 2. Also attempt Base44 function if available
      try {
        await base44.functions.invoke('sendContactMessage', { name, email, message });
      } catch (e) {
        // base44 function might fail without backend credentials, ignore if webhook succeeded
      }

      setMsg('Сообщение отправлено. Спасибо!');
      setState('done'); setName(''); setEmail(''); setMessage('');
    } catch (err) {
      setState('error');
      setMsg('Не удалось отправить. Напишите напрямую в Telegram или WhatsApp.');
    }
  };

  if (state === 'done') {
    return (
      <div className="w-full">
        <p className="font-serif-display text-lg italic text-[#FDFCF8]">{msg}</p>
        <button onClick={() => setState('idle')}
          className="mt-3 font-ui text-[11px] uppercase tracking-[0.25em] text-[#C5A059] hover:text-[#FDFCF8] transition-colors">
          Написать ещё
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full space-y-4">
      <div>
        <input type="text" value={name} onChange={(e) => { setName(e.target.value); setState('idle'); }}
          placeholder="Ваше имя"
          className="w-full bg-transparent border-b border-[#FDFCF8]/25 py-2 font-ui text-sm text-[#FDFCF8] placeholder-[#A9A9A9]/60 focus:outline-none focus:border-[#FDFCF8] transition-colors" />
      </div>
      <div>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
          placeholder="ваш@gmail.com"
          className="w-full bg-transparent border-b border-[#FDFCF8]/25 py-2 font-ui text-sm text-[#FDFCF8] placeholder-[#A9A9A9]/60 focus:outline-none focus:border-[#FDFCF8] transition-colors" />
      </div>
      <div>
        <textarea value={message} onChange={(e) => { setMessage(e.target.value); setState('idle'); }}
          placeholder="Сообщение" rows={3}
          className="w-full bg-transparent border-b border-[#FDFCF8]/25 py-2 font-ui text-sm text-[#FDFCF8] placeholder-[#A9A9A9]/60 focus:outline-none focus:border-[#FDFCF8] transition-colors resize-none" />
      </div>
      <button type="submit" disabled={state === 'loading'}
        className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.25em] text-[#FDFCF8] hover:text-[#C5A059] transition-colors disabled:opacity-50">
        {state === 'loading' ? <Loader2 size={13} className="animate-spin" /> : state === 'done' ? <Check size={13} strokeWidth={1.5} /> : <Send size={13} strokeWidth={1.5} />}
        {state === 'loading' ? 'Отправляю…' : 'Отправить'}
      </button>
      {state === 'error' && <p className="font-ui text-[11px] text-[#8B0000]">{msg}</p>}
    </form>
  );
}
