import API from '@/lib/axios-client';

export type UpdateUserData = {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
};

export type UpdatePhoneData = {
  partnerId: number;
  phoneNo: string;
};

export const updatePhoneNumber = async (data: UpdatePhoneData) => {
  try {
    const response = await API.post('/auth/update-phone', data, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.log('error', error);

    const backendDetails =
      Array.isArray(error?.response?.data?.detail)
        ? error.response.data.detail.map((d: any) => d.msg).join(', ')
        : error?.response?.data?.detail ||
          error?.data?.detail ||
          error?.message ||
          'Update failed';

    throw new Error(backendDetails);
  }
};

export const updateUser = async (data: UpdateUserData) => {
  try {
    const response = await API.put('/user/update', data);
    return response.data;
  } catch (error: any) {
    console.log("error", error);
    const backendDetails =
      Array.isArray(error?.response?.data?.detail)
        ? error.response.data.detail.map((d: any) => d.msg).join(', ')
        : error?.response?.data?.detail ||
          error?.data?.detail ||
          error?.message ||
          "Update failed";

    throw new Error(backendDetails);
  }
};