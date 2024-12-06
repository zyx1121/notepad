'use client';

import { generateNotepadId } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const notepadId = generateNotepadId(6);
    router.push(`/${notepadId}`);
  }, [router]);

  return null;
}
