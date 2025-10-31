import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { useLogout } from '@/hooks/use-auth';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logoutMutation.mutate(),
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      onPress: () => {},
    },
    {
      icon: 'lock-closed-outline',
      label: 'Change Password',
      onPress: () => {},
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      onPress: () => {},
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-12 px-6 items-center">
        <View className="bg-white rounded-full w-24 h-24 items-center justify-center mb-4 shadow-lg">
          <Text className="text-brand-500 text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-2xl font-bold text-white mb-1">
          {user?.name || 'Partner'}
        </Text>
        <Text className="text-base text-white/90">{user?.email}</Text>
        {user?.phoneNo && (
          <Text className="text-sm text-white/80 mt-1">{user.phoneNo}</Text>
        )}
      </View>

      <View className="px-6 mt-6">
        <Card variant="elevated" className="mb-4">
          <View className="flex-row items-center justify-between p-2">
            <View>
              <Text className="text-xs text-gray-500">Role</Text>
              <Text className="text-base font-semibold text-gray-800 capitalize mt-1">
                {user?.role || 'Partner'}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">User Type</Text>
              <Text className="text-base font-semibold text-gray-800 capitalize mt-1">
                {user?.user_type || 'Partner'}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Status</Text>
              <View className="flex-row items-center mt-1">
                <View className={`w-2 h-2 rounded-full mr-1 ${
                  user?.is_active ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <Text className={`text-sm font-medium ${
                  user?.is_active ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Account Settings
        </Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="bg-white rounded-xl mb-2 shadow-sm"
          >
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-lg bg-brand-50 items-center justify-center mr-3">
                  <Ionicons name={item.icon as any} size={22} color={Colors.brand[500]} />
                </View>
                <Text className="text-base text-gray-800">
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white rounded-xl mt-4 mb-8 shadow-sm"
        >
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-red-50 items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={22} color={Colors.accent.red} />
              </View>
              <Text className="text-base text-red-500 font-medium">
                Logout
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
