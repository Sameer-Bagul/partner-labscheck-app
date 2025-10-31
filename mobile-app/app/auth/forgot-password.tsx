import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForgotPassword } from '@/hooks/use-auth';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/validations/auth';

export default function ForgotPassword() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      forgotPasswordSchema.parse({ email });
      setError('');
      forgotPasswordMutation.mutate({ email }, {
        onSuccess: () => {
          router.push({
            pathname: '/auth/verify-otp',
            params: { email },
          });
        },
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid email');
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
          <Text className="text-3xl font-bold text-white mb-2">Forgot Password</Text>
          <Text className="text-base text-white/90">
            Enter your email to receive a password reset code
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
            leftIcon="mail-outline"
          />

          <Button
            onPress={handleSubmit}
            isLoading={forgotPasswordMutation.isPending}
            fullWidth
            className="mt-8"
          >
            Send Reset Code
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
