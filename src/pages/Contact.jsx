import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SEO from '@/components/SEO';
import { submitForm } from '@/lib/submitForm';
import { toast } from 'sonner';

const SUBJECTS = [
  { value: 'general', label: 'Общий вопрос' },
  { value: 'collaboration', label: 'Сотрудничество' },
  { value: 'media', label: 'СМИ / пресса' },
  { value: 'music', label: 'Музыка' },
  { value: 'other', label: 'Другое' },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Заполните имя, email и сообщение.');
      return;
    }
    setSending(true);
    try {
      await submitForm({
        type: 'contact',
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject || 'Contact',
        message: form.message.trim(),
      });
      toast.success('Сообщение отправлено. Мы свяжемся с вами.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(
        'Не удалось отправить. Попробуйте ещё раз или напишите на contact@schwartz-chorny.com.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO
        title="Контакт — ШВАРЦ ЧÖРНЫЙ"
        description="Связаться со Шварцем Чорным: сотрудничество, пресса, музыка и общие вопросы."
        image="https://shvarts.ru/og-default.jpg"
      />

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24">
        <p className="font-ui text-[11px] uppercase tracking-[0.35em] text-[#A9A9A9] mb-4">
          Связь
        </p>
        <h1 className="font-serif-display text-6xl md:text-8xl leading-none text-[#080808]">
          Контакт
        </h1>
        <p className="font-serif-display text-lg md:text-xl italic text-[#6B6B6B] mt-6 max-w-2xl">
          Письма, предложения о сотрудничестве и вопросы по архиву.
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#A9A9A9] mb-2 block">
                    Имя *
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-transparent border-[rgba(8,8,8,0.15)] text-[#080808] h-12 font-ui rounded-none focus-visible:ring-0 focus-visible:border-[#080808]"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#A9A9A9] mb-2 block">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-transparent border-[rgba(8,8,8,0.15)] text-[#080808] h-12 font-ui rounded-none focus-visible:ring-0 focus-visible:border-[#080808]"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#A9A9A9] mb-2 block">
                  Тема
                </label>
                <Select
                  value={form.subject}
                  onValueChange={(v) => setForm({ ...form, subject: v })}
                >
                  <SelectTrigger className="bg-transparent border-[rgba(8,8,8,0.15)] text-[#080808] h-12 font-ui rounded-none focus:ring-0">
                    <SelectValue placeholder="Выберите тему" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FDFCF8] border-[rgba(8,8,8,0.12)] rounded-none">
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#A9A9A9] mb-2 block">
                  Сообщение *
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  className="bg-transparent border-[rgba(8,8,8,0.15)] text-[#080808] font-serif-display text-lg rounded-none resize-none focus-visible:ring-0 focus-visible:border-[#080808]"
                  placeholder="Ваше сообщение…"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="h-12 px-10 rounded-none bg-[#080808] text-[#FDFCF8] hover:bg-[#2B2B2B] font-ui text-[12px] uppercase tracking-[0.2em]"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#FDFCF8]/30 border-t-[#FDFCF8] rounded-full animate-spin" />
                    Отправка…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={14} strokeWidth={1.5} />
                    Отправить
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif-display text-2xl text-[#080808] mb-3">Email</h2>
              <a
                href="mailto:contact@schwartz-chorny.com"
                className="inline-flex items-center gap-2 font-ui text-sm text-[#6B6B6B] hover:text-[#080808] transition-colors"
              >
                <Mail size={14} strokeWidth={1.5} />
                contact@schwartz-chorny.com
              </a>
            </div>
            <div className="pt-6 border-t border-[rgba(8,8,8,0.08)]">
              <p className="font-serif-display text-base italic text-[#6B6B6B] leading-relaxed">
                Шварц Чорный — поэт, композитор и автор песен. Здесь собирается цифровой архив
                поэзии, музыки и историй.
              </p>
            </div>
            <p className="font-ui text-[11px] uppercase tracking-[0.15em] text-[#A9A9A9]">
              <a href="/old/" className="hover:text-[#080808] transition-colors">
                Старая версия сайта →
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
