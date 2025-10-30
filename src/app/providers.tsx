"use client";

import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth"; // still needed for typing

import ProgressBarProvider from "@/providers/top-progressbar-provider";
import { AuthProvider } from "@/providers/auth-Provider";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { PhoneNumberChecker } from "@/components/ui/phone-number-checker";
import { useAuth } from "@/providers/auth-Provider";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (

    <SessionProvider session={session}>
      <Suspense fallback={<div className="w-full h-screen flex justify-center items-center">
         <Spinner />
       </div>}
       > 
      <AuthProvider>
        {/* <GoogleMapsProvider> */}
          <ProgressBarProvider />
          <QueryProvider>
            <PhoneNumberChecker />
            {children}
          </QueryProvider>
        {/* </GoogleMapsProvider> */}
      </AuthProvider>
      </Suspense>
    </SessionProvider>


  );
}


