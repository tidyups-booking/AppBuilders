import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '@/components/BookingCard';
import colors from '@/constants/colors';
import {
  STATUSES,
  customerName,
  formatDate,
  formatMoney,
  formatTime,
  frequencyLabel,
  serviceLabel,
  statusLabel,
} from '@/lib/booking-utils';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  getGetBookingQueryKey,
  getGetBookingStatsQueryKey,
  getGetUpcomingBookingsQueryKey,
  getListBookingsQueryKey,
  useDeleteBooking,
  useGetBooking,
  useUpdateBooking,
} from '@workspace/api-client-react';

const c = colors.light;

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Feather name={icon} size={15} color={c.mutedForeground} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const booking = useGetBooking(bookingId, {
    query: {
      enabled: !Number.isNaN(bookingId),
      queryKey: getGetBookingQueryKey(bookingId),
    },
  });

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetBookingStatsQueryKey() });
    queryClient.invalidateQueries({
      queryKey: getGetUpcomingBookingsQueryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: getGetBookingQueryKey(bookingId),
    });
  }

  const update = useUpdateBooking({
    mutation: {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        invalidateAll();
      },
    },
  });

  const remove = useDeleteBooking({
    mutation: {
      onSuccess: () => {
        invalidateAll();
        router.back();
      },
    },
  });

  function confirmDelete() {
    Alert.alert(
      'Delete booking',
      'This will permanently remove the booking. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => remove.mutate({ id: bookingId }),
        },
      ],
    );
  }

  if (booking.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  if (booking.isError || !booking.data) {
    return (
      <View style={styles.center}>
        <Feather name="alert-circle" size={28} color={c.destructive} />
        <Text style={styles.errorText}>Booking not found.</Text>
        <Pressable onPress={() => booking.refetch()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const b = booking.data;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: Platform.OS === 'web' ? 60 : 34,
        gap: 16,
      }}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Text style={styles.name}>{customerName(b)}</Text>
          <StatusBadge status={b.status} />
        </View>
        <Text style={styles.service}>
          {serviceLabel(b.serviceType)} · {frequencyLabel(b.frequency)}
        </Text>
        <Text style={styles.price}>{formatMoney(b.estimatedPrice)}</Text>
        <View style={styles.contactRow}>
          <Pressable
            testID="button-call"
            onPress={() => Linking.openURL(`tel:${b.phone}`)}
            style={styles.contactBtn}
          >
            <Feather name="phone" size={16} color={c.primaryForeground} />
            <Text style={styles.contactText}>Call</Text>
          </Pressable>
          {b.email ? (
            <Pressable
              testID="button-email"
              onPress={() => Linking.openURL(`mailto:${b.email}`)}
              style={[styles.contactBtn, styles.contactBtnSecondary]}
            >
              <Feather name="mail" size={16} color={c.primary} />
              <Text style={[styles.contactText, { color: c.primary }]}>
                Email
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow
          icon="calendar"
          label="Date"
          value={`${formatDate(b.scheduledDate)} at ${formatTime(b.scheduledTime)}`}
        />
        <DetailRow
          icon="map-pin"
          label="Address"
          value={`${b.address}, ${b.city}${b.postalCode ? ` ${b.postalCode}` : ''}`}
        />
        <DetailRow icon="phone" label="Phone" value={b.phone} />
        <DetailRow
          icon="home"
          label="Home"
          value={`${b.bedrooms} bed · ${b.bathrooms} bath`}
        />
        {b.extras && b.extras.length > 0 ? (
          <DetailRow icon="plus" label="Extras" value={b.extras.join(', ')} />
        ) : null}
        {b.notes ? (
          <DetailRow icon="file-text" label="Notes" value={b.notes} />
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Update status</Text>
      <View style={styles.statusWrap}>
        {STATUSES.map((s) => {
          const active = b.status === s;
          return (
            <Pressable
              key={s}
              testID={`status-${s}`}
              disabled={active || update.isPending}
              onPress={() =>
                update.mutate({ id: bookingId, data: { status: s } })
              }
              style={[styles.statusChip, active && styles.statusChipActive]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  active && styles.statusChipTextActive,
                ]}
              >
                {statusLabel(s)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        testID="button-delete"
        onPress={confirmDelete}
        disabled={remove.isPending}
        style={({ pressed }) => [
          styles.deleteBtn,
          (pressed || remove.isPending) && { opacity: 0.7 },
        ]}
      >
        <Feather name="trash-2" size={16} color={c.destructive} />
        <Text style={styles.deleteText}>
          {remove.isPending ? 'Deleting...' : 'Delete booking'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: c.background,
  },
  headerCard: {
    backgroundColor: c.card,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    gap: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: c.foreground,
  },
  service: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: c.primary,
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: c.foreground,
  },
  contactRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: c.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  contactBtnSecondary: {
    backgroundColor: c.secondary,
  },
  contactText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: c.primaryForeground,
  },
  card: {
    backgroundColor: c.card,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.mutedForeground,
    width: 64,
  },
  detailValue: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: c.foreground,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: c.foreground,
  },
  statusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: c.secondary,
    borderWidth: 1,
    borderColor: c.border,
  },
  statusChipActive: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  statusChipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.secondaryForeground,
  },
  statusChipTextActive: { color: c.primaryForeground },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: c.destructive,
    borderRadius: colors.radius,
    paddingVertical: 13,
  },
  deleteText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: c.destructive,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: c.foreground,
  },
  retryBtn: {
    backgroundColor: c.primary,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  retryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: c.primaryForeground,
  },
});
