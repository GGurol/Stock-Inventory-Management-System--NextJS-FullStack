import { Suspense } from "react";
import { ApiDocsClient } from "./ApiDocsClient";

export default function ApiDocsPage() {
  return (
    <Suspense fallback={<div>Loading API Docs...</div>}>
      <ApiDocsClient />
    </Suspense>
  );
}