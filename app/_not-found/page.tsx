export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { NotFoundClient } from "./NotFoundClient";

export default function NotFoundPage() {
  return (
    <Suspense>
      <NotFoundClient />
    </Suspense>
  );
}