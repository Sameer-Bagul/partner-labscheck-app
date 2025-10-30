import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Labs() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">My Laboratories</Text>
          <TouchableOpacity className="bg-white rounded-full p-2">
            <Ionicons name="add" size={24} color="#7B2CBF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 mt-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Sample Lab
          </Text>
          <Text className="text-gray-600 mb-3">
            123 Medical Street, City
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-gray-500">Status</Text>
              <Text className="text-base font-medium text-accent-green">Active</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Tests Offered</Text>
              <Text className="text-base font-medium text-gray-800">45</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 items-center justify-center" style={{ minHeight: 200 }}>
          <Ionicons name="flask-outline" size={48} color="#E0AAFF" />
          <Text className="text-gray-600 mt-4 text-center">
            Add your first laboratory to get started
          </Text>
          <TouchableOpacity className="bg-brand-500 px-6 py-3 rounded-xl mt-4">
            <Text className="text-white font-semibold">Add Laboratory</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
