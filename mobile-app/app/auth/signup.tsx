import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRegister } from '@/hooks/use-auth';
import { SignUpFormData, signUpSchema } from '@/validations/auth';

export default function SignUp() {
  const router = useRouter();
  const registerMutation = useRegister();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const handleSignUp = async () => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      registerMutation.mutate(formData);
    } catch (error: any) {
      const formattedErrors: Partial<SignUpFormData> = {};
      error.errors?.forEach((err: any) => {
        formattedErrors[err.path[0] as keyof SignUpFormData] = err.message;
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
          <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
          <Text className="text-base text-white/90">
            Join us to manage your laboratory business
          </Text>
        </View>

        <View className="px-6 mt-8 space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(name) => setFormData({ ...formData, name })}
            placeholder="Enter your full name"
            error={errors.name}
            leftIcon="person-outline"
          />

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
            label="Phone Number"
            value={formData.phone}
            onChangeText={(phone) => setFormData({ ...formData, phone })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon="call-outline"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(password) => setFormData({ ...formData, password })}
            placeholder="Create a password"
            secureTextEntry
            error={errors.password}
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
            placeholder="Confirm your password"
            secureTextEntry
            error={errors.confirmPassword}
            leftIcon="lock-closed-outline"
          />

          <Button
            onPress={handleSignUp}
            isLoading={registerMutation.isPending}
            fullWidth
            className="mt-6"
          >
            Sign Up
          </Button>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signin')}>
              <Text className="text-brand-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
