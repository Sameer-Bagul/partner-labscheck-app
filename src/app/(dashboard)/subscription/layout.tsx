
"use client";

import isAuth from "@/components/auth/isAuth";


const SubscriptionLayout = ({
  children,
}: {
  children: React.ReactNode;
}) =>{
  return <>
        {children}</>;

}

// export default LaboratoryLayout;
export default isAuth(SubscriptionLayout)