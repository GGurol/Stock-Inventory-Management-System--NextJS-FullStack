import { Suspense } from "react";
import AppTableClient from "./AppTableClient";
import Skeleton from "@/components/Skeleton";

export default function AppTable() {
  return (
    // The Suspense boundary is required by Next.js because a child component
    // (likely FiltersAndActions) uses the useSearchParams hook.
    <Suspense 
      fallback={
        <Skeleton 
          className="h-[500px] w-full"
          rows={5} 
          columns={1}
        />
      }
    >
      <AppTableClient />
    </Suspense>
  );
}