import API from '@/lib/axios-client';
interface QueryParams {
  name?:string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  offering_type?: string;
  offering_id?: number;
 
}
interface Test {
  name: string;
  parameters: { name: string }[];
  precautions?: { name: string; value?: string; unit?: string }[];
  report_delivery?: { name: string; selected: boolean }[];
  cost?: number;
  consultation?: boolean;
  home_collection?: boolean;
  report_turnaround_time?: { value: number; unit: string };
  // Add more if needed
}
export interface TestItem {
  id: number;
  name: string;
  // alsoKnownAs: string[];
}

export const getallTestsList = async ({
  name = '',
  page = 1,
  pageSize = 20,
  sortBy = "name",
  sortOrder = "asc",
  offering_type = '',
  offering_id,
}: QueryParams): Promise<any | null> => {
  try {
    const response = await API.get(`/partners/get-offerings`, {
      params: {
        ...(name ? { name } : {}),
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
        offering_type,
        ...(offering_id && { offering_id }),
      },
    });
    //  console.log("Response test data:", response.data); 
    return response.data; // Ensure the data contains paginated data
  } catch (error) {
    console.warn("Error while fetching data", error);
    throw error;
  }
};


export const getUserAddedTest = async ({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "name",
  sortOrder = "asc",
}: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<any | null> => {
  try {
    const res = await API.get('/partners/partner/tests',{
      params: {
        search,
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    });
  // console.log("test data:", res.data); 
    return res?.data;
  } catch (error) {
    console.warn('Error while fetching data', error);
     return {
      available_tests: [],
      total: 0,
    };
  }
};

export const AddNewTests = async (newTestData: { test_id: number, cost: number, labs_id: number[] }): Promise<{ success: boolean; message: string } | null> => {
  try {
    const res = await API.post('/partners/add-test', newTestData);
    return res.data;
  } catch (error) {
    console.warn('Error while adding test', error);
    throw error;
  }
};


export const addTest = async (testData: Test[]) => {
  try{
      // console.log("before api testdata",testData);
  const response = await API.post('partners/insert_basic_test', testData);
  // console.log("by api data",response.data);
  
  return response.data;
}catch(error){
    console.warn('Error while adding test', error);
    throw error;
}
};


export const getAllParameters = async () => {
  try{
    const response = await API.get('/partners/get-offerings-metadata'); 
    //  console.log("Fetched parameters/offerings: ", response);
      return response.data;
  }catch(error){
     console.warn('Error while featching parameter and packages test', error);
    throw error;
  }

 
};
export const fetchCommonTests = async (search: string): Promise<TestItem[]> => {
  const response = await API.get(`/users/common_tests`, {
    params: { search },
   
    
  });
  //  console.log("known as data",response.data.tests);
  return response.data.tests;
};

export const getBasicTests = async () => {
  try{
    const response = await API.get('/partners/get-basic-tests-suggestions'); 
    //  console.log("Fetched parameters/offerings: ", response.data);
      return response.data;
  }catch(error){
     console.warn('Error while featching parameter and packages test', error);
    throw error;
  }
};








export const DeleteTests = async ({ testId, labIds }: { testId: number; labIds: string[] }) => {
  try {
    const res = await API.delete(`/partners/tests/${testId}`, {
      params: { lab_ids: labIds }, // ✅ Send `lab_ids` as query parameters
    });
    return res.data;
  } catch (error) {
    console.error('Error while deleting test:', error);
    throw error;
  }
};


export const UpdateTests = async ({
  testId,
  cost,
  labIds,
}: { 
  testId: number; 
  cost: number; 
  labIds: number[]; 
}) => {
  try {
   

    const res = await API.patch(
      `/partners/tests/${testId}`,
      {}, // ✅ No body needed since `price` is in query params
      {
        params: { price: cost, lab_ids: labIds }, // ✅ Send `price` & `lab_ids` as query params
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error while updating test:", error);
    throw error;
  }
};


export const deleteOfferings = async (ids: number[]): Promise<any | null> => {
  try {
    const response = await API.delete("/partners/delete_offerings", {
      headers: {
        "Content-Type": "application/json",
      },
      data: ids, // this is where you send the body in DELETE request
      withCredentials: true, // optional, if cookies are required
    });
    return response.data;
  } catch (error) {
    console.warn("Error while deleting offerings", error);
    throw error;
  }
};




