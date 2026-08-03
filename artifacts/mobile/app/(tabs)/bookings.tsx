import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingCard } from '@/components/BookingCard';
import colors from '@/constants/colors';
import { STATUSES, statusLabel } from '@/lib/booking-utils';
import { Feather } from '@expo/vector-icons';
import {
  getListBookingsQueryKey,
  useListBookings,
} from '@workspace/api-client-react';
import type { ListBookingsParams } from '@workspace/api-client-react';

const c = colors.light;

type StatusFilter = (typeof STATUSES)[number] | 'all';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const [filter, setFilter] = useState<StatusFilter>('all');

  const params: ListBookingsParams =
    filter === 'all' ? {} : { status: filter };
  const bookings = useListBookings(params, {
    query: { queryKey: getListBookingsQueryKey(params) },
  });

  const data = bookings.data ?? [];

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: topInset + 16, paddingHorizontal: 16 }}>
        <Text style={styles.title}>All Bookings</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, marginTop: 12 }}
        contentContainerStyle={styles.chipsRow}
      >
        {(['all', ...STATUSES] as StatusFilter[]).map((s) => {
          const active = filter === s;
          return (
            <Pressable
              key={s}
              testID={`filter-${s}`}
              onPress={() => setFilter(s)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {s === 'all' ? 'All' : statusLabel(s)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {bookings.isLoading ? (
        <ActivityIndicator color={c.primary} style={{ marginTop: 32 }} />
      ) : bookings.isError ? (
        <Text style={styles.errorText}>
          Couldn't load bookings. Pull to retry.
        </Text>
      ) : (
        <FlatList
          data={data}
          scrollEnabled={data.length > 0}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
            gap: 10,
          }}
          refreshControl={
            <RefreshControl
              refreshing={bookings.isRefetching}
              onRefresh={() => bookings.refetch()}
            />
          }
          renderItem={({ item }) => <BookingCard booking={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="inbox" size={28} color={c.mutedForeground} />
              <Text style={styles.emptyText}>
                No bookings{filter !== 'all' ? ` with status "${statusLabel(filter)}"` : ''} yet.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: c.foreground,
  },
  chipsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: c.secondary,
    borderWidth: 1,
    borderColor: c.border,
  },
  chipActive: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.secondaryForeground,
  },
  chipTextActive: {
    color: c.primaryForeground,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 48,
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
    marginTop: 32,
  },
});
