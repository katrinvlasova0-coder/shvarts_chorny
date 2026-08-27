import React, { useEffect } from 'react';

export default function SEO({ title, description, image, jsonLd, type = 'website' }) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const absoluteImage = image
      ? image.startsWith('http')
        ? image
        : `https://shvarts.ru${image.startsWith('/') ? image : `/${image}`}`
      : 'https://shvarts.ru/og-default.jpg';

    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:url', window.location.href, 'property');
    setMeta('og:image', absoluteImage, 'property');
    setMeta('og:site_name', 'ШВАРЦ ЧÖРНЫЙ', 'property');
    setMeta('og:locale', 'ru_RU', 'property');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', absoluteImage);
    setMeta('twitter:card', 'summary_large_image');

    let ldEl = null;
    if (jsonLd) {
      ldEl = document.getElementById('jsonld-dynamic');
      if (!ldEl) {
        ldEl = document.createElement('script');
        ldEl.id = 'jsonld-dynamic';
        ldEl.type = 'application/ld+json';
        document.head.appendChild(ldEl);
      }
      ldEl.textContent = JSON.stringify(jsonLd);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    return () => {
      if (ldEl) ldEl.textContent = '';
    };
  }, [title, description, image, jsonLd, type]);

  return null;
}
