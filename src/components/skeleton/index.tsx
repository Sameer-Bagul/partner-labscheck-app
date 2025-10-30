import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export const ListSkeleton = ({ length }) => {
  return (
    <div className="space-y-6">
      {[...Array(length)].map((_, i) => (
        <div key={i} className="flex justify-between items-center gap-2">
          <div className="w-full flex justify-between items-center p-2 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="w-64 h-6 max-w-full" />
              <Skeleton className="w-48 h-4 max-w-full" />
            </div>
            <Skeleton className="w-12 h-6 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
};



export const PageSkeleton = () => {
  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] lg:h-[90vh] p-6 md:p-12 gap-6">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 md:h-60 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-40 md:h-full w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 md:h-72 w-full rounded-lg" />
        <ListSkeleton length={5} />
      </div>
    </div>
  );
};

export function SkeletonHealthTests() {
  const [skeletonCount, setSkeletonCount] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSkeletonCount(4);
      else if (window.innerWidth >= 768) setSkeletonCount(3);
      else if (window.innerWidth >= 640) setSkeletonCount(2);
      else setSkeletonCount(1);
    };

    handleResize(); // Set initial count
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="p-4 md:p-6 bg-gray-100/50 rounded-lg">
            <Skeleton className="h-6 w-3/4 mb-4 md:mb-6" />
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full mb-2" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


export function SkeletonLabCards() {
  const [skeletonCount, setSkeletonCount] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSkeletonCount(4);
      else if (window.innerWidth >= 768) setSkeletonCount(3);
      else if (window.innerWidth >= 640) setSkeletonCount(2);
      else setSkeletonCount(1);
    };

    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100/50 rounded-2xl shadow-md">
            <Skeleton className="h-32 md:h-40 w-full mb-3 rounded-lg" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-12" />
            </div>
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-full mb-1" />
            ))}
            <div className="flex items-center mt-2">
              <Skeleton className="h-5 w-5 rounded-full mr-2" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
