import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useBookings } from '@/hooks/use-bookings';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function Bookings() {
  const { data: bookings, isLoading, refetch } = useBookings();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        icon="calendar-outline"
        title="No Bookings"
        message="You don't have any bookings yet. They will appear here once customers book tests."
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-6 px-6">
        <Text className="text-2xl font-bold text-white">Bookings</Text>
        <Text className="text-base text-white/90 mt-1">
          {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bookings.map((booking) => (
          <Card key={booking.id} variant="elevated" className="mb-4">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {booking.testName}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="person-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1">
                    Patient: {booking.patientName}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="calendar-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {booking.date} at {booking.time}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="location-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {booking.labName}
                  </Text>
                </View>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                booking.status === 'confirmed' ? 'bg-green-100' :
                booking.status === 'pending' ? 'bg-yellow-100' :
                booking.status === 'completed' ? 'bg-blue-100' :
                'bg-red-100'
              }`}>
                <Text className={`text-xs font-medium capitalize ${
                  booking.status === 'confirmed' ? 'text-green-700' :
                  booking.status === 'pending' ? 'text-yellow-700' :
                  booking.status === 'completed' ? 'text-blue-700' :
                  'text-red-700'
                }`}>
                  {booking.status}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
              <Text className="text-xs text-gray-500">Amount</Text>
              <Text className="text-base font-bold text-brand-500">
                {formatCurrency(booking.cost)}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
