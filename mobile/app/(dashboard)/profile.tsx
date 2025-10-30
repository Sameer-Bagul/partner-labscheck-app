import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-12 px-6 items-center">
        <View className="bg-white rounded-full w-24 h-24 items-center justify-center mb-4">
          <Ionicons name="person" size={48} color="#7B2CBF" />
        </View>
        <Text className="text-2xl font-bold text-white mb-1">
          {user?.name || 'Partner'}
        </Text>
        <Text className="text-base text-white/90">{user?.email}</Text>
      </View>

      <View className="px-6 mt-6">
        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={24} color="#7B2CBF" />
            <Text className="text-gray-800 ml-3 text-base">Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="card-outline" size={24} color="#7B2CBF" />
            <Text className="text-gray-800 ml-3 text-base">Subscription</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="settings-outline" size={24} color="#7B2CBF" />
            <Text className="text-gray-800 ml-3 text-base">Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text className="text-red-500 ml-3 text-base">Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
