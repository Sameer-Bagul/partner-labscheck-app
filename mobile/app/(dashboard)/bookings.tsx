import { View, Text, ScrollView } from 'react-native';

export default function Bookings() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-6 px-6">
        <Text className="text-2xl font-bold text-white">Bookings</Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-800">
              Blood Test - Complete
            </Text>
            <View className="bg-accent-green/10 px-3 py-1 rounded-full">
              <Text className="text-accent-green text-sm font-medium">Confirmed</Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm mb-1">Patient: John Doe</Text>
          <Text className="text-gray-600 text-sm mb-1">Date: Nov 2, 2025</Text>
          <Text className="text-gray-600 text-sm">Time: 10:00 AM</Text>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-800">
              X-Ray Scan
            </Text>
            <View className="bg-yellow-500/10 px-3 py-1 rounded-full">
              <Text className="text-yellow-600 text-sm font-medium">Pending</Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm mb-1">Patient: Jane Smith</Text>
          <Text className="text-gray-600 text-sm mb-1">Date: Nov 3, 2025</Text>
          <Text className="text-gray-600 text-sm">Time: 2:30 PM</Text>
        </View>
      </ScrollView>
    </View>
  );
}
