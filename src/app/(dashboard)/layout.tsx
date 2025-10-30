'use client'
import isAuth from "@/components/auth/isAuth";
import AdminPanelLayout from "@/components/layout/adminlayout";
import { GoogleMapsProvider } from "@/providers/google-maps-provider";


const DashboardLayout=({
  children,
}: {
  children?: React.ReactNode;
})=> {
  return (
    <GoogleMapsProvider>
      <AdminPanelLayout>
        {children}
      </AdminPanelLayout>
     </GoogleMapsProvider>
  );
}
// export default DashboardLayout;
export default isAuth( DashboardLayout);