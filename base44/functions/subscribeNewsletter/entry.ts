import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toString().trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Некорректный email' }, { status: 400 });
    }
    const name = (body.name || '').toString().trim();

    const base44 = createClientFromRequest(req);
    const existing = await base44.asServiceRole.entities.Subscriber.filter({ email });
    if (existing && existing.length) {
      if (!existing[0].active) {
        await base44.asServiceRole.entities.Subscriber.update(existing[0].id, { active: true });
      }
      return Response.json({ ok: true, already: true });
    }

    await base44.asServiceRole.entities.Subscriber.create({
      email,
      name,
      active: true,
      subscribedAt: new Date().toISOString(),
      source: 'site_footer'
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}