import React, { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';

const IMAGES = [
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/066a3e95a_high-level-description-a-black-and-white_Tke04f5NWeqjLTPKLNxb8w_Q64RHrmFRumcjoQKsFwmUw.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/9d54d3873_high-level-description-a-black-and-white_xpGFP1L9X3q1ENRbbD91_A_sUEUOMwxQPiFHgUPk_mYhg.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/cc1797847_high-level-description-a-black-and-white_q59OsfERUPm-UtRJRcSyYw_fPynd6uIS-mtypLCKsTL0g.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/ce058e285_high-level-description-a-photorealistic-_-BdCRkYJW7C8DZfxoUdyhQ_ih1UIW-8RFO6Z7wEU6oBlw.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/1beab2bcd_high-level-description-a-black-and-white_n9Cwi6S1VgaGVVrpwlTcVQ_baYo0cOrQYaRPeH2LIv2gA.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/9233faf24_high-level-description-a-black-and-white_k9mscErCUAKnme4tGZD2YA_31k8ocm0Tzq7xpK4D0kbtA_cover.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/33abcc998_high-level-description-a-cinematic-black_Q0BQOn3hXD6x_btswN9Tpg_JaRof4tARdapsaee--gElg.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/06d3b0d28_high-level-description-a-square-fine-art_HMNlNbbiU2qAKhd9YKFhvA_tkAWz4GPSHugJ5LjSqQrGQ.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/abf581d43_high-level-description-a-photorealistic-_f1jqisabWNSq7sHv-xp65w_2r3ApU7DRsSTK-ILTyl13g_cover.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/6799ca1fb_high-level-description-a-noir-photograph_SaRKUzGnWjimZOsPXMaoIw_tE888KtFRvqEdJB06Y_n6w.png',
];

const OVERLAY = {
  dark: 'linear-gradient(to bottom, rgba(8,8,8,0.35), rgba(8,8,8,0.25) 50%, rgba(8,8,8,0.70))',
  light: 'radial-gradient(ellipse at center, rgba(253,252,248,0.35), rgba(253,252,248,0.72) 65%, rgba(253,252,248,0.92))',
};

export default function BackgroundSlideshow({ interval = 5200, opacity = 0.9, variant = 'dark' }) {
  const [pair, setPair] = useState({ cur: 0, prev: 0 });

  useEffect(() => {
    const t = setInterval(() => {
      setPair(p => ({ prev: p.cur, cur: (p.cur + 1) % IMAGES.length }));
    }, interval);
    return () => clearInterval(t);
  }, [interval]);

  // Prefetch the next image so the transition is instant and images
  // load one-at-a-time instead of all at once on mount.
  const nextIndex = (pair.cur + 1) % IMAGES.length;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute inset-0" style={{ opacity }}>
        <div key={`prev-${pair.prev}`} className="absolute inset-0 bg-fade-out">
          <Image src={IMAGES[pair.prev]} alt="" fittingType="fill"
            className="h-full w-full object-cover grayscale contrast-125" />
        </div>
        <div key={`cur-${pair.cur}`} className="absolute inset-0 bg-reveal-down">
          <Image src={IMAGES[pair.cur]} alt="" fittingType="fill"
            className="h-full w-full object-cover grayscale contrast-125" />
        </div>
        {/* Preload only the next image in the rotation */}
        <link rel="prefetch" as="image" href={IMAGES[nextIndex]} />
      </div>
      <div className="absolute inset-0" style={{ background: OVERLAY[variant] }} />
    </div>
  );
}