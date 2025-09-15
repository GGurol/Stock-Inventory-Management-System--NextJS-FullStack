import React from "react";
import { cn } from "@/lib/utils"; // Import the utility for merging class names

// Add className as an optional prop to the interface
interface SkeletonProps {
  rows: number;
  columns: number;
  className?: string;
}

export default function Skeleton({ rows, columns, className }: SkeletonProps) {
  return (
    // Apply the passed className to the main div
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-6 bg-gray-300 rounded w-full"
              style={{ flex: 1 }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}