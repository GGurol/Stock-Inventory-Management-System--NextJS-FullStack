// app/business-insights/page.tsx

export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import Loading from '@/components/Loading'; // Genel bir yükleme bileşenin olduğunu varsayıyorum
import BusinessInsightsClient from './BusinessInsightsClient'; // Yeni oluşturduğumuz dosya

export default function BusinessInsightsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BusinessInsightsClient />
    </Suspense>
  );
}