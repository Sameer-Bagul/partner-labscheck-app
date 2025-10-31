import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useResetPassword } from '@/hooks/use-auth';
import { ResetPasswordFormData, resetPasswordSchema } from '@/validations/auth';

export default function ResetPassword() {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const resetPasswordMutation = useResetPassword();
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({});

  const handleReset = async () => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      resetPasswordMutation.mutate({
        ...formData,
        email: email || '',
        otp: otp || '',
      });
    } catch (error: any) {
      const formattedErrors: Partial<ResetPasswordFormData> = {};
      error.errors?.forEach((err: any) => {
        formattedErrors[err.path[0] as keyof ResetPasswordFormData] = err.message;
      });
      setErrors(formattedErrors);
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
          <Text className="text-3xl font-bold text-white mb-2">Reset Password</Text>
          <Text className="text-base text-white/90">
            Create a new password for your account
          </Text>
        </View>

        <View className="px-6 mt-8 space-y-4">
          <Input
            label="New Password"
            value={formData.password}
            onChangeText={(password) => setFormData({ ...formData, password })}
            placeholder="Enter new password"
            secureTextEntry
            error={errors.password}
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
            placeholder="Confirm new password"
            secureTextEntry
            error={errors.confirmPassword}
            leftIcon="lock-closed-outline"
          />

          <Button
            onPress={handleReset}
            isLoading={resetPasswordMutation.isPending}
            fullWidth
            className="mt-8"
          >
            Reset Password
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
