import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/hooks/use-auth';
import { SignInFormData, signInSchema } from '@/validations/auth';

export default function SignIn() {
  const router = useRouter();
  const loginMutation = useLogin();
  
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<SignInFormData>>({});

  const handleSignIn = async () => {
    try {
      signInSchema.parse(formData);
      setErrors({});
      loginMutation.mutate(formData);
    } catch (error: any) {
      const formattedErrors: Partial<SignInFormData> = {};
      error.errors?.forEach((err: any) => {
        formattedErrors[err.path[0] as keyof SignInFormData] = err.message;
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
          <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-base text-white/90">
            Sign in to access your partner dashboard
          </Text>
        </View>

        <View className="px-6 mt-8 space-y-4">
          <Input
            label="Email"
            value={formData.email}
            onChangeText={(email) => setFormData({ ...formData, email })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon="mail-outline"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(password) => setFormData({ ...formData, password })}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password')}
            className="items-end"
          >
            <Text className="text-brand-500 font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            onPress={handleSignIn}
            isLoading={loginMutation.isPending}
            fullWidth
            className="mt-6"
          >
            Sign In
          </Button>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text className="text-brand-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
