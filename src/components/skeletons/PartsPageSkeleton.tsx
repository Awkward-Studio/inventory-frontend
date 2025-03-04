import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

export default function PartsPageSkeleton({}: Props) {
  return (
    <div className="flex flex-col mt-10">
      <div className="space-y-2">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-6 w-[200px]" />
      </div>
      <div className="flex flex-row space-x-8 mt-16 w-full justify-center">
        <Skeleton className="h-[188px] min-w-[280px] w-[416px]" />
        <Skeleton className="h-[188px] min-w-[280px] w-[416px]" />
        <Skeleton className="h-[188px] min-w-[280px] w-[416px]" />
      </div>
      <div className="flex flex-col mt-16">
        <Skeleton className="h-12 w-[250px] mb-5" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
