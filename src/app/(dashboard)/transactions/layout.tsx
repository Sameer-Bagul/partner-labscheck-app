
"use client";

import isAuth from "@/components/auth/isAuth";


const TransactionLayout = ({
  children,
}: {
  children: React.ReactNode;
}) =>{
  return <>
        {children}</>;

}

// export default LaboratoryLayout;
export default isAuth(TransactionLayout)