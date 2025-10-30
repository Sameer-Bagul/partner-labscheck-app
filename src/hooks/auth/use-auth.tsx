
'use client'
import { changePassword, checkUserAuth, forgotPassword, generateEmailOTP, generateWhatsappOTP, login, logout, register, resetPassword, verifyOTP, verifyWhatsappOTP } from "@/app/api/auth/route";
import { useAuth } from "@/providers/auth-Provider";

import { checkUserAuthType } from "@/types/auth";
import { ApiError } from "@/types/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";


export const useLogin = (callbackUrl) => {
  // const router = useRouter();
  const { fetchUser } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      toast.success('Login successful!');
      await fetchUser(); // Re-fetch user to update AuthProvider state
      setTimeout(() => {
        // router.push(callbackUrl);
        window.location.href = callbackUrl;
      }, 200); // 200ms delay to ensure cookies are set
    },
    onError: (error:ApiError) => {
      toast.error(`Error: ${error.message || 'Login failed'}`);
    },
  });
};



export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Registration successful!");
      router.push('/signin');
    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || "Registration failed"}`);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      toast.success("Logged out successfully!")
      await signOut({ redirect: false })
      router.push('/signin')
    },
    onError: (error: ApiError) => toast.error(`Error: ${error.message || "Logout failed"}`),
  });
};


export const useForgetPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Successfully send OTP on Your Email");
    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || " failed to Send OTP"}`);
    },
  });
};

export const useVerifyOTP = () => {

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      toast.success("Your OTP is Successfully Verified");

    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || "Failed to verify your OTP"}`);
    },
  });
};

export const useGenerateOTP = () => {
  return useMutation({
    mutationFn: generateEmailOTP,
    onSuccess: (data) => {
      if (data?.status === "Success") {
        toast.success(data?.message || "OTP sent to your email");
      } else {
        toast.error(data?.message || "Enter a valid email");
      }
    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || "Failed to send OTP"}`);
    },
  });
};


export const useGeneratePhoneOTP = () => {
  return useMutation({
    mutationFn: generateWhatsappOTP,
    onSuccess: (data) => {
      if (data?.status === "Success") {
        toast.success(data?.message || "OTP sent to your whatsapp");
      } else {
        toast.error(data?.message || "Enter a valid whatsapp number");
      }
    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || "Failed to send OTP"}`);
    },
  });
};

export const useVerifyPhoneOTP = () => {

  return useMutation({
    mutationFn: verifyWhatsappOTP,
    onSuccess: () => {
      toast.success("Your whatsapp number is successfully verified");

    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || "Failed to verify your OTP"}`);
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Successfully reset your password");
      router.push('/signin')
    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || "Failed to reset your password"}`);
    },
  });
};



export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Successfully Change your Password");
    },
    onError: (error: ApiError) => {
      toast.error(`Error: ${error?.message || " failed to change your password"}`);
    },
    retry: false,
  });
};




export const useAuthUser = () => {
  const queryClient = useQueryClient();

  const query = useQuery<checkUserAuthType>({
    queryKey: ['user'],
    queryFn: async () => {
      return checkUserAuth();
    },
    retry: (failureCount, error: ApiError) => {
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });

  const refetchUser = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  return {
    ...query,
    data: query.data || { user: null, isAuthenticated: false },
    isLoading: query.isLoading,
    refetchUser,
  };
};
