import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import apiClient from '@/lib/api-client';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const login = useAuthStore((state) => state.login);
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerifyOTP = async () => {
    setError('');
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp', {
        email,
        otp,
      });

      const { user, token } = response.data;
      await login(user, token);
      router.replace('/(dashboard)/home');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsResending(true);
    
    try {
      await apiClient.post('/auth/resend-otp', { email });
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="bg-gradient-to-b from-brand-500 to-brand-700 pt-16 pb-8 px-6 rounded-b-3xl">
          <Text className="text-3xl font-bold text-white mb-2">Verify OTP</Text>
          <Text className="text-base text-white/90">
            Enter the 6-digit code sent to {email}
          </Text>
        </View>

        <View className="px-6 mt-8">
          <Input
            label="OTP Code"
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            maxLength={6}
            error={error}
          />

          <Button
            onPress={handleVerifyOTP}
            isLoading={isLoading}
            className="mb-4"
          >
            Verify OTP
          </Button>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResendOTP} disabled={isResending}>
              <Text className="text-brand-500 font-semibold">
                {isResending ? 'Sending...' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            variant="ghost"
            onPress={() => router.back()}
            className="mt-6"
          >
            Back to Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
