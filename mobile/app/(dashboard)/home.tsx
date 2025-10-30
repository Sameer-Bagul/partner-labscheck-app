import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-gradient-to-b from-brand-500 to-brand-700 pt-16 pb-8 px-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'Partner'}!
        </Text>
        <Text className="text-base text-white/90">
          Here's your laboratory overview
        </Text>
      </View>

      <View className="px-6 mt-6">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Quick Stats
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold text-brand-500">24</Text>
              <Text className="text-gray-600 mt-1">Bookings</Text>
            </View>
            <View className="flex-1 items-center border-l border-r border-gray-200">
              <Text className="text-3xl font-bold text-accent-green">5</Text>
              <Text className="text-gray-600 mt-1">Labs</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold text-brand-400">89</Text>
              <Text className="text-gray-600 mt-1">Tests</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </Text>
          <Text className="text-gray-600">
            Your recent activity will appear here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
