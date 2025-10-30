import API from "@/lib/axios-client";

export const alllabsList = async (): Promise<any[]> => {
  try {
    // console.log("Fetching labs...");
    const res = await API.get("/partners/get-labs");
    // console.log("Response data:", res.data); // Debug response
    return res.data; // Ensure it always returns an array
  } catch (error) {
    // console.warn("Error while fetching data:", error.message);
    return []; // Return empty array on failure
  }
};

export const addNewLab = async (
  labData: FormData
): Promise<{ success: boolean; message: string } | null> => {
  try {
    // console.log("FormData content:");
    // for (const pair of labData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    const res = await API.post("/partners/add_lab", labData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.warn("Error while adding lab", error.message);
    throw error;
  }
};

export const updateLab = async (
  updateLabData: FormData
): Promise<{ success: boolean; message: string } | null> => {
  try {
    const res = await API.put(
      `/partners/update_lab/${updateLabData.get("lab_id")}`,
      updateLabData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.warn("Error while updating lab", error.message);
    throw error;
  }
};

export const getLabByID = async (id: number): Promise<any | null> => {
  try {
    const res = await API.get(`/partners/get-labs?lab_id=${id}`);
    // console.log("response from get lab by id: ", res);

    return res.data[0];
  } catch (error) {
    console.error("Error fetching lab details:", error.message);
    throw error;
  }
};
// api/deleteLab.ts
export const deleteLab = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await API.delete('/partners/delete_lab', {
      data: [id], // ✅ Backend expects ID in array format
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return res.data;
  } catch (error: any) {
    console.warn("Error while deleting lab", error.message);
    throw error;
  }
};


