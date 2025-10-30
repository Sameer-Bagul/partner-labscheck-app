import API from "@/lib/axios-client";

export const addNewPackage = async (
    packageData: any[]
  ): Promise<{ success: boolean; message: string } | null> => {
    try {
      const res = await API.post("partners/insert_packages", packageData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      return res.data;
      
    } catch (error) {
      console.warn("Error while adding package", error.message);
      throw error;
    }
  };

  export const updatePackage = async (
    updatePackageData: FormData
  ): Promise<{ success: boolean; message: string } | null> => {
    try {
      const res = await API.put(
        `/partners/update_lab/${updatePackageData.get("lab_id")}`,
        updatePackageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.warn("Error while updating package", error.message);
      throw error;
    }
  };

