import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

export default function InventoryPageSkeleton({}: Props) {
  return (
    <div className="flex flex-col mt-10">
      <div className="space-y-2">
        <Skeleton className="h-12 w-[200px]" />
        <Skeleton className="h-6 w-[300px]" />
      </div>
      <div className="flex flex-col mt-16">
        <Skeleton className="h-12 w-[250px] mb-5" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}
