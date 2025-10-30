
"use client";

import isAuth from "@/components/auth/isAuth";


const FranchiseLayout = ({
  children,
}: {
  children: React.ReactNode;
}) =>{
  return <>
        {children}</>;

}

// export default LaboratoryLayout;
export default isAuth(FranchiseLayout)