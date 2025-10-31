import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import apiClient from '@/lib/api-client';
import { User, ApiError } from '@/types';
import { 
  SignInFormData, 
  SignUpFormData, 
  ForgotPasswordFormData,
  VerifyOTPFormData,
  ResetPasswordFormData 
} from '@/validations/auth';
import { Alert } from 'react-native';

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      const response = await apiClient.post('/auth/signin', data);
      return response.data;
    },
    onSuccess: async (data) => {
      const { user, token } = data;
      await login(user, token);
      router.replace('/(dashboard)/home');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login Error', message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await apiClient.post('/auth/signup', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: () => {
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please sign in.',
        [{ text: 'OK', onPress: () => router.replace('/auth/signin') }]
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Error', message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: async () => {
      await logout();
      router.replace('/');
    },
    onError: async () => {
      await logout();
      router.replace('/');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    },
    onSuccess: () => {
      Alert.alert('Success', 'Password reset instructions have been sent to your email.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send reset instructions.';
      Alert.alert('Error', message);
    },
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await apiClient.post('/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: () => {
      Alert.alert('Success', 'OTP verified successfully.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid OTP. Please try again.';
      Alert.alert('Error', message);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ResetPasswordFormData & { email: string; otp: string }) => {
      const response = await apiClient.post('/auth/reset-password', data);
      return response.data;
    },
    onSuccess: () => {
      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset. Please sign in with your new password.',
        [{ text: 'OK', onPress: () => router.replace('/auth/signin') }]
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reset password.';
      Alert.alert('Error', message);
    },
  });
}

export function useAuthUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const refetchUser = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  return {
    ...query,
    refetchUser,
  };
}
