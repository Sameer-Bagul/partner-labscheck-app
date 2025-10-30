
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/providers/auth-Provider";

export default function isAuth<P>(
  AuthComponent: React.ComponentType<P>,
  // roles: string[] = ["user", "partner"] // default roles
) {
  return function ProtectedComponentWrapper(props: P) {


  const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // console.log('isAuth HOC:', { user, isAuthenticated, isLoading});
      if (isLoading) return;
      

      if (!user || !isAuthenticated) {
        // console.log('Redirecting to signin: Not authenticated');
        router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

    
    }, [user, isLoading, router, pathname,isAuthenticated]);

    if (isLoading || !user) {
      return  <div className='w-full h-screen flex justify-center items-center'>
                  <Spinner />
                </div>            
    }

    return <AuthComponent {...props} />;
  };
}
