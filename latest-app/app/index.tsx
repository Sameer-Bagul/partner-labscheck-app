import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(dashboard)/home');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View className="flex-1 bg-brand-500">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-12">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-6 shadow-lg">
            <Text className="text-brand-500 text-4xl font-bold">LC</Text>
          </View>
          <Text className="text-4xl font-bold text-white mb-2 text-center">
            LabsCheck
          </Text>
          <Text className="text-xl text-white/90 text-center">
            Partner Portal
          </Text>
        </View>

        <Text className="text-base text-white/80 text-center mb-12 px-4">
          Manage your laboratory, bookings, and grow your business with ease
        </Text>

        <View className="w-full max-w-sm space-y-4">
          <Button
            onPress={() => router.push('/auth/signin')}
            variant="primary"
            fullWidth
            className="bg-white"
          >
            <Text className="text-brand-500 text-lg font-semibold">Sign In</Text>
          </Button>

          <Button
            onPress={() => router.push('/auth/signup')}
            variant="outline"
            fullWidth
            className="border-2 border-white"
          >
            <Text className="text-white text-lg font-semibold">Sign Up</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
