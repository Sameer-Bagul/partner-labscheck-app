import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import apiClient from '@/lib/api-client';

export default function ForgotPassword() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-2xl font-bold text-brand-500 mb-4">Check Your Email</Text>
        <Text className="text-base text-gray-600 text-center mb-8">
          We've sent password reset instructions to {email}
        </Text>
        <Button onPress={() => router.back()}>
          Back to Sign In
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="bg-gradient-to-b from-brand-500 to-brand-700 pt-16 pb-8 px-6 rounded-b-3xl">
          <Text className="text-3xl font-bold text-white mb-2">Reset Password</Text>
          <Text className="text-base text-white/90">
            Enter your email to receive reset instructions
          </Text>
        </View>

        <View className="px-6 mt-8">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            onPress={handleResetPassword}
            isLoading={isLoading}
            className="mb-4"
          >
            Send Reset Link
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.back()}
          >
            Back to Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
