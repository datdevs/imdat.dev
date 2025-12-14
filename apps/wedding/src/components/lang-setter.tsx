'use client';

import { useEffect } from 'react';

export function LangSetter() {
  useEffect(() => {
    const pathname = location.pathname;
    const lang = pathname.split('/')[1] ?? 'vi';
    document.documentElement.lang = lang;
  }, []);

  return null;
}
