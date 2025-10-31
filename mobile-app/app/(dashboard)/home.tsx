import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { useLabs } from '@/hooks/use-labs';
import { useTests, usePackages } from '@/hooks/use-tests';
import { useBookings } from '@/hooks/use-bookings';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors } from '@/constants/theme';
import { useState } from 'react';

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const { data: labs, isLoading: labsLoading, refetch: refetchLabs } = useLabs();
  const { data: tests, isLoading: testsLoading, refetch: refetchTests } = useTests();
  const { data: packages, isLoading: packagesLoading, refetch: refetchPackages } = usePackages();
  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useBookings();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchLabs(),
      refetchTests(),
      refetchPackages(),
      refetchBookings(),
    ]);
    setRefreshing(false);
  };

  if (labsLoading || testsLoading || packagesLoading || bookingsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const labsCount = labs?.length || 0;
  const testsCount = tests?.length || 0;
  const packagesCount = packages?.length || 0;
  const bookingsCount = bookings?.length || 0;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed')?.length || 0;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="bg-brand-500 pt-16 pb-8 px-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'Partner'}!
        </Text>
        <Text className="text-base text-white/90">
          Here's your laboratory overview
        </Text>
      </View>

      <View className="px-6 mt-6">
        <Card variant="elevated" className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Quick Stats
          </Text>
          <View className="flex-row gap-3 mb-3">
            <StatCard
              icon="flask-outline"
              iconColor={Colors.brand[500]}
              label="Labs"
              value={labsCount}
            />
            <StatCard
              icon="calendar-outline"
              iconColor={Colors.accent.green}
              label="Bookings"
              value={activeBookings}
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              icon="list-outline"
              iconColor={Colors.accent.blue}
              label="Tests"
              value={testsCount}
            />
            <StatCard
              icon="cube-outline"
              iconColor={Colors.accent.yellow}
              label="Packages"
              value={packagesCount}
            />
          </View>
        </Card>

        <Card variant="elevated" className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </Text>
          {bookings && bookings.length > 0 ? (
            <View className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <View key={booking.id} className="pb-3 border-b border-gray-100">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800">
                        {booking.testName}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        Patient: {booking.patientName}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {booking.date} at {booking.time}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100' :
                      booking.status === 'pending' ? 'bg-yellow-100' :
                      booking.status === 'completed' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        booking.status === 'confirmed' ? 'text-green-700' :
                        booking.status === 'pending' ? 'text-yellow-700' :
                        booking.status === 'completed' ? 'text-blue-700' :
                        'text-red-700'
                      }`}>
                        {booking.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-600 text-center py-8">
              No recent activity
            </Text>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}
