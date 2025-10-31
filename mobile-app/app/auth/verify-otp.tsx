import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useVerifyOTP } from '@/hooks/use-auth';
import { verifyOTPSchema } from '@/validations/auth';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const verifyOTPMutation = useVerifyOTP();
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      verifyOTPSchema.parse({ otp });
      setError('');
      verifyOTPMutation.mutate({ email: email || '', otp }, {
        onSuccess: () => {
          router.push({
            pathname: '/auth/reset-password',
            params: { email, otp },
          });
        },
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white" bounces={false}>
        <View className="bg-brand-500 pt-16 pb-8 px-6 rounded-b-3xl">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-white text-base">← Back</Text>
          </TouchableOpacity>
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
            leftIcon="key-outline"
          />

          <Button
            onPress={handleVerify}
            isLoading={verifyOTPMutation.isPending}
            fullWidth
            className="mt-8"
          >
            Verify OTP
          </Button>

          <TouchableOpacity className="items-center mt-6">
            <Text className="text-brand-500 font-medium">
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
