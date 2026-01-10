'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const FacebookPixel = ({ pixelId }: { pixelId?: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;

    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(pixelId); // don't pass options for now
        ReactPixel.pageView();
      });
  }, [pixelId, pathname, searchParams]);

  return null;
};
