export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { ApiStatusClient } from "./ApiStatusClient"; // Make sure to create and name this component correctly

export default function ApiStatusPage() {
  return (
    <Suspense fallback={<div>Loading status...</div>}>
      <ApiStatusClient />
    </Suspense>
  );
}