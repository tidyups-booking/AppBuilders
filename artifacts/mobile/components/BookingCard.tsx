import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '@/constants/colors';
import {
  customerName,
  formatDate,
  formatMoney,
  formatTime,
  serviceLabel,
  statusColor,
  statusLabel,
} from '@/lib/booking-utils';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Booking } from '@workspace/api-client-react';

const c = colors.light;

export function StatusBadge({ status }: { status: string }) {
  const { bg, fg } = statusColor(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>
        {statusLabel(status)}
      </Text>
    </View>
  );
}

export function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  return (
    <Pressable
      testID={`booking-card-${booking.id}`}
      onPress={() => router.push(`/booking/${booking.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {customerName(booking)}
        </Text>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={styles.service}>{serviceLabel(booking.serviceType)}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={13} color={c.mutedForeground} />
          <Text style={styles.metaText}>
            {formatDate(booking.scheduledDate)} ·{' '}
            {formatTime(booking.scheduledTime)}
          </Text>
        </View>
        <Text style={styles.price}>{formatMoney(booking.estimatedPrice)}</Text>
      </View>
      <View style={styles.metaItem}>
        <Feather name="map-pin" size={13} color={c.mutedForeground} />
        <Text style={styles.metaText} numberOfLines={1}>
          {booking.address}, {booking.city}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: c.card,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: c.border,
    padding: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: c.foreground,
  },
  service: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: c.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  metaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: c.mutedForeground,
    flexShrink: 1,
  },
  price: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: c.foreground,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
});
