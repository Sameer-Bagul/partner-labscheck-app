// import { useRef, useCallback } from "react";

// const useInfiniteScroll = (
//   isFetchingNextPage: boolean,
//   hasNextPage: boolean | undefined,
//   fetchNextPage: () => void
// ) => {
//   const observer = useRef<IntersectionObserver | null>(null);

//   // IntersectionObserver callback
//   const lastTestRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isFetchingNextPage) return; // Don't observe if data is still being fetched
//       if (observer.current) observer.current.disconnect(); // Disconnect previous observer

//       // Create a new observer
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage) {
//           fetchNextPage(); // Fetch next page when the last element is in view
//         }
//       });

//       if (node) observer.current.observe(node); // Start observing the last element
//     },
//     [isFetchingNextPage, hasNextPage, fetchNextPage]
//   );

//   return { lastTestRef };
// };

// export default useInfiniteScroll;



import { useEffect, useRef } from 'react';
const useInfiniteScroll = (
  isFetchingNextPage: boolean,
  hasNextPage: boolean,
  fetchNextPage: () => void
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { lastTestRef: lastElementRef };
};

export default useInfiniteScroll;