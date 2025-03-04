import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

export default function JobCardsPageSkeleton({}: Props) {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-20 mb-10" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-[420px]" />
        <Skeleton className="h-6 w-[300px]" />
      </div>
      <div className="flex flex-row space-x-8 mt-8">
        <div className="flex flex-col space-y-5">
          <Skeleton className="h-[188px] min-w-[280px] w-[416px]" />
          <Skeleton className="h-[188px] min-w-[280px] w-[416px]" />
        </div>
        <div>
          <Skeleton className="h-[388px] min-w-[280px] w-[416px]" />
        </div>
      </div>
      <div className="flex flex-col mt-16">
        <Skeleton className="h-12 w-[250px] mb-5" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}
