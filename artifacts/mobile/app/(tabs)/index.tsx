import React from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingCard } from '@/components/BookingCard';
import colors from '@/constants/colors';
import { formatMoney } from '@/lib/booking-utils';
import { Feather } from '@expo/vector-icons';
import {
  getGetBookingStatsQueryKey,
  getGetUpcomingBookingsQueryKey,
  useGetBookingStats,
  useGetUpcomingBookings,
} from '@workspace/api-client-react';

const c = colors.light;

function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${tint}1A` }]}>
        <Feather name={icon} size={16} color={tint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const stats = useGetBookingStats({
    query: { queryKey: getGetBookingStatsQueryKey() },
  });
  const upcoming = useGetUpcomingBookings({
    query: { queryKey: getGetUpcomingBookingsQueryKey() },
  });

  const refreshing = stats.isRefetching || upcoming.isRefetching;
  const onRefresh = () => {
    stats.refetch();
    upcoming.refetch();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: topInset + 16,
        paddingBottom: 120,
        paddingHorizontal: 16,
        gap: 16,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Text style={styles.brand}>833 Tidyups</Text>
        <Text style={styles.subtitle}>Booking dashboard</Text>
      </View>

      {stats.isLoading ? (
        <ActivityIndicator color={c.primary} style={{ marginVertical: 24 }} />
      ) : stats.isError ? (
        <Text style={styles.errorText}>Couldn't load stats. Pull to retry.</Text>
      ) : stats.data ? (
        <View style={styles.statsGrid}>
          <StatCard
            icon="dollar-sign"
            label="Revenue"
            value={formatMoney(stats.data.totalRevenue)}
            tint={c.primary}
          />
          <StatCard
            icon="calendar"
            label="Upcoming"
            value={String(stats.data.upcomingCount)}
            tint={c.accent}
          />
          <StatCard
            icon="clock"
            label="Pending"
            value={String(stats.data.pendingCount)}
            tint={c.warning}
          />
          <StatCard
            icon="check-circle"
            label="Completed"
            value={String(stats.data.completedCount)}
            tint={c.success}
          />
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Next 14 days</Text>
      {upcoming.isLoading ? (
        <ActivityIndicator color={c.primary} />
      ) : upcoming.isError ? (
        <Text style={styles.errorText}>
          Couldn't load upcoming bookings. Pull to retry.
        </Text>
      ) : upcoming.data && upcoming.data.length > 0 ? (
        <View style={{ gap: 10 }}>
          {upcoming.data.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <Feather name="coffee" size={28} color={c.mutedForeground} />
          <Text style={styles.emptyText}>
            No bookings scheduled in the next two weeks.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  brand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: c.foreground,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: c.mutedForeground,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: c.card,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: c.border,
    padding: 14,
    gap: 6,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: c.foreground,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: c.mutedForeground,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: c.foreground,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: c.mutedForeground,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: c.destructive,
    textAlign: 'center',
  },
});
