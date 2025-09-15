export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { LogoutClient } from "./LogoutClient";

export default function LogoutPage() {
  return (
    // This Suspense boundary is required by Next.js for pages
    // that use client-side hooks.
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutClient />
    </Suspense>
  );
}