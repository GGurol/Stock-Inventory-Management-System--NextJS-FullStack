// app/AuthInitializer.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './authContext';

export function AuthInitializer() {
  const searchParams = useSearchParams();
  const { handleUrlParams } = useAuth();

  useEffect(() => {
    // This component's only job is to read the URL params
    // and pass them to the auth context to handle.
    // We do it here to isolate the use of `useSearchParams`.

    // CORRECTED: Added a check to ensure searchParams is not null
    if (handleUrlParams && searchParams) {
      handleUrlParams(searchParams);
    }
  }, [searchParams, handleUrlParams]);

  return null; // This component renders nothing.
}