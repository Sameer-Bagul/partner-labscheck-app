import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import apiClient from '@/lib/api-client';

export default function SignIn() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setErrors({ email: '', password: '' });
    
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/signin', {
        email,
        password,
      });

      const { user, token, requiresOTP } = response.data;
      
      if (requiresOTP) {
        router.push({
          pathname: '/auth/verify-otp',
          params: { email },
        });
      } else {
        await login(user, token);
        router.replace('/(dashboard)/home');
      }
    } catch (error: any) {
      setErrors({
        email: '',
        password: error.response?.data?.message || 'Sign in failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="bg-gradient-to-b from-brand-500 to-brand-700 pt-16 pb-8 px-6 rounded-b-3xl">
          <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-base text-white/90">
            Sign in to access your partner dashboard
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
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <Text className="text-brand-500 text-right mb-6">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            onPress={handleSignIn}
            isLoading={isLoading}
            className="mb-4"
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
