import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-brand-500 to-brand-700">
      <View className="items-center px-6">
        <Text className="text-4xl font-bold text-white mb-4">
          LabsCheck
        </Text>
        <Text className="text-xl text-white mb-2">Partner Portal</Text>
        <Text className="text-base text-white/80 text-center mb-8">
          Manage your laboratory, bookings, and grow your business
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/auth/signin")}
          className="bg-white px-8 py-4 rounded-xl shadow-lg w-64 mt-4"
        >
          <Text className="text-brand-500 text-center font-semibold text-lg">
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/signup")}
          className="bg-brand-600 px-8 py-4 rounded-xl w-64 mt-4 border-2 border-white"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
