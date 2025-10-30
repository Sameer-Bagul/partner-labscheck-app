"use client";
import NextTopLoader from "nextjs-toploader";
const ProgressBarProvider = () => {
  return (
      <NextTopLoader
               color='#015165'
               initialPosition={0.1}
               crawlSpeed={200}
               height={4}
               crawl={true}
               showSpinner={false}
               easing='ease'
               speed={200}
               zIndex={1600}
               showAtBottom={false}
      />

  );
};

export default ProgressBarProvider;