import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const name = (body?.name || '').toString().slice(0, 200);
    const email = (body?.email || '').toString().slice(0, 200);
    const message = (body?.message || '').toString().slice(0, 5000);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Некорректный email' }, { status: 400 });
    }
    if (!message.trim()) {
      return Response.json({ error: 'Пустое сообщение' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'contact@schwartz-chorny.com',
      subject: `Обращение с сайта — ${name || 'Без имени'}`,
      body: `Имя: ${name || '—'}\nEmail: ${email}\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}