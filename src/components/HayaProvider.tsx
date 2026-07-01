'use client';

import { useEffect } from 'react';
import haya from '@tryhaya/analytics';

export function HayaProvider() {
  useEffect(() => {
    haya.init('e695be24-6726-4b5a-944e-c8ae5d71880c', {
      sessionReplay: true,
      heatmaps: true,
      autoTrack: { clicks: true, scrolls: true, pageviews: true },
      maskInputs: true,
    });
  }, []);

  return null;
}