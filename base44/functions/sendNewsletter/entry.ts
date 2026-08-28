import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SITE_URL = 'https://shvarts-chorny.base44.app';

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const articleId = (body.article_id || '').toString();
    if (!articleId) return Response.json({ error: 'article_id required' }, { status: 400 });

    const base44 = createClientFromRequest(req);
    const article = await base44.asServiceRole.entities.NewsArticle.get(articleId);
    if (!article) return Response.json({ error: 'Статья не найдена' }, { status: 404 });

    const subscribers = await base44.asServiceRole.entities.Subscriber.filter({ active: true }, null, 1000);
    if (!subscribers || !subscribers.length) {
      return Response.json({ ok: true, sent: 0, message: 'Нет подписчиков' });
    }

    const link = `${SITE_URL}/news/${article.slug || article.id}`;
    const subject = article.title ? `${article.title} — ШВАРЦ ЧÖРНЫЙ` : 'Новая публикация — ШВАРЦ ЧÖРНЫЙ';
    const excerpt = article.excerpt ? article.excerpt.replace(/\n/g, '<br>') : '';
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #080808;">
        <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #6B6B6B;">ШВАРЦ ЧÖРНЫЙ · Архив</p>
        <h1 style="font-size: 30px; line-height: 1.15; margin: 16px 0 24px;">${article.title || 'Новая публикация'}</h1>
        ${excerpt ? `<p style="font-style: italic; color: #2B2B2B; line-height: 1.6;">${excerpt}</p>` : ''}
        <p style="margin: 28px 0;">
          <a href="${link}" style="display: inline-block; background: #080808; color: #FDFCF8; font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 28px; text-decoration: none;">Читать полностью</a>
        </p>
        <hr style="border: none; border-top: 1px solid rgba(8,8,8,0.12); margin: 32px 0;" />
        <p style="font-size: 11px; color: #A9A9A9; font-family: Arial, sans-serif;">Вы получили это письмо, подписавшись на новости ШВАРЦ ЧÖРНЫЙ.</p>
      </div>
    `;

    let sent = 0;
    let failed = 0;
    for (const s of subscribers) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: s.email,
          subject,
          body: html
        });
        sent++;
      } catch (e) {
        failed++;
      }
    }
    return Response.json({ ok: true, sent, failed, total: subscribers.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}