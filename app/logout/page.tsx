import { Suspense } from "react";
import { LogoutClient } from "./LogoutClient";

export default function LogoutPage() {
  return (
    // The Suspense boundary is required by Next.js for pages
    // that use client-side hooks like useSearchParams.
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutClient />
    </Suspense>
  );
}