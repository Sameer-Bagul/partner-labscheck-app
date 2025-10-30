import API from '@/lib/axios-client';
import { AuthResponse, ChangePasswordSchemaType, EmailOnlyData, FormSignInData, FormSignUpData, GenerateOTPData, GeneratePhoneOTPData, ResetPasswordRequest, VerifyOTPData, VerifyPhoneOTPData } from '@/types/auth';



export const login = async (data: FormSignInData) =>{
   try {
    const response = await API.post('/auth/partner-login', data)
    return response.data;
  } catch (error: any) {
    // Extract backend detail if available
    console.log("error",error);
  const backendDetails =
  // ✅ Case: FastAPI validation errors (array of detail objects)
  Array.isArray(error?.response?.data?.detail)
    ? error.response.data.detail.map((d: any) => d.msg).join(', ')
    : error?.response?.data?.detail ||
      error?.data?.detail ||
      error?.message ||
      "Registration failed";


    // Throw a new error with normalized message
    throw new Error(backendDetails);
  }
}



export const register = async (formData: FormSignUpData) => {
  try {
    const response = await API.post('/auth/partner-register', formData);
    return response.data;
  } catch (error: any) {
    // Extract backend detail if available
    const backendDetail =
      error?.response?.data?.detail ||
      error?.data?.detail ||
      error?.message ||
      "Registration failed";

    // Throw a new error with normalized message
    throw new Error(backendDetail);
  }
};




export const logout = async () => {
  try {
    await API.post('/auth/logout');
  } catch (error) {
    console.error('Failed to logout:', error);
    throw error;
  }
};



export async function refreshAuth() {
  try {
    delete API.defaults.headers.common['Authorization'];
    // console.log("refresh not ");

    await API.post('/auth/refresh');

  } catch (error) {
    throw error;
  }
}


export async function checkUserAuth(): Promise<AuthResponse> {
  try {
    const res = await API.get('/auth/me', {
      withCredentials: true,
    });
    const user = res.data.user;
    return {
      user: {
        ...user,
        phoneNo: user.phoneNo || user.phone || null,
      },
      message: res.data.message,
      isAuthenticated: true,
    };
  } catch (error) {
    if (error.response?.status === 401 && error.response?.data?.message?.includes('expired')) {
      try {
        await refreshAuth(); // Attempt to refresh the token
        const retryRes = await API.get('/auth/me', { withCredentials: true });
        const user = retryRes.data.user;
        return {
          user: {
            ...user,
            phoneNo: user.phoneNo || user.phone || null,
          },
          message: retryRes.data.message,
          isAuthenticated: true,
        };
      } catch (refreshError) {
        console.error('AuthProvider: Token refresh failed:', refreshError);
        return {
          user: null,
          isAuthenticated: false,
          message: 'Unauthorized: Token refresh failed',
        };
      }
    }
    return {
      user: null,
      isAuthenticated: false,
      message: 'Unauthorized: Token refresh failed',
    };
  }
}




export const forgotPassword = async (formData: EmailOnlyData) => {
  const response = await API.post('/auth/otp-genarate', null, {
    params: {
      email: formData.email,
    },
  });
  return response.data;
};

export const generateEmailOTP = async (formData: GenerateOTPData) => {
  const response = await API.post('/auth/generate-email-otp', null, {
    params: {
      email: formData.email,
      name: formData.name,
    },
  });
  return response.data;
};

export const verifyOTP = async (formData: VerifyOTPData) => {
  const response = await API.post('/auth/verify-email-otp', null, {
    params: {
      email: formData.email,
      otp: formData.otp
    },
  });
  return response.data;
};

export const generateWhatsappOTP = async (formData: GeneratePhoneOTPData) => {
  const response = await API.post('/auth/generate-whatsapp-otp', null, {
    params: {
      phone_number: formData.phone_number,
    },
  });
  return response.data;
};

export const verifyWhatsappOTP = async (formData: VerifyPhoneOTPData) => {
  const response = await API.post('/auth/verify-whatsapp-otp', null, {
    params: {
      phone_number: formData.phone_number,
      otp: formData.otp
    },
  });
  return response.data;
};

export const resetPassword = async (formData: ResetPasswordRequest) => {
  const response = await API.patch('/auth/reset-password', null, {
    params: {
      email: formData.email,
      otp: formData.otp,
      new_password: formData.new_password,
    },
  });
  return response.data;
};





// export const genarateOTP = async (formData: EmailOnlyData) => {
//   const response = await API.post('/auth/otp-genarate', null, {
//     params: {
//       email: formData.email,
//     },
//   });
//   return response.data;
// };


export const changePassword = async (formData: ChangePasswordSchemaType) => {
  const response = await API.post('/auth/change-password', formData);
  return response.data;
};