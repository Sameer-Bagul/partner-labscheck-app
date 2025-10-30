
"use client";

import isAuth from "@/components/auth/isAuth";


const LaboratoryLayout = ({
  children,
}: {
  children: React.ReactNode;
}) =>{
  return <>
        {children}</>;

}

// export default LaboratoryLayout;
export default isAuth(LaboratoryLayout)